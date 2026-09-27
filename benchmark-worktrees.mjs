#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmdirSync, statfsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const worktreeCount = 5;
const repo = dirname(fileURLToPath(import.meta.url));
const activeWorktrees = new Set();
const results = [];
let benchmarkDir;
let cleaningUp = false;

function command(program, args, { cwd = repo, capture = false } = {}) {
  const result = spawnSync(program, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });

  if (result.error || result.status !== 0) {
    const detail = capture ? `\n${result.stderr?.trim() ?? ''}` : '';
    throw new Error(`${program} ${args.join(' ')} failed${detail}`, { cause: result.error });
  }

  return capture ? result.stdout.trim() : undefined;
}

function timed(program, args, options) {
  const start = performance.now();
  command(program, args, options);
  return (performance.now() - start) / 1000;
}

function sizeKiB(directory) {
  if (!existsSync(directory)) return 0;
  const output = command('du', ['-sk', directory], { capture: true });
  return Number(output.split(/\s+/, 1)[0]);
}

function freeBytes(directory) {
  const filesystem = statfsSync(directory, { bigint: true });
  return filesystem.bavail * filesystem.bsize;
}

function mib(kib) {
  return (kib / 1024).toFixed(1);
}

function gib(bytes) {
  return (Number(bytes) / 1024 ** 3).toFixed(2);
}

function total(field) {
  return results.reduce((sum, result) => sum + result[field], 0);
}

function cleanup() {
  if (cleaningUp || !benchmarkDir) return;
  cleaningUp = true;

  for (const worktree of activeWorktrees) {
    try {
      command('git', ['worktree', 'remove', '--force', worktree]);
      activeWorktrees.delete(worktree);
    } catch (error) {
      console.error(`Could not remove ${worktree}: ${error.message}`);
      process.exitCode = 1;
    }
  }

  try {
    rmdirSync(benchmarkDir);
  } catch {
    console.error(`Benchmark directory remains at ${benchmarkDir}`);
    process.exitCode = 1;
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.error(`Interrupted by ${signal}; removing benchmark worktrees.`);
    cleanup();
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

try {
  if (resolve(command('git', ['rev-parse', '--show-toplevel'], { capture: true })) !== repo) {
    throw new Error('Run this script from a Git checkout of this repository.');
  }

  const commit = command('git', ['rev-parse', 'HEAD'], { capture: true });
  const store = command('pnpm', ['store', 'path'], { capture: true });
  benchmarkDir = mkdtempSync(join(dirname(repo), 'disk-perf-worktrees-'));
  const freeBefore = freeBytes(benchmarkDir);
  const storeBeforeKiB = sizeKiB(store);

  console.log(`Benchmarking ${worktreeCount} worktrees from ${commit}`);
  console.log(`Temporary worktrees: ${benchmarkDir}`);

  for (let index = 1; index <= worktreeCount; index++) {
    const worktree = join(benchmarkDir, String(index));
    const result = { index, worktree };
    activeWorktrees.add(worktree);
    console.log(`\nCreating worktree ${index}/${worktreeCount}`);
    result.createSeconds = timed('git', ['worktree', 'add', '--detach', worktree, commit]);
    results.push(result);
  }

  const freeAfterCreate = freeBytes(benchmarkDir);
  for (const result of results) result.createdKiB = sizeKiB(result.worktree);

  for (const result of results) {
    console.log(`\nInstalling in worktree ${result.index}/${worktreeCount}`);
    result.installSeconds = timed('pnpm', ['install', '--offline', '--frozen-lockfile'], {
      cwd: result.worktree,
    });
  }

  const freeAfterInstall = freeBytes(benchmarkDir);
  const storeAfterKiB = sizeKiB(store);
  for (const result of results) result.installedKiB = sizeKiB(result.worktree);

  for (const result of results) {
    console.log(`\nRemoving worktree ${result.index}/${worktreeCount}`);
    result.removeSeconds = timed('git', ['worktree', 'remove', '--force', result.worktree]);
    activeWorktrees.delete(result.worktree);
  }

  const freeAfterRemove = freeBytes(benchmarkDir);

  console.log('\n| Worktree | Create (s) | Install (s) | Remove (s) | Fresh size (MiB) | Installed size (MiB) |');
  console.log('|---|---:|---:|---:|---:|---:|');
  for (const result of results) {
    console.log(`| ${result.index} | ${result.createSeconds.toFixed(2)} | ${result.installSeconds.toFixed(2)} | ${result.removeSeconds.toFixed(2)} | ${mib(result.createdKiB)} | ${mib(result.installedKiB)} |`);
  }
  console.log(`| **Five total** | **${total('createSeconds').toFixed(2)}** | **${total('installSeconds').toFixed(2)}** | **${total('removeSeconds').toFixed(2)}** | **${mib(total('createdKiB'))}** | **${mib(total('installedKiB'))}** |`);

  console.log(`\nDisk free-space change after creation: ${gib(freeBefore - freeAfterCreate)} GiB used`);
  console.log(`Disk free-space change after five installs: ${gib(freeBefore - freeAfterInstall)} GiB used`);
  console.log(`Disk free-space reclaimed after removal: ${gib(freeAfterRemove - freeAfterInstall)} GiB`);
  console.log(`Net disk free-space change after removal: ${gib(freeBefore - freeAfterRemove)} GiB used`);
  console.log(`pnpm store size change: ${mib(storeAfterKiB - storeBeforeKiB)} MiB`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  cleanup();
}

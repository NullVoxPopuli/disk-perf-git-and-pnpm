# disk-perf-git-and-pnpm

This repo aims to prove that something is wrong with APFS on macOS, but is also a good stress test in general when changing machine tooling that wants to oberve fs events (such as security tooling / EDR / virus scanners / etc).


## The Test

Steps:
1. Setup 
2. Gather Results 
3. Report / PR with your Results ❤️

### Setup

have `node` @ >= 22.11 
have `pnpm` @ >= 10.2

(if you have [proto](https://moonrepo.dev/proto) (with auto-install) or [volta](https://volta.sh/) installed, these versions will be selected for you)

```bash
git clone git@github.com:NullVoxPopuli/disk-perf-git-and-pnpm.git
cd disk-perf-git-and-pnpm

pnpm install # Fill the cache so we don't hit the network during testing
```

### Gather Results

Since you've installed all the dependencies already,
we can start with the _clean_ test:
```bash 
time ( git clean -Xfd; git clean -fd )
```

And then once that finishes, we can run the _install_ test:
```bash
time ( pnpm install )
```

if you're using zsh, your time will be `total`.

<details><summary>example</summary>

```bash
0.01s user 0.00s system 94% cpu 0.007 total
#.                              ^ this number
```

</details>

if you're using bash, your time will be `real`.

<details><summary>example</summary>

```bash
real    2.02s # this number
user    0.00s
sys     0.01s
```

</details>

### PR your Results back to this Repo:

| CPU | RAM (GB) | Clean (s) | Install (s) | Date | FileSystem & Disk |
| --- | -------- | --------- | ----------- | ---- | ----- |
| AMD Ryzen 5 7640U 12 Core | 92 | 6.8 | 5.9 | 2025-02-07 | Ext4 : WD Black SN850 500GB | 
| AMD Ryzen 9 7900X 12/24 Core | 64 | 6.0 | 4.3 | 2025-02-07 | Ext4 : Samsung SSD 980 Pro 2TB | 
| Apple M1 Max | 64 | 21.299 | 219 | 2025-02-08 | APFS (Encrypted) : APPLE SSD AP1024R 1TB |
| Apple M4 | 16 | 29.6 | 31.4 | 2025-02-08 | APFS (Encrypted) : APPLE SSD AP1024Z 1TB |
| AMD Ryzen 7 7800X3D 8 Core | 32 | 17.1 | 16.1 | 2025-02-09 | Ext4 : Corsair MP600 PRO LPX |
| AMD Ryzen 7 7800X3D 8 Core | 32 | 65.5 | 42.3 | 2025-02-09 | NTFS : Corsair MP600 PRO LPX |

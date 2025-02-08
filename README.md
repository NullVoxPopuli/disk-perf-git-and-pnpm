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

(if you have proto or volta installed, these versions will be selected for you)

```bash
git clone git@github.com:NullVoxPopuli/disk-perf-git-and-pnpm.git
cd disk-perf-git-and-pnpm

pnpm install # Fill the cache so we don't hit the network during testing
```

### Gather Results

Since you've installed all the dependencies already,
we can start with the _clean_ test:
```bash 
time ( git clean -Xfd; git celan -fd )
```

And then once that finishes, we can run the _install_ test:
```bash
time ( pnpm install )
```


### PR your Results back to this Repo:

| CPU | RAM (GB) | Clean (s) | Install (s) | Date | Notes |
| --- | -------- | --------- | ----------- | ---- | ----- |
| AMD Ryzen 9 7900X 12/24 Core | 64GB | | | | 

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


Windows Powershell:
```powershell
(Measure-Command { git clean -Xfd; git clean -fd }).ToString()
```

And then once that finishes, we can run the _install_ test:
```bash
time ( pnpm install )
```

Windows Powershell:
```powershell
(Measure-Command { pnpm install }).ToString()
```

<details><summary>If using zsh</summary>
  
your time will be `total`.

```bash
0.01s user 0.00s system 94% cpu 0.007 total
#.                              ^ this number
```

and round to the tenths decimal place

</details>

<detailS><summary>if using bash</summary>

your time will be `real`.

```bash
real    2.02s # this number
user    0.00s
sys     0.01s
```

and round to the tenths decimal place

</detailS>

### PR your Results back to this Repo:

| CPU | RAM (GB) | Clean (s) | Install (s) | Date | FileSystem & Disk | OS |
| --- | -------- | --------- | ----------- | ---- | ----- | --- |
| AMD Ryzen 5 7640U 12 Core | 92 | 6.8 | 5.9 | 2025-02-07 | Ext4 : WD Black SN850 500GB | Ubuntu 24.04.1 |
| AMD Ryzen 9 7900X 12/24 Core | 64 | 6.0 | 4.3 | 2025-02-07 | Ext4 : Samsung SSD 980 Pro 2TB | Ubuntu 24.04.1 |
| Apple M1 Pro | 16 | 42.2 | 44.0 | 2025-02-09 | APFS (Encrypted) : APPLE SSD AP0512R 500GB | macOS 15.3 |
| Apple M1 Max | 64 | 31.5 | 44.2 | 2025-02-08 | APFS (Encrypted) : APPLE SSD AP1024R 1TB | macOS 14.7.3 |
| Apple M4 | 16 | 29.6 | 31.4 | 2025-02-08 | APFS (Encrypted) : APPLE SSD AP1024Z 1TB | |
| AMD Ryzen 7 7800X3D 8 Core | 32 | 17.1 | 16.1 | 2025-02-09 | Ext4 : Corsair MP600 PRO LPX | Ubuntu 22.04.3 |
| AMD Ryzen 7 7800X3D 8 Core | 32 | 65.5 | 42.3 | 2025-02-09 | NTFS : Corsair MP600 PRO LPX | Windows 10 Pro 22H2 |
| AMD Ryzen 5 7800X3D 8 Core | 64 | 69.5 | 73.3 | 2025-02-09 | NTFS : WD Black SN850x 2TB | Windows 11 Pro 23H2 |
| AMD Ryzen 5 7800X3D 8 Core | 64 | 23.7 | 19.0 | 2025-02-09 | Ext4 : WD Black SN850x 2TB | W11 Pro 23H2 / WSL2 / Ubuntu 24.04 |
| Intel i5-1145G7 8 Core | 32 | 1.9 | 15.3 | 2025-02-10 | Ext4 : BC711 NVMe SK hynix 512GB | Debian Trixie |



## What to do for now?

If you're on macOS, there are some options:
- Put everything in a RAM disk: https://gist.github.com/boxabirds/b92fec28c58e6c2cc9513f16c2bbeb91
  - or OverlayFS via Docker 
- use a Linux VM to get ext4 speeds








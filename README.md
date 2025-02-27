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
git clone https://github.com/NullVoxPopuli/disk-perf-git-and-pnpm.git
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

</details>

<details><summay>How to find your disk info</summay>

#### MacOS

1. Apple Menu
2. "About this Mac" (a window appears)
3. "More Info..." (a window appears)
4. scroll down and click "System Report..." (a window appears)
5. in the left nav of this third window, click "NVMExpress"
  
</details>

### PR your Results back to this Repo

[and interact with the results here](https://markdown-table.nullvoxpopuli.com/?file=https%3A%2F%2Fraw.githubusercontent.com%2FNullVoxPopuli%2Fdisk-perf-git-and-pnpm%2Frefs%2Fheads%2Fmain%2FREADME.md&key=&cv=%5B%5B%22%20Clean%20(s)%20%22%2C%22%2300aa00%22%2C%22%23aa0000%22%5D,%5B%22%20Install%20(s)%20%22%2C%22%2300aa00%22%2C%22%23aa0000%22%5D%5D)

| Date       | CPU                                   | RAM (GB) | Clean (s) | Install (s) | OS                                       | FileSystem          | Disk                              | Notable Software Changes |
|------------|---------------------------------------|----------|-----------|-------------|------------------------------------------|---------------------|-----------------------------------|--------------------------|
| 2025-02-07 | AMD Ryzen 5 7640U 12 Core             | 92       | 6.8       | 5.9         | Ubuntu 24.04.1                           | Ext4                | WD Black SN850 500GB              |                          |
| 2025-02-24 | AMD Ryzen 5 7640U throttle to ~550Mhz | 92       | 56        | 44          | Ubuntu 24.10                             | Ext4                | WD Black SN850 500GB              |                          |
| 2025-02-07 | AMD Ryzen 9 7900X 12/24 Core          | 64       | 6.0       | 4.3         | Ubuntu 24.04.1                           | Ext4                | Samsung SSD 980 Pro 2TB           |                          |
| 2025-02-07 | AMD Ryzen 9 7900X 12/24 Core          | 64       | 3.3       | 4.0         | Ubuntu 24.04.1                           | tmpfs (ramdisk)     | G.Skill F5-6000J3040G32G          |                          |
| 2025-02-09 | Apple M1 Pro                          | 16       | 42.2      | 44.0        | macOS 15.3                               | APFS (Encrypted)    | APPLE SSD AP0512R 500GB           |                          |
| 2025-02-08 | Apple M1 Max                          | 64       | 31.5      | 44.2        | macOS 14.7.3                             | APFS (Encrypted)    | APPLE SSD AP1024R 1TB             |                          |
| 2025-02-08 | Apple M4                              | 16       | 29.6      | 31.4        | macOS 15.2                               | APFS (Encrypted)    | APPLE SSD AP1024Z 1TB             |                          |
| 2025-02-09 | AMD Ryzen 7 7800X3D 8 Core            | 32       | 17.1      | 16.1        | Ubuntu 22.04.3                           | Ext4                | Corsair MP600 PRO LPX             |                          |
| 2025-02-09 | AMD Ryzen 7 7800X3D 8 Core            | 32       | 65.5      | 42.3        | Windows 10 Pro 22H2                      | NTFS                | Corsair MP600 PRO LPX             |                          |
| 2025-02-09 | AMD Ryzen 5 7800X3D 8 Core            | 64       | 69.5      | 73.3        | Windows 11 Pro 23H2                      | NTFS                | WD Black SN850x 2TB               |                          |
| 2025-02-09 | AMD Ryzen 5 7800X3D 8 Core            | 64       | 23.7      | 19.0        | W11 Pro 23H2 / WSL2 / Ubuntu 24.04       | Ext4                | WD Black SN850x 2TB               |                          |
| 2025-02-10 | Intel i5-1145G7 8 Core                | 32       | 1.9       | 15.3        | Debian Trixie                            | Ext4                | BC711 NVMe SK hynix 512GB         |                          |
| 2025-02-12 | Apple M1 Max                          | 32       | 71.4      | 87.7        | macOS 14.6.1                             | APFS (Encrypted)    | APPLE SSD AP2048R 2TB             |                          |
| 2025-02-12 | Apple M4 Pro (14 Cores)               | 48       | 30.1      | 65.1        | macOS 15.3                               | APFS (Encrypted)    | APPLE SSD AP2048Z 2TB             |                          |
| 2025-02-13 | Apple M1 Ultra                        | 64       | 45.2      | 137.5       | macOS 15.3                               | APFS                | APPLE SSD AP1024R 1TB             |                          |
| 2025-02-14 | Apple M2 Max (6 vCPU)                 | 16       | 3.2       | 12          | Ubuntu 24.04 (virtualized via Parallels) | Ext4                | APPLE SSD AP1024Z                 |                          |
| 2025-02-14 | Apple M2 Max (6 vCPU)                 | 16       | 2.8       | 11.9        | Ubuntu 24.04 (virtualized via Parallels) | Ext4 LVM2 Encrypted | APPLE SSD AP1024Z                 |                          |
| 2025-02-14 | Apple M2 Max (6 vCPU)                 | 16       | 1.6       | 10.7        | Ubuntu 24.04 (virtualized via Parallels) | tmpfs (ramdisk)     | Hynix LPDDR5 / Virtual RAM        |                          |
| 2025-02-15 | Apple M1 Pro                          | 32       | 44.5      | 50.2        | macOS 15.3                               | APFS (Encrypted)    | APPLE SSD AP0512R 500GB           |                          |
| 2025-02-19 | Apple M1                              | 16       | 37.8      | 33.3        | macOS 15.3.1                             | APFS (Encypted)     | APPLE SSD AP0512Q 500GB           |                          |
| 2025-02-19 | Apple M1 Pro                          | 16       | 59.4      | 69.1        | macOS 14.7.3                             | APFS (Encrypted)    | APPLE SSD AP1024R 1TB             |                          |
| 2025-02-21 | Apple M3                              | 16       | 36.23     | 30.3        | macOS 15.3                               | APFS                | APPLE SSD AP0256Z 256GB           |                          |
| 2025-02-20 | Apple M4 Max (16 Cores)               | 128      | 36.7      | 64.5        | macOS 15.2                               | APFS (Encrypted)    | APPLE SSD AP2048Z 2TB             |                          |
| 2025-02-20 | Apple M3                              | 24       | 46.6      | 44.6        | macOS ??                                 | APFS                | APPLE SSD AP1024Z 1TB             |                          |
| 2025-02-21 | Intel Core i7 14700K (20 Cores)       | 64       | 3.1       | 13.8        | W10 22H2 / WSL2 / Ubuntu 24.04           | Ext4                | WD Black 2TB SN850                |                          |
| 2025-02-22 | Apple M3 Pro                          | 18       | 37.7      | 40          | macOS 15.3                               | APFS                | APPLE SSD AP1024Z 1TB             |                          |
| 2025-02-24 | Apple M2 Pro                          | 32       | 34.6      | 32.0        | macOS 13.6                               | APFS                | APPLE SSD AP0512Z                 |                          |
| 2025-02-25 | Apple M3                              | 16       | 34.213    | 27.851      | macOS 15.3.1                             | APFS                | APPLE SSD AP1024Z                 |                          |
| 2025-02-25 | Apple M3 Pro (12 Core, 6p6e)          | 36       | 47.8      | 52.6        | macOS 14.7.4                             | APFS                | APPLE SSD AP0512Z 500GB           |                          |
| 2025-02-25 | Apple M3 Pro (12 Core, 6p6e)          | 36       | 32        | 53.3        | macOS 14.7.4                             | APFS                | APPLE SSD AP0512Z 500GB           | Spotlight disabled       |
| 2025-02-25 | Apple M3 Pro (12 Core, 6p6e)          | 36       | 26.3      | 19.9        | macOS 14.7.4                             | APFS                | APPLE SSD AP0512Z 500GB           | Spotlight disabled, `csrutil disable` |
| 2025-02-26 | Apple M2 Max (12 Core, 8p4e)          | 32       | 41.4      | 39.8        | macOS 15.3.1                             | APFS (Encrypted)    | APPLE SSD AP1024Z 1TB             | Spotlight disabled, Kandji, Sentinal One |


----------------------

## What to do for now?

If you're using macOS, and your file system performance is unbearable, there are some options:

- https://gist.github.com/boxabirds/b92fec28c58e6c2cc9513f16c2bbeb91
  - Put everything in a RAM disk: 
  - or OverlayFS via Docker 
- use a Linux VM to get ext4 speeds








# 第 7 篇｜最终发布包校验记录

校验日期：2026-09-27  
校验脚本：`source/package-final.js`  
源目录：`images-v2/`  
唯一上传目录：`final-images/`

## 校验结论

- 最终目录仅包含预期的 10 张 PNG，没有 V1、预览图或其他文件。
- 10 张图片全部为 1200×1600。
- 每张 `final-images/` 图片与同名 `images-v2/` 图片 SHA-256 完全一致。
- 上传顺序由两位数字文件名前缀固定为 01～10。

## SHA-256

- `01-cover.png`：`349e350a286f5841a8de8c02de2157873bb91747d0c7877c24452bf5da250732`
- `02-editing.png`：`d5d1d7a9b8a94a8bc72dccb706d91d2ed6160b5fdde2507feaaad9ee9a867e25`
- `03-selection.png`：`a4a08bbc2b416becd4ff677f68f64e03d518723b0f4f0ff629fb6ff552faf0e0`
- `04-windows.png`：`c447798f331e7be1507390a20c2c73233d9fe38b65dfad4980124fc7d3fecdbb`
- `05-system.png`：`e8c7aaf5fc6fdbf2110889d10b50ebf44466a0d1862a4dfbdbe7bf316228aed9`
- `06-capture-input.png`：`a9e7d132159c072d067d3a74c4e01ff38968f4a3d2a386993d58ed3d70a057a8`
- `07-files.png`：`683623ebf63127974b4f5771ca46847ac2b6dcb86871652150d60f4a229e63e0`
- `08-browser.png`：`068bcfbd1a6d1d89ec13ef5d107f5d9b52498835ccdfd36f8adc89630a270982`
- `09-desktops.png`：`85440ea8cbf53c16a2a292c7f9213498deabbc9bd93d1b03030fba4e633e92db`
- `10-top12.png`：`5efe4d93d079226450db1b805eca82c31303e1e02315a910ef4e3529bec3d1d9`

本记录只证明本地最终包与通过内容复审的 V2 一致，不代表 B 已完成最终发布包质量验收，也不代表已经发布。


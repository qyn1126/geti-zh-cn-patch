# Geti 3.2.0 简体中文补丁

将 Geti 的项目、数据集、标注、训练、推理及相关操作界面接入简体中文，并提供中英文切换入口。

适用上游：[open-edge-platform/geti](https://github.com/open-edge-platform/geti)，标签 `app/v3.2.0`，提交 **`9456821d060a2143cf05a2e01504acbb9924a578`**。

本仓库保存本次中文化的增量交付文件：**312 个修改文件、4 个新增文件**。使用前需要已有上述版本的 Geti 源码或部署环境。

## 包含内容

| 路径 | 用途 |
| --- | --- |
| [USAGE.md](USAGE.md) | 中文使用、应用补丁、构建及回退说明 |
| [files/application/ui](files/application/ui) | 修改后的完整文件，保留上游相对目录 |
| [patches/geti-zh-cn.patch](patches/geti-zh-cn.patch) | 包含修改文件和新增文件的 Git 补丁 |
| [tools/apply_patch.py](tools/apply_patch.py) | 校验基线、文件完整性、应用或回退补丁 |
| [manifest.json](manifest.json) | 基线版本、文件状态及 SHA-256 校验值 |
| [FILE_LIST.md](FILE_LIST.md) | 全部 316 个文件的清单 |
| [docs/VALIDATION.md](docs/VALIDATION.md) | 已完成的验证及现有检查限制 |
| [launchers/windows](launchers/windows) | 本机部署使用的 Windows 启停脚本 |
| [LICENSE](LICENSE) / [NOTICE](NOTICE) | 上游 Apache-2.0 许可证及说明 |

未打包训练数据、数据库、模型权重、Python 环境、Node 依赖、构建缓存、TLS 证书或 GitHub 凭据。依赖版本沿用上游锁文件。

## 快速应用

需要 Git 和 Python 3.10 或更高版本。补丁工具仅使用 Python 标准库。

以下命令在同时包含 `geti/` 和本仓库 `geti-zh-cn-patch/` 的父目录中执行：

```sh
python geti-zh-cn-patch/tools/apply_patch.py geti --check
python geti-zh-cn-patch/tools/apply_patch.py geti --apply
```

应用后按 [USAGE.md](USAGE.md) 重新构建 `geti/application/ui`。完整文件位于 `files/`，便于审阅；优先使用补丁工具，避免直接覆盖其他改动。

## 切换为中文

在页面右上角的 **Language / 语言** 选择 **简体中文**，或打开：

```text
https://localhost:7860/projects?lng=zh-CN
```

切换语言会刷新当前页面，请先保存未完成的表单。选择会保存在浏览器中；如仍显示旧界面，使用 `Ctrl+F5` 强制刷新。

中文化覆盖训练参数名称、说明、选项、内置模型说明和常见任务进度提示。用户输入的项目/标签名称、文件名、模型标识、API 参数值及原始诊断日志保留原文。当前提供简体中文和英文，繁体中文浏览器地区回退到简体中文。

## 许可与来源

本包包含上游源码的修改版本，保留原文件版权声明。改动范围见 [FILE_LIST.md](FILE_LIST.md)，功能和验证说明见上述文档。第三方依赖和模型权重没有随本包分发，其使用要求请参阅上游说明。

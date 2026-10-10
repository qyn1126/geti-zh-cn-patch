# 验证记录

本记录对应本包的 Geti `app/v3.2.0` 中文化修改，基线提交为 `9456821d060a2143cf05a2e01504acbb9924a578`。

## 前端验证

- 生产构建 `npm run build`：通过，静态资源前缀为 `/html/`。
- TypeScript 类型检查 `npm run type-check`：通过。
- ESLint `npm run lint`：通过。
- 格式检查 `npm run format:check`：通过。
- 国际化单元测试：2 个测试文件、19 项测试通过。
- 浏览器测试：使用 Microsoft Edge，4 项本地化测试通过。
- 本机服务检查：`/health` 返回 `{"status":"ok"}`，中文首页没有浏览器页面错误。

浏览器测试覆盖：

1. 自动使用中文、切换英文、刷新后保留语言选择，再切回中文；静态任务菜单同步更新。
2. 项目名称即使与翻译词条相同（例如 `Training`），也保持用户输入的名称。
3. 数据集导航、训练高级设置和推理配置显示中文。
4. 中文参数选项选择“窗宽窗位”时，提交给模拟接口的值仍为 `Windowing`，参数键保持原始 API 格式。

浏览器测试使用模拟接口，覆盖界面与请求参数，不代表重新运行了模型训练。

## 全量检查中的现有问题

完整单测尝试中，502 项测试通过；其余涉及 UI 依赖的测试受到当前 Windows / Vitest 依赖解析问题影响。报错指向 `@geti-ui/ui/dist/esm/208.js` 引用的 `/node_modules/@geti-ui/ui/dist/esm/0~rslib-runtime.js`，不能据此声称全量单测通过。

循环依赖检查发现以下两条路径；已核对基线源码也包含对应导入关系：

- `features/annotator/video-player/api/use-video-frames-predictions.ts` ↔ `features/annotator/api/use-media-predictions.ts`。
- `features/dataset/providers/media-upload-provider.component.tsx` ↔ `features/dataset/gallery/upload-details-dialog/upload-details-dialog.component.tsx`。

## 补丁包验证

导出保留了原 Geti 工作区的 Git 索引；使用独立索引生成包含全部新增文件的补丁。发布前已在指定基线的独立工作区中通过以下检查：

- 补丁与文件清单均包含 316 个文件：312 个修改文件、4 个新增文件。
- 应用前检查、实际应用和全部 316 个文件的 SHA-256 核对通过。
- 重复检查正确识别为已应用。
- 回退前检查和实际回退通过，回退后 Git 工作区干净。
- README、使用说明和文件清单中的本地链接均有效。
- 对发布文件进行凭据特征、私钥特征、数据/权重文件类型和本机用户目录检查，未发现匹配项。

发布内容仅限源码、测试、文档、补丁及通用启动脚本。数据、依赖环境、构建产物、缓存、证书和认证信息均不在发布清单中。

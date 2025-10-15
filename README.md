## Color Helper
图色助手，为 [assttyys_autojs](https://github.com/zzliux/assttyys_autojs) 提供专门的取色、分析工具。

## 开发环境设置

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 使用
按一般逻辑取色，但该工具主要为锚点比色服务：
1. 键盘ASD分配取按锚点LCR取色；空格或鼠标左键根据屏幕位置自动设置锚点（但大概率不准，需要根据游内的实际控件位置的对齐方向设置）
2. 支持多区域添加，找色也根据所选区域进行找色；
3. 执行器扩展：参考`src/components/ColorHelper/executor/DefaultExecutor.ts`，实现`IExecutor`接口，并在`src/components/ColorHelper/index.ts`中调用`registerExecutor`注册执行器
4. 因浏览器限制，adb截图需额外本地运行独立的桥服务，内测中联系作者获取
5. **剪贴板导入图片**：
   - 点击"剪贴板"按钮从剪贴板导入图片
   - 或直接使用 Ctrl+V (Cmd+V) 快捷键粘贴图片
   - 支持多种图片格式（PNG、JPG、WEBP等）

## 故障排除

### MIME 类型错误
如果遇到以下错误：
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/vnd.trolltech.linguist"
```

这是因为某些服务器将 `.ts` 文件识别为 Qt Linguist 翻译文件而非 TypeScript 文件。本项目已通过 Vite 配置解决此问题。请确保：
1. 使用 `npm run dev` 而非直接打开 `index.html` 文件
2. 生产环境使用 `npm run build` 构建后的 `dist` 目录
3. 如需预览构建结果，使用 `npm run preview`

## 感谢
 - [yiszza/ScriptGraphicHelper](https://gitee.com/yiszza/ScriptGraphicHelper) 综合图色助手，参考了该工具的交互逻辑
 - [yiszza/ScriptLib](https://gitee.com/yiszza/ScriptLib) 锚点比色、找色工具，本项目将该项目的关键算法从java移植到了ts

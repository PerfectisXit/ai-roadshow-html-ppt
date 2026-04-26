# AI Roadshow HTML PPT

这是一个单文件 HTML 路演项目。

## 先看哪里

如果你要继续修改这个项目，默认只先看两个文件：

- [README_AI接手指南.md](./README_AI接手指南.md)
- [ai-roadshow-2.0.html](./ai-roadshow-2.0.html)

其中：

- `README_AI接手指南.md`
  - 当前唯一交接文件
  - 包含当前页结构、格式排版要求、标题/页码规则、流式输出硬规则、截图与复核方法
- `ai-roadshow-2.0.html`
  - 当前唯一工作主文件

## 当前状态

- 当前产物：`ai-roadshow-2.0.html`
- 形态：单文件 HTML
- 画幅：固定 `16:9`
- 打开方式：本地浏览器直接打开

```bash
open ai-roadshow-2.0.html
```

## 截图与页码

项目内置截图脚本：

- `capture-slide.js`

常用命令：

```bash
node capture-slide.js --file ai-roadshow-2.0.html --list
node capture-slide.js --file ai-roadshow-2.0.html --slide p14
node capture-slide.js --file ai-roadshow-2.0.html --slide s34
```

## 其他文件

仓库里还有旧规划、旧思路、旧版 HTML、历史修改记录等文件，但已经统一归档到：

- [历史归档](./历史归档/)

它们默认都只是历史参考。

如果这些文件与当前交接指南或当前 `html` 冲突：

1. 以 `README_AI接手指南.md` 为先
2. 再以 `ai-roadshow-2.0.html` 为先

不要把旧文档当成当前状态。

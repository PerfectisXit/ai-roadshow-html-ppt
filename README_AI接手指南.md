# AI Roadshow HTML 接手指南

这份文档给新会话里的 AI 用。

目标不是解释全部实现细节，而是让 AI 在最短时间内：

- 知道项目是什么
- 知道关键文件在哪里
- 知道 HTML 单文件内部怎么快速定位
- 知道哪些组件和动画已经存在
- 知道修改后该如何截图复核

## 1. 项目概况

- 主文件：`/Users/xpan/Desktop/ai 分享/ai-roadshow.html`
- 产物形态：单文件 HTML 路演版 PPT
- 画幅：固定 `1920x1080`，通过 `transform scale` 自适应窗口
- 总页数：`51` 页
- 使用方式：浏览器打开本地文件，通过键盘翻页
- 当前状态：已完成多轮精修，重点方向是“减少文字堆砌，用动作型示例组件和微动画增强讲演感”

## 2. 开始前先看哪些文件

如果是新会话接手，建议按这个顺序看：

1. `/Users/xpan/Desktop/ai 分享/README_AI接手指南.md`
2. `/Users/xpan/Desktop/ai 分享/html_ppt_设计要求汇总.md`
3. `/Users/xpan/Desktop/ai 分享/html_ppt_全量需求与复用指南.md`
4. `/Users/xpan/Desktop/ai 分享/html_ppt_SKILL草案.md`
5. `/Users/xpan/Desktop/ai 分享/ai_roadshow_修改规格说明.md`
6. `/Users/xpan/Desktop/ai 分享/ai-roadshow.html`

其中：

- 前 4 份更偏“用户要求和设计方向”
- `ai_roadshow_修改规格说明.md` 更偏“历史修改要求”
- `ai-roadshow.html` 是唯一真正要改的实现文件

## 3. 单文件 HTML 的内部结构

`ai-roadshow.html` 是一个完整的单页 PPT 应用，内部大致分成 4 块：

### A. 全局样式区

文件开头到 `const brandIcon` 之前，基本都是 CSS。

重要内容：

- 主题变量：`:root`
- 画幅和舞台：`#app`、`#deck-shell`、`#deck`
- 幻灯片基础结构：`.slide`、`.slide-header`、`.slide-body`、`.body-wrap`
- 通用卡片体系：`.card`、`.proof-card`、`.rail-card`、`.quote-card`、`.roadmap-card`
- 布局模板：`.statement-shell`、`.focus-stage`、`.scenario-board`、`.governance-board`
- 组件类：`.micro-flow`、`.token-row`、`.feature-pair`、`.decision-mini-grid`、`.warning-card`、`.redline`

### B. 品牌资源

检索关键词：

- `const brandIcon = {`

这里集中定义品牌 logo 的资源地址。

### C. slides 数据区

检索关键词：

- `const slides = [`

这是整份 PPT 的核心内容数据源。

每页基本长这样：

```js
{
  id: "s39",
  layout: "strategy",
  kicker: "...",
  title: "...",
  subtitle: "...",
  html: `...`
}
```

重要字段：

- `id`: 页号标识，格式基本是 `s01` 到 `s51`
- `layout`: 页面布局模板
- `className`: 额外样式控制，比如 `micro`
- `noHeader` / `noPage`: 章节页常用
- `html`: 当前页主体 DOM

### D. 渲染与动画逻辑

检索关键词：

- `function renderDeck()`
- `function fitDeck()`
- `function showSlide(index)`
- `function runAnimations(slide, token)`

这几块负责：

- 把 `slides` 数组渲染成真正的 DOM
- 根据窗口缩放到 16:9
- 控制翻页和 hash
- 为当前页播放动画

## 4. 快速定位页内容的方法

最常用的方法不是从头滚文件，而是直接搜页 ID。

例如：

- 搜 `id: "s39"` 找第 39 页
- 搜 `id: "s47"` 找第 47 页
- 搜 `id: "s50"` 找第 50 页

高频重点页：

- `s39` 本地化部署
- `s42` 三种偏差
- `s43` 责任与思考
- `s44` 四条红线
- `s46` 公司级价值总起
- `s47` AI 数据平台
- `s48` AI 辅助决策
- `s49` AI 辅助运营
- `s50` 12 个月推进路径
- `s51` 结束页

## 5. 当前主要布局类型

`layout` 是快速理解页面结构的入口。

### `statement`

适合：

- 强观点页
- 总起页
- 升华页

典型页：

- `s32`
- `s46`
- `s51`

结构特点：

- 左侧主观点大舞台
- 右侧 2 到 3 张支撑卡

### `demo`

适合：

- 对话演示
- 搜索演示
- 桌面操作演示

典型页：

- `s05`
- `s10`
- `s21`
- `s25`
- `s27`
- `s31`

### `strategy`

适合：

- 业务场景页
- 系统结构页

典型页：

- `s39`
- `s47`
- `s48`
- `s49`

### `decision`

适合：

- 总结页
- 路线图页
- 对比收束页

典型页：

- `s38`
- `s50`

### `governance`

适合：

- 责任
- 风险
- 判断边界

典型页：

- `s43`

### `atlas`

适合：

- 方法论
- 工具地图

典型页：

- `s34`
- `s35`
- `s36`
- `s40`

## 6. 已存在的核心动态组件

不要重复发明新组件。优先复用已有组件。

### 对话类

检索：

- `playChatDemo`
- `.chat-stream`

用途：

- Mac 风格对话
- 提示词输入
- AI 思考中
- 流式输出

### 步骤链类

检索：

- `buildSteps`
- `playSteps`
- `.steps[data-steps]`

用途：

- 六步链路
- 流程分步激活

### 桌面操作类

检索：

- `buildDesktopDemo`
- `playDesktopDemo`
- `.desktop-demo`

用途：

- 模拟 AI 跨软件操作
- 鼠标移动
- 操作链点亮

### 搜索类

检索：

- `buildSearchDemo`
- `playSearchDemo`
- `.search-demo`

用途：

- 联网搜索
- 搜索源显示
- 结果逐条出现

### 任务看板类

检索：

- `buildKanban`
- `playKanban`

用途：

- Agent 拆任务
- 任务推进

### 知识库问答类

检索：

- `buildLibrary`
- `playLibrary`
- `.library-demo`

用途：

- 知识库检索
- 来源命中
- 回答生成
- trace 追溯

### 风险扫描类

检索：

- `buildRisk`
- `playRisk`
- `.risk-demo`

用途：

- 会前预扫描
- 风险项逐项亮起

### 自媒体运营类

检索：

- `buildSocial`
- `playSocial`
- `.social-demo`

用途：

- 内容运营流程
- 平台切换
- 运营链展示

### 扫描/封面/章节类

检索：

- `playPhotoScan`
- `playCover`
- `playSection`
- `playEnding`

## 7. 当前已验证有效的设计方向

这是后续修改时必须延续的方向。

### 有效方向

- 不要只把卡片拉高，要把卡片内部做出层级
- 大块留白优先换成“有展示意义”的小组件
- 优先做“动作型组件”，而不是继续堆说明文字
- 让页面像“正在发生的演示现场”
- 用 `主舞台 + 辅助说明 + 收束条` 的结构组织页面
- 图示、状态灯、流线、命中、扫描、追溯、步骤激活都优于单纯大段落

### 已被否定的方向

- 只靠全局放大字号
- 只靠增加卡片高度
- 用没有解释意义的长短进度条装饰
- 在留白里继续堆字
- 所有页都套同一个“标题 + 卡片堆叠”模板

## 8. 当前几页的标杆页

这些页可以作为后续重构参考。

### 业务场景标杆

- `s47`

原因：

- 主舞台明确
- 检索动画有意义
- 留白被转成示例性组件
- 信息密度饱满但不乱

### 风险/边界标杆

- `s42`
- `s44`

原因：

- 已从“读卡片”改成“核查动作板 / 可做不可做判断板”

### 路线图标杆

- `s50`

原因：

- 阶段推进已经与月份进度绑定
- 不是纯概念图，而是可讲的实施路径

## 9. 修改时的高频检索词

如果要快速改某类问题，可以直接搜这些关键词。

### 版式与结构

- `statement-shell`
- `scenario-board`
- `governance-board`
- `decision-board`
- `body-wrap`

### 卡片和内部微组件

- `feature-pair`
- `feature-box`
- `token-row`
- `decision-mini-grid`
- `micro-flow`
- `rail-card`
- `proof-card`

### 风险和路线图

- `warning-card`
- `redline`
- `roadmap-card`
- `stage-progress`

### 本地化部署页

- `deployment-stage`
- `deployment-flow`
- `deployment-node`

### AI 动画入口

- `playChatDemo`
- `playDesktopDemo`
- `playSearchDemo`
- `playLibrary`
- `playRisk`
- `playSocial`
- `runAnimations`

## 10. 修改工作流

后续任何 AI 接手，建议严格按这个流程：

1. 先读本 README 和设计要求文档
2. 定位具体 slide 的 `id`
3. 先看该页截图，不要只看代码
4. 明确这页承担的是：
   - 观点
   - 过程
   - 比较
   - 风险
   - 业务场景
   - 路线图
5. 再决定是改：
   - 结构
   - 字号
   - 卡片内部层级
   - 示例组件
   - 动效
6. 改完后必须截图复核

## 11. 截图复核方法

当前一直使用 headless Chrome 本地截图。

常用方式：

```bash
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --headless=new \
  --disable-gpu \
  --hide-scrollbars \
  --disable-background-networking \
  --disable-component-update \
  --no-first-run \
  --window-size=1600,900 \
  --virtual-time-budget=5000 \
  --screenshot='/Users/xpan/output/playwright/review-s39.png' \
  'file:///Users/xpan/Desktop/ai%20%E5%88%86%E4%BA%AB/ai-roadshow.html#39'
```

截图目录：

- `/Users/xpan/output/playwright/`

复核标准：

- 页面是否完整落在一屏内
- 主视觉是否明确
- 是否还有大面积无意义留白
- 是否只是堆字
- 微组件是否有解释意义
- 字和字、卡和卡是否对齐

## 12. 当前维护原则

- 只改 `ai-roadshow.html`
- 不另拆多文件版本
- 不破坏单文件可运行性
- 优先复用已有组件，不轻易再造一套新系统
- 每轮改完至少看截图，不只看 DOM
- 后续优先让页面“更像演示现场”，不是“更像静态海报”

## 13. 给新 AI 的一句话总结

这不是普通网页，也不是普通 PPT。

它是一个单文件 HTML 路演系统，当前最重要的修改原则是：

- 保持 16:9 舞台感
- 不用大段文字填空
- 优先把抽象说明转成可观看、可讲述、可辅助理解的动作型组件
- 每改一页都要截图回看


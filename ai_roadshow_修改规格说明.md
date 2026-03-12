# AI就在身边 · HTML演示文稿修改规格说明

> 基于用户反馈 + 代码审查，形成完整可执行的修改清单。  
> 优先级分为 P0（必须）/ P1（重要）/ P2（提升）/ P3（优化）。

---

## 一、布局与画幅重构（P0）

> 消除"网页感"，实现真正的全屏PPT效果，且不同缩放比例下不出现排版错位。

### 问题根源

当前方案通过动态修改 `#deck-shell` 的 `width/height` CSS 属性适配屏幕，导致：

- 边角保留 `border-radius: 34px`，始终有"卡片悬浮"感，全屏后仍能分辨这是网页
- 外部 `#chrome` 浮动条在 deck 之外，全屏后悬空显示，极为突兀
- 字体和卡片尺寸在不同缩放比例（如浏览器缩放到80%/125%）下出现错位和遮盖
- `min-height: 100%` 的 body 设定在某些分辨率下导致内容溢出可见区域

### 修复方案：固定基准尺寸 + transform scale

**① `#deck-shell` 样式完全重写**

```css
#deck-shell {
  position: fixed;
  width: 1920px;          /* 硬编码，永不改变 */
  height: 1080px;         /* 硬编码，永不改变 */
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(1); /* 由JS动态修改scale值 */
  border-radius: 0;       /* 删除圆角 */
  overflow: hidden;
  background: /* 保留原有背景渐变 */;
  /* 删除 box-shadow 和 border */
}
```

**② `fitDeck()` 函数完全重写**

```javascript
function fitDeck() {
  const shell = document.getElementById("deck-shell");
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  shell.style.transform = `translate(-50%, -50%) scale(${scale})`;
  // 不再修改 shell.style.width / shell.style.height
}
```

**③ body 背景设为纯黑，删除光晕装饰**

```css
html, body {
  background: #000000;    /* 纯黑，全屏后 deck 外侧为黑色 */
  overflow: hidden;
  margin: 0;
}

/* 删除以下两段（全屏后光晕出现在deck外部，暴露"这是网页"）*/
body::before { /* 删除 */ }
body::after  { /* 删除 */ }
```

**④ 彻底删除 `#chrome` 底部悬浮条**

```html
<!-- 删除此元素及其全部CSS -->
<div id="chrome">...</div>
```

页码已在每张幻灯片内部的 `.slide-page` 中显示，无需外部 chrome 条。  
原 chrome 中的"← → / Space 翻页"提示可移至封面幻灯片底部，或完全删除。

---

## 二、内容纯洁性清理（P0）

> 删除所有原本是演讲者笔记、技术实现说明、内部大纲编号的内容，避免在演示屏幕上显示给观众。

### 2.1 `kicker` 字段清理规则

当前 kicker 值如 `"1-B · 故事主角"`、`"1-C · 总览"`、`"2-A · 案例一"` 是内部大纲编号，对观众无意义。

**规则：** kicker 只允许保留对观众有意义的章节标签。凡是左侧含数字字母编号（格式为 `数字-字母 ·`）的 kicker，一律简化或清空。

| 原值 | 修改为 |
|---|---|
| `"1-B · 故事主角"` | `"板块一"` |
| `"1-B · 故事转折"` | `"板块一"` |
| `"1-B · 核心高潮"` | `"板块一"` |
| `"1-B · 情绪定格"` | `"板块一"` |
| `"1-B · 结果"` | `"板块一"` |
| `"1-B · 下一张王牌"` | `"板块一"` |
| `"1-B · 电脑操作能力"` | `"板块一"` |
| `"1-B · 组合效应"` | `"板块一"` |
| `"1-B · 时间窗口"` | `"板块一"` |
| `"1-C · 总览"` | `"板块一"` |
| `"1-C · 第一跳"` | `"板块一 · 第一跳"` |
| `"1-C · 第二跳"` | `"板块一 · 第二跳"` |
| `"1-C · 第三跳"` | `"板块一 · 第三跳"` |
| `"1-D · 两个关键概念"` | `"板块一"` |
| `"2-A · 案例一"` | `"案例一 · 小王"` |
| `"2-B · 案例二"` | `"案例二 · 张姐"` |
| `"2-B · 工作流 1"` | `"案例二 · 张姐"` |
| `"2-B · 工作流 2-3"` | `"案例二 · 张姐"` |
| `"2-B · 工作流 4-5"` | `"案例二 · 张姐"` |
| `"2-B · 总结"` | `"案例二 · 小结"` |
| `"2-C · 案例三"` | `"案例三 · Vibe Coding"` |
| `"2-C · 第一层"` | `"案例三 · Vibe Coding"` |
| `"2-C · 第二层"` | `"案例三 · Vibe Coding"` |
| `"2-C · 立意升华"` | `""` （清空，此页无需kicker） |
| `"3-A · 工具地图"` | `"板块三"` |
| `"3-A · 场景 1-3"` | `"板块三"` |
| `"3-A · 场景 4-6 + 原则"` | `"板块三"` |
| `"3-B · 重点推荐"` | `"板块三"` |
| `"3-B · 产品对比"` | `"板块三"` |
| `"3-C · 本地化部署"` | `"板块三"` |
| `"3-D · 六步法"` | `"板块三"` |

### 2.2 封面幻灯片（s01）删除内容

```html
<!-- 删除：技术实现说明不应对观众显示 -->
<span class="pill"><strong>单文件 HTML</strong> · 16:9 全屏演示</span>
<span class="pill"><strong>类视频交互</strong> · 案例/场景仿真呈现</span>

<!-- 删除：操作说明 -->
<div class="cover-hint">按空格键开始 · 右下角为页码 · 所有内容固定居中展示</div>
```

保留：`cover-mark`、`cover-title`、`cover-subtitle`、`cover-time`。

### 2.3 内容幻灯片中的演讲者笔记删除

以下卡片是演讲备注，不应显示在演示屏幕上，全部删除：

**s04 幻灯片：**
```html
<!-- 删除此整个卡片 -->
<div class="card">
  <h3>这一页的作用</h3>
  <p>先告诉大家：主角不是空想家，而是顶级开发者；接下来发生的事情，因此更值得警惕。</p>
</div>
```

**s08 幻灯片：**
```html
<!-- 删除此整个卡片 -->
<div class="card">
  <h3>这一页的演讲节奏</h3>
  <p>先让听众接受"AI 已经不是实验室玩具"，再自然过渡到下一张...</p>
</div>
```

**s29 幻灯片：**
```html
<!-- 删除此整个卡片 -->
<div class="card">
  <h3>这一页的任务</h3>
  <p>让观众意识到：AI 不只是帮我快一点，而是直接改变了"我用什么形式来表达我的观点"。</p>
</div>
```

### 2.4 `subtitle` 字段清理规则

凡含以下词语的 subtitle 为演讲者笔记，不应渲染到 `.slide-subtitle`：

- "这一页要……"
- "这一页必须……"
- "让听众……"
- "演讲节奏"
- "这一页是……"
- "必须做成……效果"
- "把……演给观众看"

**处理方式：** 有内容价值的改写为客观陈述；无内容价值的直接删除（置为空字符串或删除该属性，渲染函数应判断为空时不渲染该元素）。

**逐条处理：**

| 幻灯片 | 原 subtitle | 处理 |
|---|---|---|
| s04 | "先让听众建立人物可信度，再埋下…伏笔。" | 删除 |
| s05 | "不是输入文字，不是按流程测试，而是一条随手发出的语音消息，直接击中AI自主性的边界。" | 保留（有内容价值） |
| s06 | "这一页必须像'后台监控录像'一样演出来，让听众看到不是按程序执行，而是AI自己拼出了方案。" | 删除 |
| s08 | "用动态数字和全球讨论热度，把'个人实验'抬升成行业事件。" | 删除 |
| s25 | "必须做成'对话框里直接长出表格'的效果，让张姐案例一上来就有实操震撼感。" | 删除 |
| s26 | "这页把'眼睛'真正演给观众看，一边是柱状图，一边是图片核验。" | 删除 |
| s27 | "第二跳的完整闭环：它不止能分析内部文件，还能连接外部世界并直接交付成品。" | 保留（有内容价值） |
| s31 | "这一页必须同时展示对话过程、结果和一个真实可交互的小工具，直接体现Vibe Coding的表达力。" | 删除 |

---

## 三、`slide-header` 区域压缩（P1）

> 消除顶部 kicker 标签占据过多垂直空间的问题，给内容区更多高度。

### 修改方案

```css
/* 原始 */
.slide-header {
  min-height: 92px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(153, 169, 187, 0.12);
}
.slide-title {
  margin: 14px 0 0;  /* kicker下方有14px间距 */
}

/* 修改为 */
.slide-header {
  min-height: auto;               /* 删除固定最小高度 */
  padding: 24px 52px 10px;        /* 压缩上下内边距 */
  border-bottom: none;
  display: flex;
  align-items: center;            /* kicker与title同行对齐 */
  gap: 16px;
  flex-wrap: wrap;
}
.slide-header::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--line-strong), transparent 80%);
  margin-top: 8px;
}
.kicker {
  flex-shrink: 0;
  /* 保持原有样式，作为行内前缀显示 */
}
.slide-title {
  margin: 0;                      /* 删除 margin-top: 14px */
  font-size: 34px;                /* 从38px适当压缩 */
}
.slide-subtitle {
  width: 100%;                    /* 占满一行 */
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.6;
}
```

**效果：** 顶部 header 从约 ~130px 压缩至约 ~72px，内容区净增约 58px 高度。

---

## 四、破损图标修复（P1）

### 问题

```javascript
// 此URL无效，返回404
openclaw: "https://github.com/openclaw.png",
```

所有使用 `brandIcon.openclaw` 的位置（s04、s08、s09、s11、s34、s36 等）均出现破损图片图标。

### 修复方案

将 `brandIcon.openclaw` 替换为内联 SVG data URI：

```javascript
const brandIcon = {
  // 用简洁的螃蟹爪SVG替代
  openclaw: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="%23D0B07F" opacity="0.15"/>
      <text x="12" y="17" text-anchor="middle" font-size="13" fill="%23D0B07F">🦞</text>
    </svg>
  `)}`,
  // 其他图标保持不变...
};
```

或更简单地，在使用 openclaw 的 `.badge-block` 中直接改为文字+emoji，无需 img 标签：

```html
<!-- 原 -->
<div class="badge-block"><img src="${brandIcon.openclaw}" alt=""> OpenClaw</div>

<!-- 改为 -->
<div class="badge-block">🦞 OpenClaw</div>
```

---

## 五、动画 Bug 修复（P0/P1）

### Bug A：步骤链路动画白屏（s06、s17、s37 等）——P0

**根本问题：** `playSteps` 函数期望操作已渲染的 `.step` 子元素，但 `.steps` 容器在 HTML 中只是空 div + `data-steps` JSON 属性，缺少对应的 `buildSteps()` 构建函数，导致动画操作空容器，内容完全不显示。

**修复：新增 `buildSteps()` 函数，并在 `runAnimations()` 中调用**

```javascript
function buildSteps(root) {
  if (root.dataset.rendered) return;
  const items = JSON.parse(root.dataset.steps || "[]");
  root.innerHTML = items.map((item, i) => `
    <div class="step">
      <div class="step-index">${i + 1}</div>
      <div>
        <h4>${item.title}</h4>
        <p>${item.text}</p>
      </div>
    </div>
  `).join("");
  root.dataset.rendered = "1";
}

async function playSteps(root, token) {
  buildSteps(root);
  const steps = root.querySelectorAll(".step");
  for (const step of steps) {
    if (token !== playToken) return;
    step.classList.add("is-live");
    await sleep(500);
  }
}

// runAnimations() 中修改调用方式：
function runAnimations(slide, token) {
  // 原有调用...
  slide.querySelectorAll(".steps[data-steps]").forEach(el => playSteps(el, token));
  // 原有其他调用...
}
```

### Bug B：s09 compare-card 无动画（P1）

`runAnimations` 未对 `.compare-card` 触发任何动画，两张卡片静态出现，无入场效果。

**修复：在 `runAnimations()` 中添加 compare-card stagger 动画**

```javascript
// 在 runAnimations() 中添加：
slide.querySelectorAll(".compare-card").forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(24px)";
  card.style.transition = "none";
  setTimeout(() => {
    card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 150 + i * 200);
});
```

同理，`.warning-card`、`.compare-grid` 内元素均添加相同的 stagger 入场处理。

### Bug C：s26 照片扫描线不可见（P1）

**问题一：** 扫描线渐变透明度过低（`rgba(131,213,248,0.18)`），在深色背景上接近不可见。

**问题二：** `classList.remove("play")` 和 `requestAnimationFrame` 之间时序在部分浏览器中不可靠，导致动画不触发。

**修复：**

```css
.photo-scan {
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(131, 213, 248, 0.04) 25%,
    rgba(131, 213, 248, 0.60) 50%,   /* 大幅提升中心亮度 */
    rgba(131, 213, 248, 0.04) 75%,
    transparent 100%
  );
  height: 40%;                        /* 从铺满全图改为扫描带 */
}
```

```javascript
function playPhotoScan(slide) {
  slide.querySelectorAll(".photo-scan").forEach(scan => {
    scan.classList.remove("play");
    void scan.offsetHeight;           /* 强制重排，确保动画重置 */
    scan.classList.add("play");
  });
}
```

### Bug D：demo 重复进入不重置问题（P1）

**问题：** `buildXxxDemo()` 系列函数通过 `dataset.rendered = "1"` 标记"已构建"，第二次进入同一幻灯片时不重建 DOM，但 `playToken` 已更新，原有元素的 `is-live` / `done` 状态停留在动画末态，无法复位。

**修复：在 `showSlide()` 中，离开幻灯片时重置所有 demo 容器**

```javascript
function showSlide(index) {
  // 离开当前幻灯片时，清空所有 demo 的渲染缓存和内容
  const leavingSlide = slideEls[current];
  leavingSlide.querySelectorAll("[data-rendered]").forEach(el => {
    delete el.dataset.rendered;
    el.innerHTML = "";
  });
  
  // 原有逻辑继续...
  current = Math.max(0, Math.min(totalSlides - 1, index));
  playToken += 1;
  slideEls.forEach((el, i) => el.classList.toggle("is-active", i === current));
  window.history.replaceState(null, "", `#${current + 1}`);
  updateChrome();
  runAnimations(slideEls[current], playToken);
}
```

**受影响的 demo 类型：** `.desktop-demo`、`.search-demo`、`.kanban-demo`、`.library-demo`、`.risk-demo`、`.social-demo`，以及新增的 `.steps[data-steps]`。

---

## 六、后半段幻灯片视觉重设计（P2）

> 针对 s39 页（本地化部署）往后"全是文字表格、视觉单调"的问题，逐页提出具体替代方案。

### 6.1 三种偏差警告（对应当前 warning-grid）

**当前：** 三张等高等宽文字卡片，无动画，无色彩区分。

**重设计：**
- 三张卡从左向右依次滑入（间隔 250ms，`translateX(-40px) → 0`）
- 每张卡顶部添加红色警告图标区（红色横条 + ⚠️ emoji）
- 三张卡背景从左到右渐深：`rgba(255,139,139,0.06)` / `0.10` / `0.14`
- 每张卡左侧加 4px 红色竖线（`border-left: 4px solid var(--red)`）

```css
.warning-card {
  border-left: 4px solid var(--red);
  border-radius: 4px 22px 22px 4px;
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.warning-card.is-live {
  opacity: 1;
  transform: translateX(0);
}
.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,139,139,0.15);
  color: var(--red);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

### 6.2 四条红线（对应当前 redline-grid）

**当前：** 四条纯文字横向列表，序号在左侧小方块中。

**重设计：**
- 四条从左侧 `translateX(-30px)` 依次滑入（间隔 200ms）
- 每条左侧有渐变红色竖线（宽 4px，颜色从 `#ff8b8b` 到 `rgba(255,139,139,0.3)`）
- 右侧添加简洁判断标准徽章（如"✗ 禁止"）
- 整体布局改为：`[序号] [红线内容] [判断标准]` 三栏

```css
.redline {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.redline.is-live {
  opacity: 1;
  transform: translateX(0);
}
```

### 6.3 知识库问答演示（library-demo）

**当前：** 左列文件列表依次亮起，右列文字答案依次出现，无对话感。

**重设计：**
- 右侧改用真正的对话气泡（复用 `.chat-demo` 样式）
- AI 回答中，文件来源名称用 `<span class="accent">【文件名】</span>` 高亮标注
- 左侧文件亮起时，右侧对应的引用内容同步高亮（`border-color` 变化过渡）

```javascript
// playLibrary 中修改右侧渲染方式：
const rightPanel = root.querySelector(".library-right");
rightPanel.innerHTML = `
  <div class="bubble ai" style="opacity:0;">
    ${data.answer.map(line => `<div class="answer-line">${line}</div>`).join("")}
  </div>
`;
// 文件列表亮完后，整体淡入气泡，再逐行 is-live
```

### 6.4 自媒体运营六环节（social-demo）

**当前：** 左列六条文字依次亮起，右列三条"为什么适合"文字依次出现，无视觉冲击力。

**重设计：改为横向节点流程图，节点依次点亮 + 连线生长**

```html
<!-- 新增 .flow-chain 布局替代 .social-demo 内部结构 -->
<div class="flow-chain">
  <div class="flow-node" id="fn-1">
    <div class="flow-icon">🔍</div>
    <div class="flow-label">选题研究</div>
  </div>
  <div class="flow-arrow">→</div>
  <div class="flow-node" id="fn-2">...</div>
  <!-- 共6个节点，5个箭头 -->
</div>
```

```css
.flow-node {
  opacity: 0.2;
  transition: opacity 0.4s, transform 0.4s, box-shadow 0.4s;
}
.flow-node.is-live {
  opacity: 1;
  box-shadow: 0 0 20px rgba(131, 213, 248, 0.3);
  border-color: rgba(131, 213, 248, 0.4);
}
.flow-arrow {
  color: rgba(153, 169, 187, 0.3);
  font-size: 22px;
  transition: color 0.4s;
}
.flow-arrow.is-live {
  color: var(--cyan);
}
```

```javascript
// playSocial 重写：节点和箭头交替点亮
const nodes = root.querySelectorAll(".flow-node");
const arrows = root.querySelectorAll(".flow-arrow");
for (let i = 0; i < nodes.length; i++) {
  if (token !== playToken) return;
  nodes[i].classList.add("is-live");
  if (arrows[i]) arrows[i].classList.add("is-live");
  await sleep(400);
}
```

### 6.5 三阶段路线图（roadmap）

**当前：** 三张等高文字卡片，无时间感，无视觉节奏。

**重设计：添加贯穿时间轴线 + 节点从轴线生长**

```html
<!-- roadmap 新增时间轴结构 -->
<div class="roadmap-timeline">
  <div class="roadmap-axis"></div>  <!-- 横向轴线，由JS控制宽度从0生长 -->
  <div class="roadmap-nodes">
    <div class="roadmap-node" data-phase="1">
      <div class="node-dot"></div>
      <div class="roadmap-card">...</div>
    </div>
    <!-- 共3个节点 -->
  </div>
</div>
```

```css
.roadmap-axis {
  height: 2px;
  background: linear-gradient(90deg, var(--cyan), var(--gold));
  width: 0;                         /* JS动画控制 */
  transition: width 1.2s ease;
}
.roadmap-node {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.roadmap-node.is-live {
  opacity: 1;
  transform: translateY(0);
}
.node-dot {
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 12px rgba(131, 213, 248, 0.5);
  margin: 0 auto 12px;
}
```

### 6.6 结束页（s51）

**当前：** 大引言文字整体淡入，三个行动建议卡静态出现。

**重设计：**
- 中央大引言改为逐行淡入（三行，每行延迟 200ms）
- 三个行动建议卡改为从下方弹入，带弹性缓动（`cubic-bezier(0.34, 1.56, 0.64, 1)`）
- 结束页背景添加极细粒子场（约30个点，颜色 gold，缓慢漂浮）

```css
.ending-action {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ending-action.is-live {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 七、动画创意与视觉效果升级（P2）

### 7.1 封面幻灯片：主标题打字机 + 粒子背景

**当前：** 整体淡入，静态。

**升级：**
- 主标题"AI就在身边"逐字打字机出现（约55ms/字），出现前有光标闪烁
- 副标题在主标题完成后 0.3s 延迟整体淡入
- 背景用 Canvas 实现约 50 个缓慢漂浮粒子（颜色随机在 `var(--cyan)` 和 `var(--gold)` 之间）

```javascript
// 封面进入时的打字机动画
async function playCover(token) {
  const title = document.querySelector(".cover-title");
  const text = title.textContent;
  title.textContent = "";
  title.style.borderRight = "2px solid var(--gold)";  // 光标
  for (const char of text) {
    if (token !== playToken) return;
    title.textContent += char;
    await sleep(55);
  }
  title.style.borderRight = "none";
}
```

### 7.2 章节页（section-slide）：背景粒子场

**当前：** 整体淡入，`::before` 静态光晕。

**升级：**
- 章节标题用 stagger 逐词淡入（将标题按词拆分为 span，依次 fadeUp）
- 背景添加轻量 Canvas 粒子场（约40个点）
- 大序号背景文字（Chapter 01）从底部缓慢上移（`translateY(20px) → 0`，持续3s循环）

### 7.3 步骤链路：序号圆圈填充 + 竖线生长

在现有 `step.is-live` 动画基础上，增加：
- 步骤序号圆圈出现时，从 `background: transparent; border: 2px solid` 过渡到 `background: rgba(208,176,127,0.2)`
- 相邻步骤之间的竖线（用 `::after` 伪元素实现）从 `height: 0` 生长到 `height: 24px`

```css
.step + .step::before {
  content: "";
  display: block;
  width: 2px;
  background: linear-gradient(180deg, var(--gold), transparent);
  margin: 0 auto -12px;
  height: 0;
  transition: height 0.3s ease;
}
.step.is-live + .step::before {
  height: 24px;
}
```

### 7.4 数字滚动动画：修复 `data-format="short"` 换算

**问题：** 当前 `animateCounters()` 的 `data-format="short"` 分支，对 247000 的换算结果应为 `"24.7万+"` 但可能出现 `"247K+"` 或直接显示原始数字的情况。

**修复：**

```javascript
function formatValue(val, format, suffix) {
  if (format === "short") {
    if (val >= 10000) {
      return (val / 10000).toFixed(1) + "万" + (suffix || "");
    }
  }
  return Math.round(val).toLocaleString("zh-CN") + (suffix || "");
}
```

### 7.5 聊天对话框：添加 AI 思考气泡

在每条 AI 气泡出现前，先展示带三点跳动的思考状态（停留约 1000-1500ms），再替换为打字输出。

```javascript
// 修改 playChatDemo 中 AI 消息的处理：
if (msg.role === "ai") {
  // 先显示思考气泡
  const thinkBubble = createBubble("ai", "typing");
  thinkBubble.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  stream.appendChild(thinkBubble);
  await sleep(1200);
  
  // 替换为实际内容
  thinkBubble.innerHTML = "";
  await typeText(thinkBubble, msg.text, speed, token);
}
```

---

## 八、执行优先级汇总

| 优先级 | 修改项 | 涉及位置 | 预估工作量 |
|---|---|---|---|
| **P0** | 布局重构（transform scale + 删除圆角 + 删除chrome） | CSS + fitDeck() | 中 |
| **P0** | 删除内部演讲者笔记（kicker/subtitle/卡片内容） | 约20张幻灯片 | 小 |
| **P0** | 修复 `buildSteps` 缺失 → 步骤动画白屏 | s06、s17、s37 | 中 |
| **P1** | 修复 openclaw 图标404 | s04、s08、s09等 | 小 |
| **P1** | 修复 demo 重复进入不重置（showSlide清空rendered） | s10、s25、s27、s37、s47 | 小 |
| **P1** | 增强照片扫描线可见度 + 重排触发修复 | s26 | 小 |
| **P1** | compare-card / warning-card 添加 stagger 入场 | s09、s41 | 小 |
| **P1** | header 区域压缩（min-height + kicker同行） | 全部内容页CSS | 小 |
| **P2** | s39后各页视觉重设计（警告/红线/流程图/时间轴/结束页） | s41-s51 | 大 |
| **P2** | 封面打字机动画 + 粒子背景 | s01 | 中 |
| **P2** | 章节页粒子场 + 文字 stagger | s03、s18、s33、s41 | 中 |
| **P2** | 步骤序号圆圈填充 + 竖线生长动画 | s06、s17、s37 | 小 |
| **P2** | 聊天对话框添加 AI 思考气泡 | s05、s25、s27、s31 | 中 |
| **P2** | 数字滚动换算修复（万单位） | s08 | 小 |
| **P3** | bar-chart 柱子每次进入重置高度为0再触发 | s23、s28 | 小 |
| **P3** | 翻页过渡动画增强（当前 translateY+scale，可改为方向感更强的横向） | 全局JS | 小 |

---

*文档版本：2026年3月 · 基于 `1773213440526_ai-roadshow.html` 代码审查生成*

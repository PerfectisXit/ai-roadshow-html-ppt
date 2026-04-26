#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const vm = require("vm");
const { spawnSync } = require("child_process");
const { pathToFileURL } = require("url");

const PROJECT_ROOT = __dirname;
const SCREENSHOT_ROOT = path.join(PROJECT_ROOT, "slide-screenshots");
const CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function usage() {
  console.log(`
用法：
  node capture-slide.js --list
  node capture-slide.js --page 21
  node capture-slide.js --slide p21
  node capture-slide.js --slide c01
  node capture-slide.js --all

可选参数：
  --file ai-roadshow-2.0.html   指定要截图的 HTML 文件，默认优先 ai-roadshow-2.0.html
  --budget 6000                 Chrome 虚拟时间预算，默认 5000ms
  --timeout 20000               单页截图超时，默认 20000ms
  --width 1600                  截图宽度，默认 1600
  --height 900                  截图高度，默认 900
  --continue-on-error           批量截图时遇错继续，并在最后汇总失败页
`);
}

function parseArgs(argv) {
  const args = {
    file: null,
    page: null,
    slide: null,
    all: false,
    list: false,
    budget: 5000,
    timeout: 20000,
    width: 1600,
    height: 900,
    continueOnError: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--file") args.file = argv[++i];
    else if (token === "--page") args.page = Number(argv[++i]);
    else if (token === "--slide") args.slide = argv[++i];
    else if (token === "--all") args.all = true;
    else if (token === "--list") args.list = true;
    else if (token === "--budget") args.budget = Number(argv[++i]);
    else if (token === "--timeout") args.timeout = Number(argv[++i]);
    else if (token === "--width") args.width = Number(argv[++i]);
    else if (token === "--height") args.height = Number(argv[++i]);
    else if (token === "--continue-on-error") args.continueOnError = true;
    else if (token === "--help" || token === "-h") {
      usage();
      process.exit(0);
    } else {
      console.error(`未知参数: ${token}`);
      usage();
      process.exit(1);
    }
  }

  return args;
}

function resolveHtmlFile(input) {
  if (input) {
    return path.isAbsolute(input) ? input : path.join(PROJECT_ROOT, input);
  }
  const preferred = path.join(PROJECT_ROOT, "ai-roadshow-2.0.html");
  if (fs.existsSync(preferred)) return preferred;
  return path.join(PROJECT_ROOT, "ai-roadshow.html");
}

function loadSlidesMeta(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!scripts.length) {
    throw new Error("HTML 中未找到可执行脚本，无法提取 slides 元数据。");
  }

  let code = scripts.join("\n\n");
  code = code.replace("showSlide(current);", "/* showSlide bootstrap removed for metadata extraction */");
  code += `
    ;globalThis.__slideMeta = slides.map((slide, index) => ({
      id: slide.id,
      title: slide.title || "",
      titleText: slide.titleText || "",
      noPage: !!slide.noPage,
      deckRef: slide.deckRef || null,
      pageRef: slide.pageRef || null,
      pageLabel: slide.pageLabel || "",
      visiblePageNumber: slide.visiblePageNumber || null,
      absolutePageNumber: slide.absolutePage || index + 1
    }));
  `;

  const noop = () => {};
  const stubEl = () => ({
    querySelector: () => null,
    querySelectorAll: () => [],
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    style: { setProperty: noop },
    dataset: {},
    innerHTML: "",
    textContent: "",
    appendChild: noop,
    remove: noop,
    setAttribute: noop,
    getAttribute: () => null,
    addEventListener: noop,
    removeEventListener: noop,
    getBoundingClientRect: () => ({ width: 1600, height: 900, top: 0, left: 0 }),
    closest: () => null,
    scrollTo: noop,
  });

  const document = {
    body: stubEl(),
    documentElement: { style: { setProperty: noop } },
    querySelector: () => stubEl(),
    querySelectorAll: () => [],
    getElementById: () => stubEl(),
    addEventListener: noop,
    removeEventListener: noop,
    title: "",
    location: { hash: "" },
  };

  const context = {
    console,
    document,
    location: document.location,
    history: { replaceState: noop },
    navigator: { userAgent: "node" },
    performance: { now: () => 0 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame: noop,
    setTimeout: () => 1,
    clearTimeout: noop,
    setInterval: () => 1,
    clearInterval: noop,
    IntersectionObserver: function IntersectionObserver() {
      return { observe: noop, disconnect: noop, unobserve: noop };
    },
    MutationObserver: function MutationObserver() {
      return { observe: noop, disconnect: noop, takeRecords: () => [] };
    },
    ResizeObserver: function ResizeObserver() {
      return { observe: noop, disconnect: noop, unobserve: noop };
    },
    Image: function Image() {},
    URL,
    URLSearchParams,
    Math,
    Date,
    JSON,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Map,
    Set,
    WeakMap,
    WeakSet,
    Promise,
    parseInt,
    parseFloat,
    isNaN,
    addEventListener: noop,
    removeEventListener: noop,
    matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop }),
  };

  context.window = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(code, context, { timeout: 8000 });

  return context.__slideMeta;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function getFolderRef(slide) {
  return slide.pageRef || slide.deckRef || slide.id;
}

function pruneStaleSlideFolders(slides) {
  if (!fs.existsSync(SCREENSHOT_ROOT)) return;
  const valid = new Set(slides.map((slide) => getFolderRef(slide)));
  for (const entry of fs.readdirSync(SCREENSHOT_ROOT, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!valid.has(entry.name)) {
      fs.rmSync(path.join(SCREENSHOT_ROOT, entry.name), { recursive: true, force: true });
    }
  }
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function writeMeta(folder, meta, htmlPath) {
  const payload = {
    deckRef: meta.deckRef,
    pageRef: meta.pageRef,
    folderRef: getFolderRef(meta),
    pageLabel: meta.pageLabel,
    slideId: meta.id,
    visiblePageNumber: meta.visiblePageNumber,
    absolutePageNumber: meta.absolutePageNumber,
    titleText: meta.titleText,
    htmlFile: path.basename(htmlPath),
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(folder, "meta.json"), `${JSON.stringify(payload, null, 2)}\n`);
}

function captureOne(meta, htmlPath, options) {
  if (!fs.existsSync(CHROME_BIN)) {
    throw new Error(`未找到 Chrome: ${CHROME_BIN}`);
  }

  const pageFolder = path.join(SCREENSHOT_ROOT, getFolderRef(meta));
  ensureDir(pageFolder);
  writeMeta(pageFolder, meta, htmlPath);

  const stamp = timestamp();
  const screenshotPath = path.join(pageFolder, `${stamp}.png`);
  const latestPath = path.join(pageFolder, "latest.png");
  const url = pathToFileURL(htmlPath);
  url.hash = meta.deckRef || meta.id;
  const profileDir = path.join(os.tmpdir(), `roadshow-capture-${getFolderRef(meta)}`);
  fs.rmSync(profileDir, { recursive: true, force: true });
  ensureDir(profileDir);

  const chromeArgs = [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--disable-background-networking",
    "--disable-component-update",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${profileDir}`,
    `--window-size=${options.width},${options.height}`,
    `--virtual-time-budget=${options.budget}`,
    `--screenshot=${screenshotPath}`,
    url.href,
  ];

  const result = spawnSync(CHROME_BIN, chromeArgs, {
    encoding: "utf8",
    timeout: options.timeout,
  });
  fs.rmSync(profileDir, { recursive: true, force: true });
  if (result.error && result.error.code === "ETIMEDOUT") {
    throw new Error(`Chrome 截图超时：${meta.deckRef || meta.id} (${options.timeout}ms)`);
  }
  if (result.status !== 0) {
    throw new Error(`Chrome 截图失败：${result.stderr || result.stdout || "unknown error"}`);
  }

  fs.copyFileSync(screenshotPath, latestPath);
  return screenshotPath;
}

function printList(slides) {
  slides.forEach((slide) => {
    console.log(`${(slide.pageLabel || "--").padEnd(9)}  ${(slide.deckRef || "--").padEnd(3)}  ${slide.id}  ${slide.titleText}`);
  });
}

function resolveSlideTarget(slides, raw) {
  const token = String(raw || "").trim();
  if (!token) return null;
  const normalized = token.toLowerCase();
  return (
    slides.find((slide) => slide.deckRef === normalized) ||
    slides.find((slide) => slide.pageRef === normalized) ||
    slides.find((slide) => slide.id.toLowerCase() === normalized) ||
    null
  );
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const htmlPath = resolveHtmlFile(args.file);
  const slides = loadSlidesMeta(htmlPath).map((slide) => ({
    ...slide,
    folderRef: getFolderRef(slide),
  }));

  ensureDir(SCREENSHOT_ROOT);
  pruneStaleSlideFolders(slides);
  fs.writeFileSync(
    path.join(SCREENSHOT_ROOT, "slide-index.json"),
    `${JSON.stringify(
      {
        htmlFile: path.basename(htmlPath),
        generatedAt: new Date().toISOString(),
        slides,
      },
      null,
      2
    )}\n`
  );
  fs.writeFileSync(
    path.join(SCREENSHOT_ROOT, "visible-page-map.json"),
    `${JSON.stringify(
      slides
        .filter((slide) => slide.visiblePageNumber)
        .map((slide) => ({
          pageRef: slide.pageRef,
          deckRef: slide.deckRef,
          visiblePageNumber: slide.visiblePageNumber,
          pageLabel: slide.pageLabel,
          slideId: slide.id,
          titleText: slide.titleText,
        })),
      null,
      2
    )}\n`
  );

  if (args.list) {
    printList(slides);
    return;
  }

  let targets = [];
  if (args.all) {
    targets = slides;
  } else if (args.slide) {
    const target = resolveSlideTarget(slides, args.slide);
    if (!target) throw new Error(`未找到页面引用：${args.slide}`);
    targets = [target];
  } else if (args.page) {
    const target = slides.find((slide) => slide.visiblePageNumber === args.page);
    if (!target) throw new Error(`未找到可见页码：${args.page}`);
    targets = [target];
  } else {
    usage();
    process.exit(1);
  }

  const failures = [];
  targets.forEach((target) => {
    const refLabel = target.pageRef || target.deckRef || target.id;
    try {
      const screenshotPath = captureOne(target, htmlPath, args);
      console.log(`[ok] ${target.pageLabel || refLabel} ${target.id} -> ${screenshotPath}`);
    } catch (error) {
      if (!args.all && !args.continueOnError) throw error;
      failures.push(`${refLabel}:${target.id}`);
      console.error(`[fail] ${refLabel} ${target.id} -> ${error.message}`);
    }
  });

  if (failures.length) {
    throw new Error(`以下页面截图失败：${failures.join(", ")}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`[capture-slide] ${error.message}`);
  process.exit(1);
}

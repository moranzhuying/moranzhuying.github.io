/**
 * MathJax 配置与按需装载
 *
 * 为什么要单独成文件：本站开着 NexT 的 PJAX，站内跳转只替换 DOM、不重新执行 <script>。
 * 原来把配置和 <script defer> 直接写在 body-end.njk 里，只有整页加载才会跑一次：
 *   - 从首页点进文章 → 公式没排，页面上留着 $...$
 *   - 从没有公式的页面（如 /about/）进文章 → MathJax 压根没载入
 *   - 刷新一次（整页加载）就正常，于是表现为「第一次必坏、刷新就好」
 * 现在把装载逻辑放在这个文件里，由 pjax:success 触发重新排版，
 * 入口页没载过 MathJax 时也能现载，两种情况都不再需要刷新。
 *
 * 约定：
 *   - 配置必须在注入 tex-mml-chtml.js 之前赋给 window.MathJax，故合并在本文件内。
 *   - 只在页面里确实出现 $ 时才下载 1 MB 的组件；排版由本文件分片驱动（startup.typeset 已关）。
 *   - 站内跳转后只对新的 .post-body 排版，避免整页重排。
 */

(function () {
  'use strict';

  // ---------------- 配置（原文照搬自 body-end.njk） ----------------
window.MathJax = {
  loader: {
    paths: {
      mathjax: '/js/mathjax',
      // 字体本地托管（source/js/mathjax/fonts/mathjax-newcm-font/chtml/）。
      // 走 CDN 时 calligraphic / double-struck / math 三个动态分块是串行跨域请求，
      // 每个约 400 ms，合计 0.8 s，是冷启动里最大的一块。
      fonts: '/js/mathjax/fonts'
    }
  },
  tex: {
    inlineMath: [['$', '$']],
    tags: 'none',
    // 从 LaTeX 模板 structure.sty 移植的符号宏（125 个）
    macros: {
      AHerm: "\\operatorname{AHerm}",
      Ad: "\\operatorname{Ad}",
      Aff: "\\operatorname{Aff}",
      Alt: "\\operatorname{Alt}",
      Ann: "\\operatorname{Ann}",
      AntiBil: "\\operatorname{AntiBil}",
      Aut: "\\operatorname{Aut}",
      Bil: "\\operatorname{Bil}",
      C: "\\mathbb{C}",
      Char: "\\operatorname{Char}",
      Cl: "\\operatorname{Cl}",
      Coll: "\\operatorname{Coll}",
      Com: "\\operatorname{Com}",
      Core: "\\operatorname{Core}",
      Der: "\\operatorname{Der}",
      Dir: "\\operatorname{Dir}",
      Disp: "\\operatorname{Disp}",
      Eig: "\\operatorname{Eig}",
      End: "\\operatorname{End}",
      Eq: "\\operatorname{Eq}",
      Equ: "\\operatorname{Equ}",
      F: "\\mathbb{F}",
      Fix: "\\operatorname{Fix}",
      Frac: "\\operatorname{Frac}",
      FuncRel: "\\operatorname{FuncRel}",
      GEig: "\\operatorname{GEig}",
      GL: "\\operatorname{GL}",
      GSU: "\\operatorname{GSU}",
      GU: "\\operatorname{GU}",
      Gr: "\\operatorname{Gr}",
      Gram: "\\operatorname{Gram}",
      Grp: "\\operatorname{Grp}",
      Herm: "\\operatorname{Herm}",
      Hom: "\\operatorname{Hom}",
      Ind: "\\operatorname{Ind}",
      Inn: "\\operatorname{Inn}",
      Int: "\\operatorname{Int}",
      Isom: "\\operatorname{Isom}",
      K: "\\mathbb{K}",
      Lib: "\\operatorname{Lib}",
      Libas: "\\operatorname{Libas}",
      Libasc: "\\operatorname{Libasc}",
      Mag: "\\operatorname{Mag}",
      Mat: "\\operatorname{Mat}",
      Min: "\\operatorname{Min}",
      Mo: "\\operatorname{Mo}",
      Mult: "\\operatorname{Mult}",
      N: "\\mathbb{N}",
      Norm: "\\operatorname{N}",
      Nul: "\\operatorname{Nul}",
      OrdB: "\\operatorname{OrdB}",
      PFunc: "\\operatorname{PFunc}",
      PGL: "\\operatorname{PGL}",
      Pc: "\\operatorname{Pc}",
      Pf: "\\operatorname{Pf}",
      Pol: "\\operatorname{Pol}",
      Q: "\\mathbb{Q}",
      Quad: "\\operatorname{Quad}",
      R: "\\mathbb{R}",
      Rat: "\\operatorname{Rat}",
      Ratio: "\\operatorname{Ratio}",
      Res: "\\operatorname{Res}",
      SHerm: "\\operatorname{SHerm}",
      SL: "\\operatorname{SL}",
      SO: "\\operatorname{SO}",
      SU: "\\operatorname{SU}",
      Sesq: "\\operatorname{Sesq}",
      Shuffle: "\\operatorname{Sf}",
      Sim: "\\operatorname{Sim}",
      Sp: "\\operatorname{Sp}",
      Spin: "\\operatorname{Spin}",
      Stab: "\\operatorname{Stab}",
      Sym: "\\operatorname{Sym}",
      SymBil: "\\operatorname{SymBil}",
      Tens: "\\operatorname{Tens}",
      Tr: "\\operatorname{Tr}",
      Tran: "\\operatorname{Tran}",
      Vol: "\\operatorname{Vol}",
      Z: "\\mathbb{Z}",
      ad: "\\operatorname{ad}",
      adj: "\\operatorname{adj}",
      am: "\\operatorname{AM}",
      boundary: "\\operatorname{bd}",
      cf: "\\operatorname{cf}",
      closure: "\\operatorname{cl}",
      codim: "\\operatorname{codim}",
      coim: "\\operatorname{coim}",
      coker: "\\operatorname{coker}",
      col: "\\operatorname{col}",
      cont: "\\operatorname{cont}",
      ctg: "\\operatorname{ctg}",
      diag: "\\operatorname{diag}",
      disc: "\\operatorname{disc}",
      dom: "\\operatorname{dom}",
      dr: "\\operatorname{dr}",
      ev: "\\operatorname{ev}",
      exterior: "\\operatorname{ext}",
      fin: "\\operatorname{Fin}",
      gm: "\\operatorname{GM}",
      id: "\\operatorname{id}",
      im: "\\operatorname{im}",
      ind: "\\operatorname{ind}",
      interior: "\\operatorname{int}",
      inv: "\\operatorname{inv}",
      lcm: "\\operatorname{lcm}",
      limit: "\\displaystyle\\lim",
      mult: "\\operatorname{mult}",
      nul: "\\operatorname{nul}",
      op: "\\operatorname{op}",
      orbit: "\\operatorname{orbit}",
      ord: "\\operatorname{ord}",
      piv: "\\operatorname{piv}",
      pr: "\\operatorname{pr}",
      rad: "\\operatorname{rad}",
      rank: "\\operatorname{rank}",
      res: "\\operatorname{res}",
      row: "\\operatorname{row}",
      sgn: "\\operatorname{sgn}",
      sign: "\\operatorname{sign}",
      str: "\\operatorname{str}",
      supp: "\\operatorname{supp}",
      tg: "\\operatorname{tg}",
      tor: "\\operatorname{tor}",
      tr: "\\operatorname{tr}",
      tw: "\\operatorname{tw}",
      // 大算子（原生大算子符号，与 \sum 同尺寸；\ast/\top/\bot 无大号字形故弃用）
      bigast: "\\bigstar",
      bigboxplus: "\\bigoplus"
    }
  },
  options: {
    // 禁用探索/语音辅助（sre 组件未本地化，避免 speech-worker 加载报错）
    // 关键：speech 探索器由 a11y.speech/braille 控制（enableExplorer/sre.disabled 不生效）
    enableExplorer: false,
    sre: { disabled: true },
    a11y: { speech: false, braille: false, keyMagnifier: false },
    renderActions: {
      insertedScript: [200, () => {
        document.querySelectorAll('mjx-container:not([display])').forEach(node => {
          const target = node.parentNode;
          if (target.nodeName.toLowerCase() === 'li') {
            target.parentNode.classList.add('has-jax');
          }
        });
      }, '', false]
    }
  },
  output: { displayOverflow: 'scroll' },

  // 关掉 MathJax 的自动排版，改由 mathjax-boot.js 显式调用一次。
  // 否则组件就绪后会自己排一遍，我们再排一遍，公式就重了。
  startup: { typeset: false }
};

  // ---------------- 装载与重排 ----------------
  var BUNDLE = '/js/mathjax/tex-mml-chtml.js';
  var state = 'idle'; // idle | loading | ready

  // 页面里有没有待排版的公式：只看正文，避免把 <script> 里的字符串算进来
  function hasMath() {
    var bodies = document.querySelectorAll('.post-body');
    for (var i = 0; i < bodies.length; i++) {
      if (bodies[i].textContent.indexOf('$') !== -1) return true;
    }
    return false;
  }

  // ---------------- 排版调度 ----------------
  // startup.typeset 关掉，由这里调一次 typesetPromise 全量排版。
  //
  // 为什么不按首屏分片 —— MathJax 4.1.3 这份单包有三个实测硬限制：
  //   1. typesetPromise() 只能有效调用一次。第二次传入新元素，排版不再发生
  //      （首屏 16 个容器之后，再传 208 个块，容器数一动不动）；
  //      它返回的 promise 也永远 pending，没法用来判断做完没有。
  //   2. 同步的 typeset() 在需要异步加载字体时抛 "MathJax retry" 并中断，
  //      格论篇排到第 16 个就停。早先的版本在 catch 里补一次 typesetPromise，
  //      结果两个容器并排出现，页面上能看到 ≤≤、(P,≤)(P,≤)。
  //   3. 把首屏块排到数组最前面也没用 —— MathJax 先把传入元素整体扫一遍
  //      收集公式，再统一渲染，数组顺序不改变出结果的先后。
  // 所以就是一次全量，把力气花在别处：组件 preload、字体本地托管。

  var lastBody = null;     // 上一次处理的 .post-body 节点，用于同页去重

  function typeset() {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;

    // 同页去重：一次加载里 boot() 会被触发两次（DOMContentLoaded 之后，
    // NexT 的 pjax 还会补一次 pjax:success）。不去重就会把每个公式排两遍。
    // 认节点身份：同一篇跳过；PJAX 换页后 .post-body 是新节点，照常重排。
    var body = document.querySelector('.post-body');
    if (!body || body === lastBody) return;
    lastBody = body;

    try {
      window.MathJax.typesetPromise([body]);
    } catch (err) {
      console.warn('[mathjax] 排版失败', err);
    }
  }

  // 首页自己不排版，但预取组件：访客点开的第一篇多半是公式文章，
  // 提前下载能把「点进去先看到一片 $」的窗口压到一次排版的时间。
  function prefetch() {
    if (location.pathname !== '/') return;
    if (document.querySelector('link[data-mjx-prefetch]')) return;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.as = 'script';
    l.href = BUNDLE;
    l.setAttribute('data-mjx-prefetch', '');
    document.head.appendChild(l);
  }

  // 等 startup 就绪再排，避免和组件的初始化抢时序
  function run() {
    var sp = window.MathJax && window.MathJax.startup && window.MathJax.startup.promise;
    if (sp) {
      sp.then(typeset).catch(function (err) {
        console.warn('[mathjax] startup 异常，仍尝试排版', err);
        typeset();
      });
    } else {
      typeset();
    }
  }

  function boot() {
    if (state === 'loading') return;        // 组件的 onload 里会接管排版
    if (state === 'ready') { run(); return; }
    if (!hasMath()) { prefetch(); return; }

    state = 'loading';
    var s = document.createElement('script');
    s.src = BUNDLE;
    s.async = true;
    s.onload = function () {
      state = 'ready';
      run();                                // startup.typeset 已关，排版由这里接管
    };
    s.onerror = function () {
      state = 'idle';
      console.error('[mathjax] 组件载入失败：' + BUNDLE);
    };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // PJAX 站内跳转：内容换了，公式要重排
  document.addEventListener('pjax:success', boot);
})();

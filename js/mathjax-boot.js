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
 *   - 只在页面里确实出现 $ 时才下载 1 MB 的组件；下载完成后由 MathJax startup 自行排版。
 *   - 站内跳转后只对新的 .post-body 排版，避免整页重排。
 */

(function () {
  'use strict';

  // ---------------- 配置（原文照搬自 body-end.njk） ----------------
window.MathJax = {
  loader: {
    paths: {
      mathjax: '/js/mathjax',
      fonts: 'https://fastly.jsdelivr.net/npm/@mathjax'
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
  output: { displayOverflow: 'scroll' }
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

  function typeset() {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    var scopes = document.querySelectorAll('.post-body');
    var target = scopes.length ? Array.prototype.slice.call(scopes) : undefined;
    window.MathJax.typesetPromise(target).catch(function (err) {
      console.warn('[mathjax] 排版失败', err);
    });
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

  function boot() {
    if (state === 'loading') return;        // 组件就绪后 startup 会排当前 DOM
    if (state === 'ready') { typeset(); return; }
    if (!hasMath()) { prefetch(); return; }

    state = 'loading';
    var s = document.createElement('script');
    s.src = BUNDLE;
    s.async = true;
    s.onload = function () { state = 'ready'; };
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

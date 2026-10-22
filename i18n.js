/* Local bilingual copy. Translate existing nodes so chapter state and listeners survive. */
(() => {
  'use strict';
  const copy = new Map(Object.entries({
    "Joey Wang — Work & Curiosity": "Joey Wang — 作品与好奇心",
    "Joey Wang's personal portfolio. Exploring AI agent engineering, data analysis, and product thinking.": "Joey Wang 的个人作品集，探索 AI 智能体工程、数据分析与产品思考。",
    "Skip to content": "跳至正文",
    "Portfolio entrance": "作品集入场动画",
    "about me": "关于我",
    "Entrance animation": "入场动画进度",
    "Joey Wang, home": "Joey Wang，返回首页",
    "WORK, IDEAS & CURIOSITY": "作品、思考与好奇心",
    "Main navigation": "主导航",
    "Journey": "关于我",
    "Outcomes": "项目成果",
    "Experience": "实习经历",
    "You & me": "联系我",
    "Journey — open chapter": "关于我 — 打开详情",
    "Outcomes — open chapter": "项目成果 — 打开详情",
    "Experience — open chapter": "实习经历 — 打开详情",
    "You & me — open chapter": "联系我 — 打开详情",
    "J — Journey: About me": "J — 关于我：个人介绍",
    "o — Outcomes: Selected work": "o — 项目成果：精选项目",
    "e — Experience: Internships": "e — 实习经历",
    "y — You & me: Say hello": "y — 联系我：打个招呼",
    "Switch to night mode": "切换为夜间模式",
    "Switch to day mode": "切换为日间模式",
    "AI · DATA · PRODUCT": "AI · 数据 · 产品",
    "OPEN TO OPPORTUNITIES": "期待新的机会",
    "OPEN TO WORK": "求职中",
    "About me": "个人介绍",
    "Selected work": "精选项目",
    "Internships": "实习经历",
    "Say hello": "打个招呼",
    "ABOUT / JOEY WANG": "关于 / JOEY WANG",
    "BACKGROUND & BEYOND": "学习与生活",
    "A little about me": "关于我的一些事",
    "Education": "教育经历",
    "Sep 2026–Jun 2028": "2026 年 9 月—2028 年 6 月",
    "Sep 2022–Jul 2026": "2022 年 9 月—2026 年 7 月",
    "University of Southern California": "美国南加州大学",
    "Xi’an Jiaotong-Liverpool University": "西交利物浦大学",
    "University of Southern California seal": "南加州大学校徽",
    "Xi’an Jiaotong-Liverpool University crest": "西交利物浦大学校徽",
    "Master of Science (MS), Data Analytics": "理学硕士（MS），数据分析",
    "Bachelor of Science (BSc), Information Management and Information Systems": "理学学士（BSc），信息管理与信息系统",
    "Coursework: Machine Learning, Big Data Analysis, Database Fundamentals, Advanced Database Management, Fundamentals of Algorithms, E-commerce Systems.": "相关课程：机器学习、大数据分析、数据库基础、高级数据库管理、算法基础、电子商务系统。",
    "Activities: School Football Team, School Traditional Music Ensemble.": "活动与社团：校足球队、校传统音乐乐团。",
    "My toolkit": "我的工具箱",
    "Data analysis": "数据分析",
    "Python, Pandas, SQL, and Excel; data cleaning, statistical analysis, and visualization.": "使用 Python、Pandas、SQL 和 Excel 进行数据清洗、统计分析与可视化。",
    "Databases": "数据库",
    "Microsoft Access and relational database fundamentals.": "Microsoft Access 与关系型数据库基础。",
    "AI tools": "AI 工具",
    "Generative AI for information retrieval, data analysis, code debugging, and report writing.": "使用生成式 AI 辅助信息检索、数据分析、代码调试和报告撰写。",
    "Language": "语言能力",
    "TOEFL 4.5 / 6.0": "托福 4.5 / 6.0",
    "Milestones": "一些里程碑",
    "National Inspirational Scholarship": "国家励志奖学金",
    "2024–2025 and 2025–2026": "2024—2025、2025—2026 学年",
    "2023 Suzhou University Student Arts Exhibition": "2023 年苏州市大学生艺术展演",
    "Second prize, Chinese folk music category": "民族器乐类二等奖",
    "Away from the keyboard": "键盘之外的生活",
    "Member of the university football team.": "校足球队成员。",
    "Member of the university badminton club’s management team. The club received the 2023 Best Club award.": "校羽毛球社管理团队成员，社团获评 2023 年度最佳社团。",
    "Run a personal Douyin content account with nearly 2,000 followers.": "运营个人抖音内容账号，拥有近 2,000 名关注者。",
    "Nudge the lilac flower": "轻碰紫色小花",
    "01 / SELECTED RESEARCH": "01 / 精选研究",
    "Real questions. Real data.": "真实问题，真实数据。",
    "From a question to an insight.": "从一个问题，到一个发现。",
    "RESEARCH NOTES / 02 PROJECTS": "研究笔记 / 两个项目",
    "TWO WAYS OF LOOKING AT DATA": "从两个角度看数据",
    "Choose a research project": "选择研究项目",
    "01 / LIVESTREAM ANALYTICS": "01 / 直播数据分析",
    "Language & GMV": "促销话术与 GMV",
    "02 / MARKET RESEARCH": "02 / 金融市场研究",
    "US equities & strategy": "美股数据与投资策略",
    "PROJECT 01 / RESEARCH": "项目 01 / 研究",
    "Final year project · BUS303": "毕业研究 · BUS303",
    "Promotional language in beauty livestreams and short-term GMV response": "美妆直播促销话术与短期 GMV 响应",
    "An exploratory study of Florasis's official Douyin livestreams, examining the association between promotional language intensity and short-term GMV fluctuations, and connecting minute-level data to practical operating questions.": "以花西子官方抖音直播为对象，探索促销话术强度与短期 GMV 波动之间的关联，将分钟级数据与实际运营问题联系起来。",
    "Valid analysis samples": "有效分析样本",
    "Minute-level event window": "分钟级事件窗口",
    "Range of model-predicted probabilities": "模型预测概率范围",
    "EXPLORATORY RESULT": "探索性结果",
    "The predicted probability rose from approximately 16.3% to 21.9%. This is an associational trend, not a causal finding.": "预测概率从约 16.3% 上升至 21.9%。这一结果反映关联趋势，并非因果结论。",
    "01 / DATA": "01 / 数据",
    "Collected livestream GMV, viewer counts, and related data from DouChaCha. Time-aligned and categorically coded promotional language against minute-level livestream data, yielding 150 valid samples.": "从抖查查收集直播 GMV、观看人数等数据，将促销话术与分钟级直播数据进行时间对齐和分类编码，形成 150 条有效样本。",
    "02 / METHOD": "02 / 方法",
    "Used an event-based observational design, treating each instance of promotional language as an event. Constructed a GMV-spike indicator for the t to t+3-minute window and used binary logistic regression to examine the association between language intensity and spike probability.": "采用事件观察设计，将每次促销话术作为一个事件，构建 t 至 t+3 分钟窗口内的 GMV 峰值指标，并通过二元逻辑回归分析话术强度与峰值出现概率的关联。",
    "03 / INSIGHT": "03 / 发现",
    "The exploratory model suggested a positive association. Combined the statistical results with the business context to recommend improvements in traffic timing, coupons, and product presentation during livestreams.": "探索性模型显示正向关联。结合统计结果与业务场景，提出直播流量节奏、优惠券和产品展示方面的优化建议。",
    "Event-based study": "事件观察研究",
    "Logistic regression": "逻辑回归",
    "LLMs × Tools × Data": "大模型 × 工具 × 数据",
    "JOEY WANG / FIELD NOTES": "JOEY WANG / 研究笔记",
    "PROJECT 02 / RESEARCH": "项目 02 / 研究",
    "US financial data analysis and investment strategy research": "美国金融数据分析与投资策略研究",
    "Combined financial statements and stock-return data to examine the relationship between firm characteristics and returns. Developed data-informed strategy recommendations through cleaning, matching, and regression analysis.": "结合财务报表与股票收益数据，研究企业特征和收益之间的关系，通过数据清洗、匹配与回归分析，提出数据驱动的策略建议。",
    "Firm-year observations": "公司—年度观测值",
    "Dataset variables": "数据集变量",
    "Regression method": "回归方法",
    "ACADEMIC RESEARCH": "学术研究",
    "Strategy recommendations demonstrate the research approach; they do not represent realized investment returns.": "策略建议用于展示研究方法，不代表已实现的投资收益。",
    "Retrieved and merged Compustat financial data with CRSP monthly stock-return data through WRDS. Cleaned and matched the records to build a dataset of 29,266 firm-year observations and 19 variables.": "通过 WRDS 获取并合并 Compustat 财务数据与 CRSP 月度股票收益数据，经清洗和匹配，构建包含 29,266 条公司—年度观测值、19 个变量的数据集。",
    "Used Python for exploratory data analysis and OLS regression. Examined ROA, leverage, profit margin, firm size, and return volatility, and created correlation matrices, variable distributions, and annual-return trend visualizations.": "使用 Python 进行探索性分析与 OLS 回归，研究资产收益率、杠杆率、利润率、公司规模和收益波动率，并制作相关矩阵、变量分布和年度收益趋势图。",
    "Combined the statistical analysis and visual findings to recommend an investment approach that brings together fundamentals and price momentum.": "结合统计分析与可视化结果，提出融合基本面与价格动量的投资思路。",
    "EDA / OLS": "探索性分析 / OLS",
    "Nudge the little star": "轻碰小星星",
    "02 / FIELD EXPERIENCE": "02 / 实习经历",
    "Learning by doing.": "在实践中学习。",
    "Product, cloud platforms, and research.": "产品、云平台与研究。",
    "Jul–Sep 2025": "2025 年 7—9 月",
    "Jun–Aug 2024": "2024 年 6—8 月",
    "Jan–Mar 2024": "2024 年 1—3 月",
    "Hangzhou, Zhejiang · On-site": "中国浙江杭州 · 现场办公",
    "Haidian, Beijing · On-site": "中国北京海淀 · 现场办公",
    "Hangzhou": "杭州",
    "HarmonyCloud": "诺云科技（HarmonyCloud）",
    "CCB Fintech": "建信金融科技",
    "Cloud Product QA Engineer": "云产品质量工程师（QA）",
    "Cloud Product Engineer": "云产品工程师",
    "Internship": "实习",
    "Developed product and admin manuals, improving internal training efficiency by 30%.": "编写产品及管理员手册，使内部培训效率提升 30%。",
    "Tested the tenant management system, identifying 17 bugs (3 high-priority) and supporting pre-launch fixes.": "测试租户管理系统，发现 17 个缺陷（其中 3 个为高优先级），并支持上线前修复。",
    "Product documentation / Quality analysis": "产品文档 / 质量分析",
    "17 BUGS": "17 个缺陷",
    "Conducted end-to-end testing for two cloud projects, covering regression testing, defect tracking, and developer collaboration.": "为两个云项目开展端到端测试，涵盖回归测试、缺陷跟踪与开发协作。",
    "Tested database migration and primary–replica failover, improving switchover performance through parameter tuning and process optimization.": "测试数据库迁移与主从故障切换，通过参数调优和流程优化提升切换性能。",
    "Test execution / Defect resolution": "测试执行 / 缺陷修复",
    "2 PROJECTS": "2 个项目",
    "Zhongcai Group · Luting Investment": "中财集团绿汀投资",
    "Intern": "日常实习生",
    "Tracked company financial reports and operating data. Collected, organized, and summarized key financial information to support investment research.": "跟踪企业财报及运营数据，收集、整理与汇总关键财务信息，为投资研究提供数据支持。",
    "Assisted with investment-research report reviews and stock-trade execution, helping improve the accuracy of research materials and compliance of trade execution.": "参与投资研究报告审核与股票交易执行，协助提升研究材料准确性及交易执行合规性。",
    "Financial data / Research support": "财务数据 / 研究支持",
    "RESEARCH": "研究支持",
    "Nudge the little ribbon": "轻碰小缎带",
    "Let's build something.": "一起做点有意思的事。",
    "Open to suitable roles and internships, and always happy to talk about data analysis, product work, and practical technology projects.": "期待合适的工作与实习机会，也很乐意聊聊数据分析、产品工作，以及让技术落地的项目。",
    "Joey Wang on LinkedIn (opens in a new tab)": "Joey Wang 的领英主页（在新标签页打开）",
    "Copy email": "复制邮箱",
    "Copied!": "已复制！",
    "Email copied. Let’s make something good.": "邮箱已复制，期待与你交流。",
    "Select and copy the email address above.": "请选择并复制上方的邮箱地址。",
    "Hi, I’m Joey. Curious about AI, data, and what comes next.": "嗨，我是 Joey。对 AI、数据和接下来的可能保持好奇。",
    "Four letters. A little more about me.": "四个字母，带你多了解我一点。",
    "Replay hello": "重播入场",
    "Close chapter and return to home": "关闭详情并返回首页",
    "Back to Joey": "返回首页",
    "Previous chapter": "上一页",
    "Next chapter": "下一页",
    "Close chapter": "关闭详情",
    "Chapter content": "详情内容",
    "JOEY WANG / A LITTLE MORE TO EXPLORE": "JOEY WANG / 继续了解一点",
    "01 / MY STORY SO FAR": "01 / 我的故事",
    "02 / SELECTED WORK": "02 / 精选项目",
    "03 / LEARNING BY DOING": "03 / 在实践中学习",
    "04 / YOUR NEXT COLLABORATOR": "04 / 期待与你合作",
    "Where I’m learning, what I work with, and a little life away from the keyboard.": "在哪里学习、用什么工具工作，以及键盘之外的一点生活。",
    "Two research projects. From real questions and real data to a little more understanding.": "两个研究项目，从真实问题和数据出发，多理解一点。",
    "Product, cloud platforms, and research. A few things I’ve learned along the way.": "产品、云平台与研究，以及一路实践中的收获。",
    "A good conversation is a pretty good place to start.": "从一次愉快的交流开始。",
    "A small reminder to stay curious.": "小小提醒：保持好奇心。",
    "Sending a little good luck your way.": "送你一点好运。"
  }));
  for (const title of ['Journey', 'Outcomes', 'Experience', 'You & me']) {
    copy.set(`Next chapter: ${title}`, `下一页：${copy.get(title)}`);
    copy.set(`Previous chapter: ${title}`, `上一页：${copy.get(title)}`);
  }
  const textRecords = new WeakMap();
  const attributeRecords = new WeakMap();
  const attributes = ['aria-label', 'title', 'alt'];
  let language = 'en';
  try { language = localStorage.getItem('joey-language') === 'zh' ? 'zh' : 'en'; } catch { /* Storage is optional. */ }
  const queryLanguage = new URLSearchParams(location.search).get('lang');
  if (queryLanguage === 'en' || queryLanguage === 'zh') language = queryLanguage;

  function recordFor(value, previous) {
    if (previous && (value === previous.en || value === previous.zh)) return previous;
    const translated = copy.get(value.trim());
    if (!translated) return null;
    const leading = value.match(/^\s*/)[0], trailing = value.match(/\s*$/)[0];
    return { en: value, zh: leading + translated + trailing };
  }
  function translateText(node) {
    if (node.parentElement?.closest('script,style,noscript,.language-toggle,[translate="no"]')) return;
    const record = recordFor(node.nodeValue, textRecords.get(node));
    if (!record) { textRecords.delete(node); return; }
    textRecords.set(node, record);
    if (node.nodeValue !== record[language]) node.nodeValue = record[language];
  }
  function translateAttributes(element) {
    if (element.closest('.language-toggle,[translate="no"]')) return;
    let records = attributeRecords.get(element);
    if (!records) { records = new Map(); attributeRecords.set(element, records); }
    attributes.forEach(name => {
      const value = element.getAttribute(name);
      if (value === null) return;
      const record = recordFor(value, records.get(name));
      if (!record) { records.delete(name); return; }
      records.set(name, record);
      if (value !== record[language]) element.setAttribute(name, record[language]);
    });
  }
  function translateTree(node) {
    if (node.nodeType === Node.TEXT_NODE) { translateText(node); return; }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.closest('script,style,noscript,.language-toggle,[translate="no"]')) return;
      translateAttributes(node);
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const child = walker.currentNode;
      if (child.nodeType === Node.TEXT_NODE) translateText(child);
      else translateAttributes(child);
    }
  }
  function renderControls() {
    document.querySelectorAll('.language-toggle').forEach(button => {
      button.hidden = false;
      const label = language === 'en' ? '中文' : 'English';
      const text = button.querySelector('.language-name');
      if (text.textContent !== label) text.textContent = label;
      const accessible = language === 'en' ? 'Switch to Chinese' : '切换为英文';
      if (button.getAttribute('aria-label') !== accessible) button.setAttribute('aria-label', accessible);
      if (button.title !== accessible) button.title = accessible;
      button.lang = language === 'en' ? 'zh-CN' : 'en';
    });
  }
  const description = document.querySelector('meta[name="description"]');
  const englishDescription = description.content;
  function setLanguage(next, persist = true) {
    language = next === 'zh' ? 'zh' : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    translateTree(document.documentElement);
    description.content = language === 'zh' ? copy.get(englishDescription) : englishDescription;
    renderControls();
    if (persist) {
      try { localStorage.setItem('joey-language', language); } catch { /* Storage is optional. */ }
      // Keep explicit language links consistent with the current selection.
      if (new URLSearchParams(location.search).has('lang')) {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
    }
  }
  document.querySelectorAll('.language-toggle').forEach(button => {
    button.addEventListener('click', () => setLanguage(language === 'en' ? 'zh' : 'en'));
  });
  setLanguage(language, false);
  const observer = new MutationObserver(records => {
    const roots = new Set();
    records.forEach(record => {
      if (record.type === 'childList') record.addedNodes.forEach(node => roots.add(node));
      else roots.add(record.target);
    });
    roots.forEach(node => { if (node.isConnected) translateTree(node); });
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes });
  window.JoeyI18n = { setLanguage, get language() { return language; } };
})();

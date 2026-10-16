import type { Dictionary } from "./en";

export const zh: Dictionary = {
  common: {
    language: "语言",
    chooseLanguage: "语言",
  },

  meta: {
    titleDefault: "UangForge — 看工厂现场构建",
    titleHome: "看 AI Factory 现场构建",
    titleApp: "构建完成的应用",
    titleQa: "问答 — 关于本项目",
    descriptionDefault:
      "选择一个场景或描述一个小生意应用，然后看工厂如何规划、构建、测试并交付它——是能真正运行的应用，不是模型。",
    descriptionHome:
      "描述一个小生意应用，看工厂如何规划、构建、测试并交付——然后直接使用成果。每次构建都可以通过 URL 分享。",
    descriptionApp: "由 UangForge 构建的、可正常运行的应用，完整编码在这条 URL 里。",
    descriptionQa:
      "关于 UangForge 的直接问答：工厂究竟做了什么，哪些是 AI、哪些是确定性代码，诚实原则、隐私，以及与 uang.ai 的关系。",
    ogDescription:
      "输入一个小生意应用，看工厂现场把它建出来，然后直接使用。Rico 的作品集项目。",
  },

  nav: {
    factory: "工厂",
    how: "工作原理",
    openApp: "打开应用",
    qa: "问答",
  },

  footer: {
    tagline:
      "Rico 的作品集项目。应用由受严格约束的 blueprint 模式构建——运行时是确定性的，结果是真实的。与 uang.ai 无隶属或背书关系。",
  },

  hero: {
    badge: "UangForge — 工厂证明之三",
    titleA: "别只读关于 AI Factory 的介绍。",
    titleAccent: " 运行它。",
    bodyA:
      "描述一个小生意应用，看它在您面前被规划、构建、测试并交付——然后真正去使用它。LLM 填写受约束的 blueprint；由确定性运行时构建应用。",
    bodyEm: "这",
    bodyB: "才是用 AI 构建软件并且保持诚实的方式。",
    step1: "① 描述或选择一个场景",
    step2: "② 看规划 → 构建 → 测试 → 交付",
    step3: "③ 应用是真的——点它试试",
  },

  how: {
    title: "为什么这是诚实的",
    intro:
      "\"看 AI 构建应用\"类的演示通常有猫腻——一段视频、一个模拟，或者只是偶尔能编译的代码。UangForge 走的是无聊但真实的路线：",
    constraintTitle: "约束空间",
    constraintBody:
      "运行时能构建：最多 2 个实体、每个 2–7 个类型化字段（文本、数字、货币、日期、选择、布尔），表格/看板/日历视图，count/sum/avg 仪表卡，以及一条带人工确认的审批流程。这就是全部词汇表——而这正是每次构建都能成功的原因。在限制之内，结果是真正有用的记录工具；超出限制，工厂会说\"不\"，而不是装作可以。",
    items: [
      {
        t: "规划 — blueprint，而非代码",
        d: "规划 LLM 在固定的约束空间内填写严格的 JSON 模式：实体类型、字段类型、视图、指标、一条审批流程。它从不写代码——任意输出在构造上就不可能。",
      },
      {
        t: "构建 — 确定性运行时",
        d: "同一台机器解释每个 blueprint：模式、种子数据、仪表卡、表格/看板/日历视图、创建表单、审批闸门。模块经过验证，没有意外。",
      },
      {
        t: "测试 — 真实检查，真实质检",
        d: "测试阶段对 blueprint 执行真正的校验：模式边界、字段类型、视图可渲染、聚合可解析、流程合理。任何检查失败都会停止生产线。",
      },
      {
        t: "交付 — 能用的应用 + URL",
        d: "完成的应用直接在页面上运行、持久化到您的浏览器，并活在一个可分享的 URL 里——整个 blueprint 被压缩进链接。没有数据库，什么都不存储。",
      },
    ],
  },

  factory: {
    placeholder:
      "描述一个小生意应用…例如\"一个带审批的健身房会员记录\"",
    buildBtn: "构建",
    note: "规划器填写严格的 blueprint 模式——从不写代码。没有 LLM 密钥时，会改为提供最接近的精选模板，并明确标注。",
    orScenario: "…或看一个场景被构建",
    requesting: "正在请求 blueprint…",
    stages: { plan: "规划", build: "构建", test: "测试", ship: "交付" },
    plannedByLlm: "由 LLM 规划",
    curatedTemplate: "精选模板",
    newBuild: "← 新的构建",
    planSpec: "规划 — blueprint 规格",
    blueprintJson: "blueprint.json — 整个应用",
    buildModulesTitle: "构建 — 运行时模块",
    testTitle: "测试 — 对 blueprint 的真实检查",
    shipped: "已交付 — {name} 正在下方运行",
    openStandalone: "独立打开（可分享的 URL）↗",
    copyLink: "复制链接",
    copied: "链接已复制 ✓",
    remix: "以此构建为底再改",
    resetData: "重置应用数据",
    plannerUnavailable: "规划器不可用。",
    networkError: "网络错误 — 无法连接工厂。",
    qcFailed: "质检未通过：{check}",
    modules: [
      { desc: "实体 + 字段定义" },
      { desc: "真实的示例数据行，合并 LLM 样本" },
      { desc: "count / sum / avg 卡片 + 状态分布" },
      { desc: "表格 · 看板 · 日历" },
      { desc: "创建 / 编辑记录弹窗" },
      { desc: "审批闸门" },
    ],
    checks: [
      "模式：约束空间有效",
      "字段：每个字段都有类型",
      "视图：可对实体渲染",
      "仪表：聚合可解析",
      "流程：存在审批路径",
      "样本：LLM 数据行通过类型检查",
      "种子：生成了真实的演示数据",
    ],
  },

  runtime: {
    booting: "正在启动运行时…",
    statusBreakdown: "状态分布",
    newEntity: "+ 新建{name}",
    searchPlaceholder: "搜索{name}…",
    filterByStatus: "按状态筛选{name}",
    allStatuses: "全部状态",
    rowsOf: "{n} / {total} 行",
    edit: "编辑",
    editAria: "编辑{name}行",
    delete: "删除",
    deleteAria: "删除{name}行",
    noMatch: "没有匹配的{name}。",
    saveEntity: "保存{name}",
    cancel: "取消",
    approve: "批准",
    rejectAria: "拒绝该行",
    confirmBody: "人工确认：把这个{entity}从“{from}”移到“{to}”？",
    undo: "撤销",
    dragTitle: "拖到其他列即可更改状态",
    today: "今天",
    prevMonth: "上个月",
    nextMonth: "下个月",
    currentMonth: "本月",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    created: "{name} 已创建",
    updated: "{name} 已更新",
    deleted: "{name} 已删除",
    movedTo: "已移至 {col}",
    wfApproved: "{name} 已批准",
    wfRejected: "{name} 已拒绝",
  },

  appPage: {
    livesInUrl: "活在这条 URL 里",
    buildYourOwn: "构建你自己的 ↗",
    persistenceNote:
      "记录仅保存在您的浏览器中（localStorage）。清除站点数据即可重置，或直接分享 URL——整个应用都在链接里。",
    noBuildTitle: "这条 URL 里没有构建",
    noBuildBodyA: "链接应该形如 ",
    noBuildBodyB: "。blueprint 可能已损坏——回工厂重新构建一个吧。",
    goFactory: "去工厂",
  },

  qa: {
    heading: "问答",
    intro: "关于 UangForge 的直接回答：工厂究竟做了什么，哪些是 AI、哪些是确定性代码，诚实的保障从何而来。",
    convinced: "信了吗？",
    runBuild: "跑一次构建",
    convincedTail: "，自己核对结果。",
    categories: [
      {
        id: "project",
        label: "关于项目",
        items: [
          {
            q: "UangForge 是什么？",
            a: "一个让您亲眼看到软件被制造出来的作品集项目：选择或描述一个小生意应用，网站会在您面前规划、构建、测试并交付它——最终得到一个可以立即使用、可以通过 URL 分享的应用。它是为 uang.ai（\"The AI Factory\"）打造的三部曲展示中\"看工厂干活\"的那一部分。",
          },
          {
            q: "为什么要做这个？",
            a: "因为\"用 AI 构建定制软件\"说起来容易、展示起来难。UangLite 展示智能体操作真实的 ERP；UangFactory（网站）用证明代替讲述；UangForge 更进一步：它现场演示交付闭环本身——uang.ai 名字里的那件事——就在浏览器里，不到一分钟。",
          },
          {
            q: "这和 uang.ai 有隶属关系吗？",
            a: "没有。Rico 的独立作品集项目——与 uang.ai 无隶属或背书关系。",
          },
        ],
      },
      {
        id: "real",
        label: "哪些是 AI，哪些是真的",
        items: [
          {
            q: "AI 真的构建了这个应用吗？",
            a: "诚实拆解如下：LLM 是规划者——它根据您的描述填写严格的 JSON blueprint（实体、字段、视图、指标、流程）。一个确定性运行时——普通的、经过测试的 React 代码——根据 blueprint 构建真正的应用。所以是的，您看到的应用是真的被构建并且真的在运行；不，模型不写任意代码。这个分工正是全部要点。",
          },
          {
            q: "为什么不让 LLM 直接写代码？",
            a: "因为那样演示就只是\"有时\"能成功——而一个有时能成功的工厂是演示，不是工厂。把模型约束在固定运行时的模式内，意味着每次构建都成功、每次构建都可测、任何东西都造假不了。很多真实的生产级 AI 也是这么做的：模型负责判断，工程负责其余。",
          },
          {
            q: "这个工厂究竟能构建什么？",
            a: "运行时的全部词汇：最多 2 个实体、每个 2–7 个类型化字段，表格/看板/日历视图，count/sum/avg 仪表卡，种子数据，一个创建记录的表单，以及一条带人工确认的审批流程。会员记录、休假审批、bug 分诊、库存补货——这类应用。词汇之外的东西工厂会拒绝，而不是装作可以。",
          },
          {
            q: "测试阶段是真的吗？",
            a: "是的——这正是大多数同类演示造假的部分。这些检查对您的 blueprint 执行真正的校验：模式边界、每个字段都有类型、视图可对实体解析、聚合可解析、流程状态不同且存在。检查失败会停止生产线；兜底方案是标注清楚的精选模板，绝不是编造的结果。",
          },
          {
            q: "如果没有配置 LLM API 密钥会怎样？",
            a: "您会得到精选模板库里最接近的匹配，明确标注\"精选模板\"。有密钥时，规划器会根据任意描述进行规划，结果标注\"由 LLM 规划\"。如果规划器两次未通过校验，您会得到精选兜底结果，外加一条说明来龙去脉的提示。",
          },
        ],
      },
      {
        id: "privacy",
        label: "隐私与数据",
        items: [
          {
            q: "我的数据存在哪里？",
            a: "在您的浏览器里。您创建的记录以从应用 blueprint 派生的键保存在 localStorage 中。没有数据库。整个构建好的应用都编码在它的 URL 里，所以链接不可能泄露您打开之后输入的数据。",
          },
          {
            q: "LLM 能看到什么？",
            a: "只有您的提示词（您输入的内容）。您在构建出的应用里创建的记录绝不会发送到任何地方——它们从不离开您的浏览器。",
          },
        ],
      },
      {
        id: "stack",
        label: "技术栈与元信息",
        items: [
          {
            q: "它是用什么构建的？",
            a: "Next.js 16（App Router）· React 19 · Tailwind CSS 4 · TypeScript · AI SDK（任意 OpenAI 兼容端点）· zod 定义 blueprint 模式 · URL 编解码器（deflate + base64url）让应用活在链接里 · Vitest + Playwright 做测试。设计上就没有数据库。",
          },
          {
            q: "交付前是怎么验证的？",
            a: "生成策略先做了技术验证：用小模型，8/8 个提示词第一次尝试就产出了符合模式的 blueprint。单元测试覆盖模式（包括流程合理性规则）、URL 编解码往返和种子数据的确定性。Playwright 端到端测试通过真实的\"舞台\"构建应用、通过真实表单创建记录、跑通审批流程并打开分享的 URL。",
          },
          {
            q: "我可以运行自己的实例吗？",
            a: "可以——开源。把 LLM_BASE_URL / LLM_API_KEY / LLM_MODEL 设置为任意 OpenAI 兼容端点（包括本地端点）。没有这些配置时，精选模板库依然支撑完整体验。",
          },
        ],
      },
    ],
  },

  notFound: {
    line: "这个页面不在合同里。",
    back: "回工厂",
  },

  themeToggle: {
    ariaLight: "切换到浅色模式",
    ariaDark: "切换到深色模式",
    srOnly: "切换主题",
  },

  apiNotes: {
    rateLimited: "此地址构建次数过多 — 请一分钟后重试。",
    invalidJson: "JSON 无效",
    promptLength: "请用 4-200 个字符描述应用。",
    noLlm: "未配置 LLM 端点 — 已提供最接近的精选模板。配置 LLM_* 即可从任意描述进行规划。",
    planFailed: "规划器两次都未能为该描述生成有效的 blueprint — 已改为提供最接近的精选模板。没有交付任何伪造的东西。",
  },
};

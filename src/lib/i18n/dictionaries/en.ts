export const en = {
  common: {
    language: "Language",
    chooseLanguage: "Language",
  },

  meta: {
    titleDefault: "UangForge — watch the factory build",
    titleHome: "Watch the AI Factory build",
    titleApp: "Built app",
    titleQa: "Q&A — about this project",
    descriptionDefault:
      "Pick a scenario or describe a small business app, then watch the factory plan, build, test and ship it — a working app, not a mockup.",
    descriptionHome:
      "Describe a small business app, watch the factory plan, build, test and ship it — then use the working result. Every build is shareable by URL.",
    descriptionApp: "A working app built by UangForge, encoded entirely in this URL.",
    descriptionQa:
      "Questions and straight answers about UangForge: what the factory really does, what's AI vs deterministic, honesty rules, privacy, and how it relates to uang.ai.",
    ogDescription:
      "Type a small business app, watch the factory build it live, use the result. A portfolio build by Rico.",
  },

  nav: {
    factory: "Factory",
    how: "How it works",
    openApp: "Open app",
    qa: "Q&A",
  },

  footer: {
    tagline:
      "Portfolio build by Rico. Apps are built from a constrained blueprint schema — the runtime is deterministic, the results are real. Not affiliated with or endorsed by uang.ai.",
  },

  hero: {
    badge: "UangForge — the third factory proof",
    titleA: "Don't read about the AI Factory.",
    titleAccent: " Run it.",
    bodyA:
      "Describe a small business app and watch it get planned, built, tested and shipped in front of you — then actually use it. The LLM fills a constrained blueprint; a deterministic runtime builds the app. ",
    bodyEm: "That",
    bodyB: " is how you build software with AI and keep it honest.",
    step1: "① describe or pick a scenario",
    step2: "② watch plan → build → test → ship",
    step3: "③ the app is real — go on, click it",
  },

  how: {
    title: "Why this is honest",
    intro:
      "“Watch AI build an app” demos usually cheat — a video, a simulation, or code that only sometimes compiles. UangForge takes the boring-but-real route:",
    constraintTitle: "The constraint space",
    constraintBody:
      "The runtime can build: up to 2 entities with 2–7 typed fields (text, number, currency, date, select, boolean), table/board/calendar views, count/sum/avg dashboard cards, and one approval workflow with a human confirm. That's the whole vocabulary — which is exactly why every build works. Inside the limits, the results are genuinely useful trackers; outside them, the factory says no instead of pretending.",
    items: [
      {
        t: "Plan — the blueprint, not code",
        d: "The planner LLM fills a strict JSON schema inside a fixed constraint space: entity types, field types, views, metrics, one approval workflow. It never writes code — arbitrary output is impossible by construction.",
      },
      {
        t: "Build — a deterministic runtime",
        d: "The same machine interprets every blueprint: schema, seed data, dashboard cards, table/board/calendar views, a create form, an approval gate. Verified modules, no surprises.",
      },
      {
        t: "Test — real checks, real QC",
        d: "The test stage executes actual validations against the blueprint: schema bounds, typed fields, renderable views, resolvable aggregations, a sane workflow. A failing check stops the line.",
      },
      {
        t: "Ship — a working app + a URL",
        d: "The finished app runs live on the page, persists to your browser, and lives in a shareable URL — the whole blueprint is compressed into the link. No database, nothing stored.",
      },
    ],
  },

  factory: {
    placeholder:
      "Describe a small business app… e.g. “a gym membership tracker with approval”",
    buildBtn: "Build it",
    note: "The planner fills a strict blueprint schema — never code. Without an LLM key the nearest curated template is served instead, labeled as such.",
    orScenario: "…or watch a scenario build",
    requesting: "Requesting blueprint…",
    stages: { plan: "PLAN", build: "BUILD", test: "TEST", ship: "SHIP" },
    plannedByLlm: "planned by LLM",
    curatedTemplate: "curated template",
    newBuild: "← new build",
    planSpec: "Plan — blueprint spec",
    blueprintJson: "blueprint.json — the whole app",
    buildModulesTitle: "Build — runtime modules",
    testTitle: "Test — real checks on the blueprint",
    shipped: "SHIPPED — {name} is live below",
    openStandalone: "Open standalone (shareable URL) ↗",
    copyLink: "copy link",
    copied: "link copied ✓",
    remix: "remix this build",
    resetData: "reset app data",
    plannerUnavailable: "The planner is unavailable.",
    networkError: "Network error — could not reach the factory.",
    qcFailed: "QC failed at: {check}",
    modules: [
      { desc: "entity + field definitions" },
      { desc: "realistic demo rows, LLM samples merged" },
      { desc: "count / sum / avg cards + breakdown" },
      { desc: "table · board · calendar" },
      { desc: "create / edit record modal" },
      { desc: "approval gate" },
    ],
    checks: [
      "schema: valid constraint space",
      "fields: every field typed",
      "views: renderable against entities",
      "dashboard: aggregations resolvable",
      "workflow: approval path exists",
      "samples: LLM rows type-checked",
      "seed: realistic demo data generated",
    ],
  },

  runtime: {
    booting: "Booting runtime…",
    statusBreakdown: "status breakdown",
    newEntity: "+ New {name}",
    searchPlaceholder: "Search {name}…",
    filterByStatus: "Filter {name} by status",
    allStatuses: "all statuses",
    rowsOf: "{n} of {total} rows",
    edit: "Edit",
    editAria: "Edit {name} row",
    delete: "Delete",
    deleteAria: "Delete {name} row",
    noMatch: "No {name} match.",
    saveEntity: "Save {name}",
    cancel: "Cancel",
    approve: "Approve",
    rejectAria: "Reject row",
    confirmBody:
      "Human-in-the-loop check: move this {entity} from “{from}” to “{to}”?",
    undo: "Undo",
    dragTitle: "Drag to another column to change status",
    today: "today",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    currentMonth: "Current month",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    created: "{name} created",
    updated: "{name} updated",
    deleted: "{name} deleted",
    movedTo: "moved to {col}",
    wfApproved: "{name} approved",
    wfRejected: "{name} rejected",
  },

  appPage: {
    livesInUrl: "lives in this URL",
    buildYourOwn: "build your own ↗",
    persistenceNote:
      "Records persist in your browser only (localStorage). Reset by clearing site data, or share the URL — the whole app is inside the link.",
    noBuildTitle: "No build found in this URL",
    noBuildBodyA: "The link should look like ",
    noBuildBodyB:
      ". The blueprint may be malformed — head back to the factory and build a fresh one.",
    goFactory: "Go to the factory",
  },

  qa: {
    heading: "Q&A",
    intro:
      "Straight answers about UangForge: what the factory really does, what's AI versus deterministic, and where the honesty guarantees come from.",
    convinced: "Convinced? ",
    runBuild: "Run a build",
    convincedTail: " and check the results yourself.",
    categories: [
      {
        id: "project",
        label: "The project",
        items: [
          {
            q: "What is UangForge?",
            a: "A portfolio build where you watch software get made: pick or describe a small business app, and the site plans it, builds it, tests it and ships it in front of you — ending in a working app you can use immediately and share by URL. It's the \"watch the factory work\" piece of a three-part showcase for uang.ai (\"The AI Factory\").",
          },
          {
            q: "Why does this exist?",
            a: "Because \"bespoke software built with AI\" is easy to claim and hard to show. UangLite shows an agent operating a real ERP; UangFactory (the website) proves instead of tells; UangForge goes all the way: it demonstrates the delivery loop itself — the thing uang.ai literally names itself after — live, in the browser, in under a minute.",
          },
          {
            q: "Is this affiliated with uang.ai?",
            a: "No. Independent portfolio work by Rico — not affiliated with or endorsed by uang.ai.",
          },
        ],
      },
      {
        id: "real",
        label: "What's AI vs. what's real",
        items: [
          {
            q: "Does the AI really build the app?",
            a: "Here is the honest breakdown: the LLM is the planner — it fills a strict JSON blueprint (entities, fields, views, metrics, workflow) from your description. A deterministic runtime — ordinary, tested React code — builds the actual app from that blueprint. So yes, the app you see is really built and really runs; no, the model doesn't write arbitrary code. That division is the whole point.",
          },
          {
            q: "Why not let the LLM write the code?",
            a: "Because then the demo sometimes works — and a factory that sometimes works is a demo, not a factory. Constraining the model to a schema inside a fixed runtime means every build succeeds, every build is testable, and nothing can be faked. It's also how a lot of real production AI works: model the judgment, engineering the rest.",
          },
          {
            q: "What can the factory actually build?",
            a: "The runtime's full vocabulary: up to 2 entities with 2–7 typed fields, table/board/calendar views, count/sum/avg dashboard cards, seed data, a create-record form, and one approval workflow with a human confirm. Membership trackers, leave approvals, bug triage, inventory reorders — that class of app. The factory refuses what's outside the vocabulary instead of pretending.",
          },
          {
            q: "Is the test stage real?",
            a: "Yes — it's the part most similar demos fake. The checks execute actual validations against your blueprint: schema bounds, every field typed, views resolvable against entities, aggregations resolvable, workflow statuses distinct and present. A failing check stops the line; the fallback is a labeled curated template, never a fabricated result.",
          },
          {
            q: "What if there's no LLM API key configured?",
            a: "You get the nearest match from the curated template library, clearly labeled \"curated template\". With a key, the planner plans from any description and the result is labeled \"planned by LLM\". If the planner fails validation twice, you get the curated fallback plus a note explaining exactly what happened.",
          },
        ],
      },
      {
        id: "privacy",
        label: "Privacy & data",
        items: [
          {
            q: "Where is my data stored?",
            a: "In your browser. Records you create persist in localStorage under a key derived from the app's blueprint. There is no database. The whole built app is encoded inside its URL, so a link can never leak data you entered after opening it.",
          },
          {
            q: "What does the LLM see?",
            a: "Only your prompt (what you typed). No records you create in a built app are ever sent anywhere — they never leave your browser.",
          },
        ],
      },
      {
        id: "stack",
        label: "Stack & meta",
        items: [
          {
            q: "What is it built with?",
            a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK with any OpenAI-compatible endpoint · zod for the blueprint schema · a URL codec (deflate + base64url) so apps live in links · Vitest + Playwright for tests. No database by design.",
          },
          {
            q: "How was it verified before being shipped?",
            a: "The generation strategy was spiked first: 8/8 prompts produced schema-valid blueprints on the first try with a small model. Unit tests cover the schema (including workflow sanity rules), the URL codec round-trip, and seed determinism. Playwright end-to-end tests build an app through the real theater, create a record through the real form, run the approval flow, and open a shared URL.",
          },
          {
            q: "Can I run my own instance?",
            a: "Yes — open source. Set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL to any OpenAI-compatible endpoint (including a local one). Without them the curated library still powers the whole experience.",
          },
        ],
      },
    ],
  },

  notFound: {
    line: "This page is not in the contract.",
    back: "Back to the factory",
  },

  themeToggle: {
    ariaLight: "Switch to light mode",
    ariaDark: "Switch to dark mode",
    srOnly: "Toggle theme",
  },

  apiNotes: {
    rateLimited: "Too many builds from this address — try again in a minute.",
    invalidJson: "Invalid JSON",
    promptLength: "Describe the app in 4-200 characters.",
    noLlm:
      "No LLM endpoint configured — served the nearest curated template. Configure LLM_* to plan from any description.",
    planFailed:
      "The planner could not produce a valid blueprint for that description (twice) — served the nearest curated template instead. Nothing fake was shipped.",
  },
};

export type Dictionary = typeof en;

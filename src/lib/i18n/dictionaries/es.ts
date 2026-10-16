import type { Dictionary } from "./en";

export const es: Dictionary = {
  common: {
    language: "Idioma",
    chooseLanguage: "Idioma",
  },

  meta: {
    titleDefault: "UangForge — mira cómo construye la fábrica",
    titleHome: "Mira cómo la AI Factory construye",
    titleApp: "App construida",
    titleQa: "Preguntas y respuestas — sobre este proyecto",
    descriptionDefault:
      "Elige un escenario o describe una app pequeña de negocio, y mira cómo la fábrica la planifica, construye, prueba y entrega — una app que funciona, no una maqueta.",
    descriptionHome:
      "Describe una app pequeña de negocio y mira cómo la fábrica la planifica, construye, prueba y entrega — y luego usa el resultado. Cada construcción se comparte por URL.",
    descriptionApp: "Una app que funciona, construida por UangForge, codificada por completo en esta URL.",
    descriptionQa:
      "Preguntas y respuestas directas sobre UangForge: qué hace realmente la fábrica, qué es IA vs. determinista, reglas de honestidad, privacidad y su relación con uang.ai.",
    ogDescription:
      "Escribe una app pequeña de negocio, mira cómo la fábrica la construye en vivo y usa el resultado. Obra de portafolio de Rico.",
  },

  nav: {
    factory: "Fábrica",
    how: "Cómo funciona",
    openApp: "Abrir app",
    qa: "Q&A",
  },

  footer: {
    tagline:
      "Obra de portafolio de Rico. Las apps se construyen a partir de un esquema de blueprint restringido — el runtime es determinista, los resultados son reales. Sin afiliación ni respaldo de uang.ai.",
  },

  hero: {
    badge: "UangForge — la tercera prueba de la fábrica",
    titleA: "No leas sobre la AI Factory.",
    titleAccent: " Ejecútala.",
    bodyA:
      "Describe una app pequeña de negocio y mira cómo se planifica, construye, prueba y entrega frente a ti — y luego úsala de verdad. El LLM rellena un blueprint restringido; un runtime determinista construye la app. ",
    bodyEm: "Esa",
    bodyB: " es la forma de construir software con IA manteniendo la honestidad.",
    step1: "① describe o elige un escenario",
    step2: "② mira planificar → construir → probar → entregar",
    step3: "③ la app es real — haz clic, adelante",
  },

  how: {
    title: "Por qué esto es honesto",
    intro:
      "Las demos de \"mira a la IA construir una app\" suelen hacer trampa — un video, una simulación, o código que solo a veces compila. UangForge toma el camino aburrido pero real:",
    constraintTitle: "El espacio de restricciones",
    constraintBody:
      "El runtime puede construir: hasta 2 entidades con 2–7 campos tipados (texto, número, moneda, fecha, selección, booleano), vistas de tabla/tablero/calendario, tarjetas de dashboard count/sum/avg y un flujo de aprobación con confirmación humana. Ese es todo el vocabulario — y por eso exactamente cada construcción funciona. Dentro de los límites, los resultados son rastreadores genuinamente útiles; fuera de ellos, la fábrica dice no en lugar de fingir.",
    items: [
      {
        t: "Planificar — el blueprint, no código",
        d: "El LLM planificador rellena un esquema JSON estricto dentro de un espacio de restricciones fijo: tipos de entidad, tipos de campo, vistas, métricas, un flujo de aprobación. Nunca escribe código — la salida arbitraria es imposible por construcción.",
      },
      {
        t: "Construir — un runtime determinista",
        d: "La misma máquina interpreta cada blueprint: esquema, datos semilla, tarjetas de dashboard, vistas de tabla/tablero/calendario, un formulario de creación, una puerta de aprobación. Módulos verificados, sin sorpresas.",
      },
      {
        t: "Probar — controles reales, QC real",
        d: "La etapa de prueba ejecuta validaciones reales contra el blueprint: límites del esquema, campos tipados, vistas renderizables, agregaciones resolubles, un flujo de trabajo sensato. Un control fallido detiene la línea.",
      },
      {
        t: "Entregar — una app que funciona + URL",
        d: "La app terminada corre en vivo en la página, persiste en tu navegador y vive en una URL compartible — todo el blueprint está comprimido en el enlace. Sin base de datos, nada se guarda.",
      },
    ],
  },

  factory: {
    placeholder:
      "Describe una app pequeña de negocio… p. ej. “un rastreador de membresías de gimnasio con aprobación”",
    buildBtn: "Construir",
    note: "El planificador rellena un esquema de blueprint estricto — nunca código. Sin clave de LLM se sirve la plantilla curada más cercana, etiquetada como tal.",
    orScenario: "…o mira construir un escenario",
    requesting: "Solicitando blueprint…",
    stages: { plan: "PLAN", build: "CONSTRUIR", test: "PROBAR", ship: "ENTREGAR" },
    plannedByLlm: "planificado por LLM",
    curatedTemplate: "plantilla curada",
    newBuild: "← nueva construcción",
    planSpec: "Plan — especificación del blueprint",
    blueprintJson: "blueprint.json — toda la app",
    buildModulesTitle: "Construir — módulos del runtime",
    testTitle: "Probar — controles reales sobre el blueprint",
    shipped: "ENTREGADA — {name} está activa abajo",
    openStandalone: "Abrir independiente (URL compartible) ↗",
    copyLink: "copiar enlace",
    copied: "enlace copiado ✓",
    remix: "remix de esta construcción",
    resetData: "reiniciar datos de la app",
    plannerUnavailable: "El planificador no está disponible.",
    networkError: "Error de red — no se pudo contactar la fábrica.",
    qcFailed: "QC falló en: {check}",
    modules: [
      { desc: "definiciones de entidades y campos" },
      { desc: "filas demo realistas, muestras del LLM fusionadas" },
      { desc: "tarjetas count / sum / avg + desglose" },
      { desc: "tabla · tablero · calendario" },
      { desc: "modal de crear / editar registro" },
      { desc: "puerta de aprobación" },
    ],
    checks: [
      "esquema: espacio de restricciones válido",
      "campos: todos los campos tipados",
      "vistas: renderizables contra las entidades",
      "dashboard: agregaciones resolubles",
      "flujo de trabajo: existe ruta de aprobación",
      "muestras: filas del LLM con tipos verificados",
      "semilla: datos demo realistas generados",
    ],
  },

  runtime: {
    booting: "Iniciando runtime…",
    statusBreakdown: "desglose por estado",
    newEntity: "+ Nuevo {name}",
    searchPlaceholder: "Buscar {name}…",
    filterByStatus: "Filtrar {name} por estado",
    allStatuses: "todos los estados",
    rowsOf: "{n} de {total} filas",
    edit: "Editar",
    editAria: "Editar fila de {name}",
    delete: "Eliminar",
    deleteAria: "Eliminar fila de {name}",
    noMatch: "Ningún {name} coincide.",
    saveEntity: "Guardar {name}",
    cancel: "Cancelar",
    approve: "Aprobar",
    rejectAria: "Rechazar fila",
    confirmBody:
      "Control human-in-the-loop: ¿mover este {entity} de “{from}” a “{to}”?",
    undo: "Deshacer",
    dragTitle: "Arrastra a otra columna para cambiar el estado",
    today: "hoy",
    prevMonth: "Mes anterior",
    nextMonth: "Mes siguiente",
    currentMonth: "Mes actual",
    weekdays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    created: "{name} creado",
    updated: "{name} actualizado",
    deleted: "{name} eliminado",
    movedTo: "movido a {col}",
    wfApproved: "{name} aprobado",
    wfRejected: "{name} rechazado",
  },

  appPage: {
    livesInUrl: "vive en esta URL",
    buildYourOwn: "construye la tuya ↗",
    persistenceNote:
      "Los registros persisten solo en tu navegador (localStorage). Reinicia borrando los datos del sitio, o comparte la URL — toda la app está dentro del enlace.",
    noBuildTitle: "No hay construcción en esta URL",
    noBuildBodyA: "El enlace debería verse como ",
    noBuildBodyB:
      ". El blueprint puede estar malformado — vuelve a la fábrica y construye uno nuevo.",
    goFactory: "Ir a la fábrica",
  },

  qa: {
    heading: "Q&A",
    intro:
      "Respuestas directas sobre UangForge: qué hace realmente la fábrica, qué es IA frente a determinista, y de dónde salen las garantías de honestidad.",
    convinced: "¿Convencido? ",
    runBuild: "Ejecuta una construcción",
    convincedTail: " y comprueba los resultados tú mismo.",
    categories: [
      {
        id: "project",
        label: "El proyecto",
        items: [
          {
            q: "¿Qué es UangForge?",
            a: "Una obra de portafolio donde ves hacer software: eliges o describes una app pequeña de negocio, y el sitio la planifica, construye, prueba y entrega frente a ti — terminando en una app que puedes usar de inmediato y compartir por URL. Es la pieza de \"mira trabajar a la fábrica\" de una muestra en tres partes para uang.ai (\"The AI Factory\").",
          },
          {
            q: "¿Por qué existe esto?",
            a: "Porque \"software a medida construido con IA\" es fácil de afirmar y difícil de demostrar. UangLite muestra un agente operando un ERP real; UangFactory (el sitio web) prueba en lugar de contar; UangForge va hasta el final: demuestra el propio ciclo de entrega — lo que le da el nombre a uang.ai — en vivo, en el navegador, en menos de un minuto.",
          },
          {
            q: "¿Está afiliado a uang.ai?",
            a: "No. Trabajo de portafolio independiente de Rico — sin afiliación ni respaldo de uang.ai.",
          },
        ],
      },
      {
        id: "real",
        label: "Qué es IA vs. qué es real",
        items: [
          {
            q: "¿La IA realmente construye la app?",
            a: "Aquí está el desglose honesto: el LLM es el planificador — rellena un blueprint JSON estricto (entidades, campos, vistas, métricas, flujo) a partir de tu descripción. Un runtime determinista — código React común y probado — construye la app real a partir de ese blueprint. Así que sí, la app que ves está realmente construida y realmente corre; no, el modelo no escribe código arbitrario. Esa división es todo el punto.",
          },
          {
            q: "¿Por qué no dejar que el LLM escriba el código?",
            a: "Porque entonces la demo a veces funciona — y una fábrica que a veces funciona es una demo, no una fábrica. Limitar el modelo a un esquema dentro de un runtime fijo hace que cada construcción tenga éxito, cada construcción sea comprobable y nada pueda falsificarse. Es también como funciona mucha IA real en producción: el modelo aporta el juicio, la ingeniería el resto.",
          },
          {
            q: "¿Qué puede construir realmente la fábrica?",
            a: "Todo el vocabulario del runtime: hasta 2 entidades con 2–7 campos tipados, vistas de tabla/tablero/calendario, tarjetas de dashboard count/sum/avg, datos semilla, un formulario de creación y un flujo de aprobación con confirmación humana. Rastreadores de membresías, aprobaciones de vacaciones, triaje de bugs, reabastecimiento de inventario — esa clase de app. La fábrica rechaza lo que está fuera del vocabulario en lugar de fingir.",
          },
          {
            q: "¿La etapa de prueba es real?",
            a: "Sí — es la parte que la mayoría de demos similares finge. Los controles ejecutan validaciones reales contra tu blueprint: límites del esquema, todos los campos tipados, vistas resolubles contra las entidades, agregaciones resolubles, estados del flujo distintos y presentes. Un control fallido detiene la línea; el respaldo es una plantilla curada etiquetada, nunca un resultado fabricado.",
          },
          {
            q: "¿Qué pasa si no hay clave de API de LLM configurada?",
            a: "Recibes la coincidencia más cercana de la biblioteca de plantillas curadas, claramente etiquetada \"plantilla curada\". Con clave, el planificador planifica desde cualquier descripción y el resultado se etiqueta \"planificado por LLM\". Si el planificador falla la validación dos veces, recibes el respaldo curado más una nota que explica exactamente qué pasó.",
          },
        ],
      },
      {
        id: "privacy",
        label: "Privacidad y datos",
        items: [
          {
            q: "¿Dónde se guardan mis datos?",
            a: "En tu navegador. Los registros que creas persisten en localStorage bajo una clave derivada del blueprint de la app. No hay base de datos. Toda la app construida está codificada dentro de su URL, así que un enlace nunca puede filtrar datos que ingresaste después de abrirlo.",
          },
          {
            q: "¿Qué ve el LLM?",
            a: "Solo tu prompt (lo que escribiste). Ningún registro que crees en una app construida se envía a ningún lado — nunca sale de tu navegador.",
          },
        ],
      },
      {
        id: "stack",
        label: "Stack y metadatos",
        items: [
          {
            q: "¿Con qué está construido?",
            a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK con cualquier endpoint compatible con OpenAI · zod para el esquema del blueprint · un codec de URL (deflate + base64url) para que las apps vivan en enlaces · Vitest + Playwright para pruebas. Sin base de datos por diseño.",
          },
          {
            q: "¿Cómo se verificó antes de entregarse?",
            a: "La estrategia de generación se probó primero en un spike: 8/8 prompts produjeron blueprints válidos al esquema al primer intento con un modelo pequeño. Las pruebas unitarias cubren el esquema (incluidas reglas de cordura del flujo), el round-trip del codec de URL y el determinismo de la semilla. Las pruebas end-to-end de Playwright construyen una app por el teatro real, crean un registro por el formulario real, ejecutan el flujo de aprobación y abren una URL compartida.",
          },
          {
            q: "¿Puedo correr mi propia instancia?",
            a: "Sí — es open source. Configura LLM_BASE_URL / LLM_API_KEY / LLM_MODEL con cualquier endpoint compatible con OpenAI (incluido uno local). Sin ellas, la biblioteca curada sigue impulsando toda la experiencia.",
          },
        ],
      },
    ],
  },

  notFound: {
    line: "Esta página no está en el contrato.",
    back: "Volver a la fábrica",
  },

  themeToggle: {
    ariaLight: "Cambiar a modo claro",
    ariaDark: "Cambiar a modo oscuro",
    srOnly: "Cambiar tema",
  },

  apiNotes: {
    rateLimited: "Demasiadas construcciones desde esta dirección — inténtalo de nuevo en un minuto.",
    invalidJson: "JSON inválido",
    promptLength: "Describe la app en 4-200 caracteres.",
    noLlm:
      "No hay endpoint de LLM configurado — se sirvió la plantilla curada más cercana. Configura LLM_* para planificar desde cualquier descripción.",
    planFailed:
      "El planificador no pudo producir un blueprint válido para esa descripción (dos veces) — se sirvió la plantilla curada más cercana. No se entregó nada falso.",
  },
};

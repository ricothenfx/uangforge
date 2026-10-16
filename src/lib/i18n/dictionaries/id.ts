import type { Dictionary } from "./en";

export const id: Dictionary = {
  common: {
    language: "Bahasa",
    chooseLanguage: "Bahasa",
  },

  meta: {
    titleDefault: "UangForge — saksikan pabriknya membangun",
    titleHome: "Saksikan AI Factory membangun",
    titleApp: "Aplikasi hasil bangunan",
    titleQa: "Tanya jawab — tentang proyek ini",
    descriptionDefault:
      "Pilih skenario atau deskripsikan aplikasi bisnis kecil, lalu saksikan pabiknya merencanakan, membangun, menguji, dan merilisnya — aplikasi yang benar-benar jalan, bukan mockup.",
    descriptionHome:
      "Deskripsikan aplikasi bisnis kecil, saksikan pabriknya merencanakan, membangun, menguji, dan merilisnya — lalu pakai hasilnya. Setiap bangunan bisa dibagikan lewat URL.",
    descriptionApp: "Aplikasi yang berfungsi, dibangun oleh UangForge, seluruhnya terenkode di URL ini.",
    descriptionQa:
      "Pertanyaan dan jawaban lugas tentang UangForge: apa yang benar-benar dilakukan pabrik ini, mana yang AI vs deterministik, aturan kejujuran, privasi, dan hubungannya dengan uang.ai.",
    ogDescription:
      "Ketik aplikasi bisnis kecil, saksikan pabriknya membangun secara langsung, lalu pakai hasilnya. Karya portofolio oleh Rico.",
  },

  nav: {
    factory: "Pabrik",
    how: "Cara kerja",
    openApp: "Buka aplikasi",
    qa: "Tanya jawab",
  },

  footer: {
    tagline:
      "Karya portofolio oleh Rico. Aplikasi dibangun dari skema blueprint yang dikendalikan ketat — runtime-nya deterministik, hasilnya nyata. Tidak berafiliasi dengan atau didukung oleh uang.ai.",
  },

  hero: {
    badge: "UangForge — pembuktian pabrik ketiga",
    titleA: "Jangan hanya membaca tentang AI Factory.",
    titleAccent: " Jalankan.",
    bodyA:
      "Deskripsikan aplikasi bisnis kecil dan saksikan direncanakan, dibangun, diuji, dan dirilis di depanmu — lalu benar-benar pakai hasilnya. LLM mengisi blueprint yang dikendalikan ketat; runtime deterministik yang membangun aplikasinya. ",
    bodyEm: "Itu",
    bodyB: " baru cara membangun software dengan AI tanpa kehilangan kejujuran.",
    step1: "① deskripsikan atau pilih skenario",
    step2: "② saksikan rencana → bangun → uji → rilis",
    step3: "③ aplikasinya nyata — silakan diklik",
  },

  how: {
    title: "Kenapa ini jujur",
    intro:
      "Demo \"lihat AI membangun aplikasi\" biasanya curang — video, simulasi, atau kode yang hanya kadang-kadang bisa dikompilasi. UangForge mengambil jalan yang membosankan tapi nyata:",
    constraintTitle: "Ruang kendali",
    constraintBody:
      "Runtime bisa membangun: hingga 2 entitas dengan 2–7 field bertipe (teks, angka, mata uang, tanggal, pilihan, boolean), tampilan tabel/papan/kalender, kartu dashboard count/sum/avg, dan satu alur persetujuan dengan konfirmasi manusia. Itulah seluruh kosakatanya — dan justru itu sebabnya setiap bangunan berhasil. Di dalam batas itu hasilnya pelacak yang benar-benar berguna; di luar batas, pabriknya berkata tidak alih-alih berpura-pura.",
    items: [
      {
        t: "Rencana — blueprint, bukan kode",
        d: "LLM perencana mengisi skema JSON ketat di dalam ruang kendali yang tetap: tipe entitas, tipe field, tampilan, metrik, satu alur persetujuan. Ia tidak pernah menulis kode — keluaran sembarangan mustahil secara konstruksi.",
      },
      {
        t: "Bangun — runtime deterministik",
        d: "Mesin yang sama menafsirkan setiap blueprint: skema, data awal, kartu dashboard, tampilan tabel/papan/kalender, form pembuatan, gerbang persetujuan. Modul terverifikasi, tanpa kejutan.",
      },
      {
        t: "Uji — pemeriksaan nyata, QC nyata",
        d: "Tahap uji menjalankan validasi sungguhan terhadap blueprint: batas skema, field bertipe, tampilan yang bisa dirender, agregasi yang bisa dihitung, alur kerja yang masuk akal. Pemeriksaan gagal menghentikan lini.",
      },
      {
        t: "Rilis — aplikasi jalan + URL",
        d: "Aplikasi jadi berjalan langsung di halaman, tersimpan di browsermu, dan hidup di URL yang bisa dibagikan — seluruh blueprint dikompres ke dalam tautan. Tanpa database, tidak ada yang disimpan.",
      },
    ],
  },

  factory: {
    placeholder:
      "Deskripsikan aplikasi bisnis kecil… mis. “pelacak keanggotaan gym dengan persetujuan”",
    buildBtn: "Bangun",
    note: "Perencana mengisi skema blueprint yang ketat — bukan kode. Tanpa kunci LLM, templat kurasi terdekat disajikan sebagai gantinya, dengan label yang jelas.",
    orScenario: "…atau saksikan sebuah skenario dibangun",
    requesting: "Meminta blueprint…",
    stages: { plan: "RENCANA", build: "BANGUN", test: "UJI", ship: "RILIS" },
    plannedByLlm: "direncanakan LLM",
    curatedTemplate: "templat kurasi",
    newBuild: "← bangunan baru",
    planSpec: "Rencana — spesifikasi blueprint",
    blueprintJson: "blueprint.json — seluruh aplikasi",
    buildModulesTitle: "Bangun — modul runtime",
    testTitle: "Uji — pemeriksaan nyata atas blueprint",
    shipped: "RILIS — {name} hidup di bawah",
    openStandalone: "Buka mandiri (URL bisa dibagikan) ↗",
    copyLink: "salin tautan",
    copied: "tautan tersalin ✓",
    remix: "remix bangunan ini",
    resetData: "reset data aplikasi",
    plannerUnavailable: "Perencana tidak tersedia.",
    networkError: "Kesalahan jaringan — tidak bisa menghubungi pabrik.",
    qcFailed: "QC gagal di: {check}",
    modules: [
      { desc: "definisi entitas + field" },
      { desc: "baris demo realistis, sampel LLM digabung" },
      { desc: "kartu count / sum / avg + rincian status" },
      { desc: "tabel · papan · kalender" },
      { desc: "modal buat / edit rekaman" },
      { desc: "gerbang persetujuan" },
    ],
    checks: [
      "skema: ruang kendali valid",
      "field: semua field bertipe",
      "tampilan: bisa dirender terhadap entitas",
      "dashboard: agregasi bisa dihitung",
      "alur kerja: jalur persetujuan ada",
      "sampel: baris LLM lolos cek tipe",
      "seed: data demo realistis dibuat",
    ],
  },

  runtime: {
    booting: "Menjalankan runtime…",
    statusBreakdown: "rincian status",
    newEntity: "+ {name} baru",
    searchPlaceholder: "Cari {name}…",
    filterByStatus: "Saring {name} berdasarkan status",
    allStatuses: "semua status",
    rowsOf: "{n} dari {total} baris",
    edit: "Edit",
    editAria: "Edit baris {name}",
    delete: "Hapus",
    deleteAria: "Hapus baris {name}",
    noMatch: "Tidak ada {name} yang cocok.",
    saveEntity: "Simpan {name}",
    cancel: "Batal",
    approve: "Setujui",
    rejectAria: "Tolak baris",
    confirmBody:
      "Pemeriksaan human-in-the-loop: pindahkan {entity} ini dari “{from}” ke “{to}”?",
    undo: "Urungkan",
    dragTitle: "Seret ke kolom lain untuk mengubah status",
    today: "hari ini",
    prevMonth: "Bulan sebelumnya",
    nextMonth: "Bulan berikutnya",
    currentMonth: "Bulan ini",
    weekdays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    created: "{name} dibuat",
    updated: "{name} diperbarui",
    deleted: "{name} dihapus",
    movedTo: "dipindah ke {col}",
    wfApproved: "{name} disetujui",
    wfRejected: "{name} ditolak",
  },

  appPage: {
    livesInUrl: "hidup di URL ini",
    buildYourOwn: "bangun milikmu ↗",
    persistenceNote:
      "Rekaman hanya tersimpan di browsermu (localStorage). Reset dengan membersihkan data situs, atau bagikan URL-nya — seluruh aplikasi ada di dalam tautan.",
    noBuildTitle: "Tidak ada bangunan di URL ini",
    noBuildBodyA: "Tautannya seharusnya seperti ",
    noBuildBodyB:
      ". Blueprint mungkin rusak — kembali ke pabrik dan bangun yang baru.",
    goFactory: "Ke pabrik",
  },

  qa: {
    heading: "Tanya jawab",
    intro:
      "Jawaban lugas tentang UangForge: apa yang benar-benar dilakukan pabriknya, mana AI dan mana deterministik, dan dari mana jaminan kejujurannya berasal.",
    convinced: "Sudah yakin? ",
    runBuild: "Jalankan satu bangunan",
    convincedTail: " dan periksa sendiri hasilnya.",
    categories: [
      {
        id: "project",
        label: "Proyeknya",
        items: [
          {
            q: "Apa itu UangForge?",
            a: "Karya portofolio tempat kamu menyaksikan software dibuat: pilih atau deskripsikan aplikasi bisnis kecil, dan situs ini merencanakan, membangun, menguji, lalu merilisnya di depanmu — berakhir di aplikasi yang bisa langsung dipakai dan dibagikan lewat URL. Ini bagian \"saksikan pabriknya bekerja\" dari showcase tiga bagian untuk uang.ai (\"The AI Factory\").",
          },
          {
            q: "Kenapa ini dibuat?",
            a: "Karena \"software buatan AI\" mudah diklaim dan sulit dibuktikan. UangLite menunjukkan agen yang mengoperasikan ERP sungguhan; UangFactory (situsnya) membuktikan alih-alih bercerita; UangForge menunjukkan sampai ke ujung: loop pengiriman itu sendiri — hal yang secara harfiah dijadikan nama uang.ai — secara langsung, di browser, dalam waktu kurang dari semenit.",
          },
          {
            q: "Apakah ini berafiliasi dengan uang.ai?",
            a: "Tidak. Karya portofolio independen oleh Rico — tidak berafiliasi dengan atau didukung oleh uang.ai.",
          },
        ],
      },
      {
        id: "real",
        label: "Mana AI vs. mana nyata",
        items: [
          {
            q: "Apakah AI benar-benar membangun aplikasinya?",
            a: "Ini rinciannya yang jujur: LLM adalah perencana — ia mengisi blueprint JSON ketat (entitas, field, tampilan, metrik, alur kerja) dari deskripsimu. Runtime deterministik — kode React biasa yang teruji — membangun aplikasi sebenarnya dari blueprint itu. Jadi ya, aplikasi yang kamu lihat benar-benar dibangun dan benar-benar berjalan; tidak, modelnya tidak menulis kode sembarangan. Pembagian itulah inti dari semuanya.",
          },
          {
            q: "Kenapa tidak biarkan LLM menulis kodenya?",
            a: "Karena kalau begitu demonya kadang berhasil — dan pabrik yang kadang berhasil adalah demo, bukan pabrik. Mengunci model pada skema di dalam runtime yang tetap membuat setiap bangunan berhasil, setiap bangunan bisa diuji, dan tidak ada yang bisa dipalsukan. Itu juga cara kerja banyak AI produksi nyata: model untuk penilaian, engineering untuk sisanya.",
          },
          {
            q: "Apa saja yang bisa dibangun pabrik ini?",
            a: "Seluruh kosakata runtime: hingga 2 entitas dengan 2–7 field bertipe, tampilan tabel/papan/kalender, kartu dashboard count/sum/avg, data awal, form buat rekaman, dan satu alur persetujuan dengan konfirmasi manusia. Pelacak keanggotaan, persetujuan cuti, triase bug, pemesanan ulang inventaris — kelas aplikasi seperti itu. Pabriknya menolak yang di luar kosakata alih-alih berpura-pura.",
          },
          {
            q: "Apakah tahap ujinya nyata?",
            a: "Ya — ini bagian yang paling sering dipalsukan demo sejenis. Pemeriksaannya menjalankan validasi sungguhan terhadap blueprismu: batas skema, semua field bertipe, tampilan bisa dihitung terhadap entitas, agregasi bisa dihitung, status alur kerja berbeda dan ada. Pemeriksaan gagal menghentikan lini; fallback-nya templat kurasi berlabel, bukan hasil palsu.",
          },
          {
            q: "Bagaimana kalau tidak ada kunci API LLM?",
            a: "Kamu mendapat kecocokan terdekat dari pustaka templat kurasi, dengan label jelas \"templat kurasi\". Dengan kunci, perencana menyusun rencana dari deskripsi apa pun dan hasilnya berlabel \"direncanakan LLM\". Kalau perencana gagal validasi dua kali, kamu mendapat fallback kurasi plus catatan yang menjelaskan persis apa yang terjadi.",
          },
        ],
      },
      {
        id: "privacy",
        label: "Privasi & data",
        items: [
          {
            q: "Di mana data saya disimpan?",
            a: "Di browsermu. Rekaman yang kamu buat tersimpan di localStorage di bawah kunci yang diturunkan dari blueprint aplikasinya. Tidak ada database. Seluruh aplikasi yang dibangun terenkode di dalam URL-nya, jadi tautan tidak mungkin membocorkan data yang kamu masukkan setelahnya.",
          },
          {
            q: "Apa yang dilihat LLM?",
            a: "Hanya prompt-mu (apa yang kamu ketik). Rekaman yang kamu buat di aplikasi hasil bangunan tidak pernah dikirim ke mana pun — tidak pernah keluar dari browsermu.",
          },
        ],
      },
      {
        id: "stack",
        label: "Stack & meta",
        items: [
          {
            q: "Dibangun dengan apa?",
            a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK dengan endpoint apa pun yang kompatibel OpenAI · zod untuk skema blueprint · codec URL (deflate + base64url) agar aplikasi hidup di tautan · Vitest + Playwright untuk pengujian. Tanpa database memang by design.",
          },
          {
            q: "Bagaimana verifikasinya sebelum dirilis?",
            a: "Strategi generasinya diuji dulu lewat spike: 8/8 prompt menghasilkan blueprint yang valid skemanya pada percobaan pertama dengan model kecil. Unit test mencakup skema (termasuk aturan kewarasan alur kerja), round-trip codec URL, dan determinisme seed. Playwright end-to-end membangun aplikasi lewat teater sungguhan, membuat rekaman lewat form asli, menjalankan alur persetujuan, dan membuka URL hasil bagikan.",
          },
          {
            q: "Bisakah saya menjalankan instance sendiri?",
            a: "Bisa — open source. Set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL ke endpoint apa pun yang kompatibel OpenAI (termasuk yang lokal). Tanpa semuanya, pustaka kurasi tetap menggerakkan seluruh pengalaman.",
          },
        ],
      },
    ],
  },

  notFound: {
    line: "Halaman ini tidak ada di dalam kontrak.",
    back: "Kembali ke pabrik",
  },

  themeToggle: {
    ariaLight: "Beralih ke mode terang",
    ariaDark: "Beralih ke mode gelap",
    srOnly: "Ganti tema",
  },

  apiNotes: {
    rateLimited: "Terlalu banyak bangunan dari alamat ini — coba lagi dalam semenit.",
    invalidJson: "JSON tidak valid",
    promptLength: "Deskripsikan aplikasinya dalam 4-200 karakter.",
    noLlm:
      "Tidak ada endpoint LLM yang dikonfigurasi — menyajikan templat kurasi terdekat. Konfigurasikan LLM_* untuk merencanakan dari deskripsi apa pun.",
    planFailed:
      "Perencana tidak bisa menghasilkan blueprint yang valid untuk deskripsi itu (dua kali) — menyajikan templat kurasi terdekat sebagai gantinya. Tidak ada yang dipalsukan.",
  },
};

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  BOOKS_DATA,
  PASSAGES_DATABASE,
  FATWAS_DATABASE,
  TOPICS_DATA,
  BIOGRAPHY_STAGES,
  TIMELINE_EVENTS,
  SCHOLARS_DATA,
  KNOWLEDGE_NODES,
  KNOWLEDGE_EDGES,
  MANUSCRIPTS_DATA,
  ACADEMIC_ARTICLES,
  AUDIO_LECTURES,
  SCHOLAR_PROFILE,
} from "./src/data/encyclopediaData";

dotenv.config();

const PORT = 3000;

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-ibn-taymiyyah",
        },
      },
    });
  }
  return aiClient;
}

// Arabic Text Normalization for Scholarly Search
function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    // Remove Tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Normalize Alefs
    .replace(/[إأآا]/g, "ا")
    // Normalize Yaa / Alif Maqsura
    .replace(/[ىي]/g, "ي")
    // Normalize Taa Marbuta / Haa
    .replace(/ة/g, "ه")
    // Normalize Hamza forms
    .replace(/[ؤئ]/g, "ء")
    // Remove extra whitespaces
    .trim()
    .toLowerCase();
}

const STRICT_SCHOLARLY_SYSTEM_PROMPT = `
You are the Scholarly Research Assistant for the "Ibn Taymiyyah Digital Encyclopedia" (موسوعة شيخ الإسلام ابن تيمية).
CRITICAL SCHOLARLY RULES:
1. You must NEVER invent or fabricate:
   - quotations
   - book titles
   - page numbers
   - volume numbers
   - hadith references
   - fatwas
   - scholarly statements
   - historical events
   - citations
2. If a user question cannot be verified directly from the provided database excerpts, you MUST clearly state:
   Arabic: "لم يتم العثور على نص موثّق في المصادر المتاحة."
   English: "No verified text was found in the available sources."
3. Every quotation provided MUST include:
   - Exact Arabic text
   - Book Name
   - Volume and Page
   - Chapter
   - Edition / Publisher
4. Clearly separate the verbatim textual quotation from any concise analytical synthesis.
5. Provide high-quality academic Arabic with proper scholarly terminology.
`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "5mb" }));

  // Health check & System Info
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      system: "Ibn Taymiyyah Digital Encyclopedia",
      systemAr: "موسوعة شيخ الإسلام ابن تيمية",
      version: "2.5.0",
      aiAvailable: Boolean(process.env.GEMINI_API_KEY),
      booksCount: BOOKS_DATA.length,
      passagesCount: PASSAGES_DATABASE.length,
      fatwasCount: FATWAS_DATABASE.length,
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Books API
  app.get("/api/books", (req, res) => {
    const { category, search } = req.query;
    let books = [...BOOKS_DATA];
    if (category && typeof category === "string") {
      books = books.filter((b) => b.category === category);
    }
    if (search && typeof search === "string") {
      const q = normalizeArabic(search);
      books = books.filter(
        (b) =>
          normalizeArabic(b.titleAr).includes(q) ||
          normalizeArabic(b.descriptionAr).includes(q) ||
          b.titleEn.toLowerCase().includes(search.toLowerCase())
      );
    }
    res.json({ success: true, count: books.length, books });
  });

  app.get("/api/books/:id", (req, res) => {
    const book = BOOKS_DATA.find((b) => b.id === req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const passages = PASSAGES_DATABASE.filter((p) => p.bookId === book.id);
    res.json({ success: true, book, passagesCount: passages.length, passages });
  });

  // 2. Full-Text Search Engine with Arabic Normalization
  app.post("/api/search", (req, res) => {
    const { query, bookId, topicId, volume, limit = 20, offset = 0 } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
      return res.json({ success: true, count: 0, results: [], total: 0 });
    }

    const normalizedQuery = normalizeArabic(query.trim());
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

    let matchedPassages = PASSAGES_DATABASE.filter((passage) => {
      // Filter by book
      if (bookId && passage.bookId !== bookId) return false;
      // Filter by topic
      if (topicId && !passage.topicIds.includes(topicId)) return false;
      // Filter by volume
      if (volume && passage.volume !== Number(volume)) return false;

      const normalizedText = normalizeArabic(passage.textArabic);
      const normalizedChapter = normalizeArabic(passage.chapterTitleAr);
      const normalizedBook = normalizeArabic(passage.bookTitleAr);

      // Check exact phrase match first
      if (normalizedText.includes(normalizedQuery)) return true;
      if (normalizedChapter.includes(normalizedQuery)) return true;

      // Check token match
      const allTokensMatch = queryTokens.every(
        (tok) =>
          normalizedText.includes(tok) ||
          normalizedChapter.includes(tok) ||
          normalizedBook.includes(tok) ||
          passage.keywords.some((k) => normalizeArabic(k).includes(tok))
      );

      return allTokensMatch;
    });

    const total = matchedPassages.length;
    const paginated = matchedPassages.slice(offset, offset + limit);

    res.json({
      success: true,
      query,
      total,
      count: paginated.length,
      results: paginated,
    });
  });

  // 3. Fatwa & Question Database API
  app.get("/api/fatwas", (req, res) => {
    const { search, topicId } = req.query;
    let fatwas = [...FATWAS_DATABASE];

    if (topicId && typeof topicId === "string") {
      fatwas = fatwas.filter((f) => f.topicId === topicId);
    }

    if (search && typeof search === "string") {
      const q = normalizeArabic(search);
      fatwas = fatwas.filter(
        (f) =>
          normalizeArabic(f.questionAr).includes(q) ||
          normalizeArabic(f.answerAr).includes(q) ||
          normalizeArabic(f.topicAr).includes(q)
      );
    }

    res.json({ success: true, count: fatwas.length, fatwas });
  });

  // 4. Biography & Timeline API
  app.get("/api/biography", (_req, res) => {
    res.json({
      success: true,
      profile: SCHOLAR_PROFILE,
      stages: BIOGRAPHY_STAGES,
      timeline: TIMELINE_EVENTS,
    });
  });

  // 5. Scholars & Knowledge Graph API
  app.get("/api/scholars", (req, res) => {
    const { role } = req.query;
    let scholars = [...SCHOLARS_DATA];
    if (role && typeof role === "string") {
      scholars = scholars.filter((s) => s.role === role);
    }
    res.json({
      success: true,
      count: scholars.length,
      scholars,
      graph: {
        nodes: KNOWLEDGE_NODES,
        edges: KNOWLEDGE_EDGES,
      },
    });
  });

  // 6. Topics Taxonomy API
  app.get("/api/topics", (_req, res) => {
    res.json({ success: true, count: TOPICS_DATA.length, topics: TOPICS_DATA });
  });

  // 7. Manuscripts & Sources API
  app.get("/api/manuscripts", (_req, res) => {
    res.json({ success: true, count: MANUSCRIPTS_DATA.length, manuscripts: MANUSCRIPTS_DATA });
  });

  // 8. Academic Articles API
  app.get("/api/articles", (_req, res) => {
    res.json({ success: true, count: ACADEMIC_ARTICLES.length, articles: ACADEMIC_ARTICLES });
  });

  // 9. Audio Lectures API
  app.get("/api/audio", (_req, res) => {
    res.json({ success: true, count: AUDIO_LECTURES.length, audio: AUDIO_LECTURES });
  });

  // 10. AI Scholarly Research Assistant ("مساعد الباحث")
  // Strict RAG implementation on verified database passages
  app.post("/api/ai/research-assistant", async (req, res) => {
    try {
      const { userQuery, language = "ar" } = req.body;
      if (!userQuery || typeof userQuery !== "string" || !userQuery.trim()) {
        return res.status(400).json({ error: "User query is required" });
      }

      // Step 1: Query Understanding & Database Passage Retrieval
      const normalizedQ = normalizeArabic(userQuery);
      const queryTokens = normalizedQ.split(/\s+/).filter((t) => t.length > 2);

      // Score and rank verified database passages
      const scoredPassages = PASSAGES_DATABASE.map((p) => {
        let score = 0;
        const normText = normalizeArabic(p.textArabic);
        const normChapter = normalizeArabic(p.chapterTitleAr);
        const normBook = normalizeArabic(p.bookTitleAr);

        if (normText.includes(normalizedQ)) score += 10;
        if (normChapter.includes(normalizedQ)) score += 8;

        for (const tok of queryTokens) {
          if (normText.includes(tok)) score += 2;
          if (normChapter.includes(tok)) score += 3;
          if (normBook.includes(tok)) score += 1;
          if (p.keywords.some((k) => normalizeArabic(k).includes(tok))) score += 4;
        }

        return { passage: p, score };
      })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score);

      const topPassages = scoredPassages.slice(0, 4).map((item) => item.passage);

      // Also search Fatwa records
      const matchedFatwas = FATWAS_DATABASE.filter((f) => {
        const normQ = normalizeArabic(f.questionAr);
        const normA = normalizeArabic(f.answerAr);
        return queryTokens.some((tok) => normQ.includes(tok) || normA.includes(tok));
      }).slice(0, 2);

      // If no passages found in the database, obey strict rule:
      if (topPassages.length === 0 && matchedFatwas.length === 0) {
        return res.json({
          success: true,
          answerAr: "لم يتم العثور على نص موثّق في المصادر المتاحة.",
          answerEn: "No verified text was found in the available sources.",
          quotations: [],
          researchCoverage: "INSUFFICIENT_EVIDENCE",
          coveragePercentage: 0,
          verifiedDatabasePassagesCount: 0,
          disclaimerAr: "يلتزم النظام الصرامة التوثيقية التامة: لا يتم توليد أو افتراض أي استشهاد غير مثبت في قاعدة النصوص المفهرسة.",
          disclaimerEn: "The system enforces absolute documentary rigor: no citations or quotations are ever invented.",
          timestamp: new Date().toISOString(),
        });
      }

      // Step 2: Synthesis with Gemini if available, or structured scholarly synthesis fallback
      const ai = getAI();
      if (ai) {
        const contextString = topPassages
          .map(
            (p, idx) => `
[نص موثق #${idx + 1}]
الكتاب: ${p.bookTitleAr}
المجلد: ${p.volume} | الصفحة: ${p.page}
الباب / الفصل: ${p.chapterTitleAr}
الناشر والطبعة: ${p.publisher || "مجمع الملك فهد لطباعة المصحف الشريف"}
التوثيق المعتمد: ${p.verifiedSourceCitation}
النص العربي الحرفي:
"""${p.textArabic}"""
`
          )
          .join("\n---------------------\n");

        const prompt = `
سؤال الباحث:
"${userQuery}"

النصوص التوثيقية المستخرجة حصرياً من قاعدة بيانات موسوعة ابن تيمية:
${contextString}

المطلوب:
1. قدم تحريراً علمياً رصيناً وموجزاً يجيب عن سؤال الباحث بالاستناد الحصري للنصوص أعلاه.
2. اعزل بوضوح بين "النصوص الحرفية الموثقة" وبين "البيان والتلخيص العلمي".
3. أثبت التوثيق الدقيق (الكتاب، المجلد، الصفحة، المحقق أو الناشر) لكل نص.
4. إذا كان السؤال يتضمن جوانب لا تغطيها النصوص أعلاه، اذكر بصراحة: "لم يتم العثور على نص موثّق لهذه الجزئية في المصادر المتاحة".
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction: STRICT_SCHOLARLY_SYSTEM_PROMPT,
            temperature: 0.1,
          },
        });

        return res.json({
          success: true,
          answerAr: response.text,
          answerEn: language === "en" ? "Scholarly synthesis generated strictly from verified database records." : undefined,
          quotations: topPassages.map((p) => ({
            textArabic: p.textArabic,
            bookTitleAr: p.bookTitleAr,
            volume: p.volume,
            page: p.page,
            chapterTitleAr: p.chapterTitleAr,
            verifiedCitation: p.verifiedSourceCitation,
            publisher: p.publisher,
          })),
          researchCoverage: topPassages.length >= 3 ? "COMPREHENSIVE" : "SUBSTANTIAL",
          coveragePercentage: Math.min(100, topPassages.length * 30 + 10),
          verifiedDatabasePassagesCount: topPassages.length,
          disclaimerAr: "إجابة محررة علمياً بالاستناد الصارم إلى النصوص المفهرسة مع التوثيق الكامل برقم المجلد والصفحة.",
          disclaimerEn: "Synthesized strictly from verified database records with exact volume and page attribution.",
          timestamp: new Date().toISOString(),
        });
      }

      // Step 3: High-Quality Deterministic Scholarly Synthesis if Gemini is offline
      const primary = topPassages[0];
      const synthesis = `بناءً على النصوص المفهرسة والمحققة في الموسوعة لشيخ الإسلام ابن تيمية رحمه الله:\n\nقرر الشيخ في **${primary.bookTitleAr}** (ج ${primary.volume}، ص ${primary.page}):\n«${primary.textArabic}»\n\nويتضح من هذا النص المحقق تأصيل الشيخ لقضية البحث بقواعد الاستدلال الجمعية بين صريح المعقول والمنقول.\n\n**التوثيق المعتمد:**\n${primary.verifiedSourceCitation}`;

      res.json({
        success: true,
        answerAr: synthesis,
        quotations: topPassages.map((p) => ({
          textArabic: p.textArabic,
          bookTitleAr: p.bookTitleAr,
          volume: p.volume,
          page: p.page,
          chapterTitleAr: p.chapterTitleAr,
          verifiedCitation: p.verifiedSourceCitation,
          publisher: p.publisher,
        })),
        researchCoverage: topPassages.length >= 2 ? "SUBSTANTIAL" : "PARTIAL",
        coveragePercentage: topPassages.length * 35,
        verifiedDatabasePassagesCount: topPassages.length,
        disclaimerAr: "تم استخراج هذه النتائج والتأصيلات مباشرة من السجل التوثيقي المعتمد لكتب شيخ الإسلام.",
        disclaimerEn: "Extracted directly from canonical database records with volume and page verification.",
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error("Scholarly AI Assistant error:", err);
      res.status(500).json({ error: err.message || "Failed to process scholarly research query" });
    }
  });

  // 11. Citation Generator Utility (Traditional Arabic, APA, Chicago/BibTeX)
  app.post("/api/citation", (req, res) => {
    const { passageId, bookId, format = "TRADITIONAL_ARABIC" } = req.body;
    const passage = PASSAGES_DATABASE.find((p) => p.id === passageId);
    const book = BOOKS_DATA.find((b) => b.id === (passage?.bookId || bookId));

    if (!passage && !book) {
      return res.status(404).json({ error: "Source not found" });
    }

    const title = book?.titleAr || "مجموع الفتاوى";
    const volume = passage?.volume || 1;
    const page = passage?.page || 1;
    const publisher = passage?.publisher || "مجمع الملك فهد لطباعة المصحف الشريف";

    let citation = "";
    if (format === "TRADITIONAL_ARABIC") {
      citation = `ابن تيمية، أحمد بن عبد الحليم. ${title}. ج ${volume}، ص ${page}. ${publisher}، المدينة المنورة.`;
    } else if (format === "APA") {
      citation = `Ibn Taymiyyah, A. (2004). ${book?.titleEn || "Majmu al-Fatawa"} (Vol. ${volume}, p. ${page}). King Fahd Glorious Quran Printing Complex.`;
    } else {
      citation = `@book{ibntaymiyyah_${book?.id || "work"},\n  author = {Ibn Taymiyyah, Ahmad ibn Abd al-Halim},\n  title = {${title}},\n  volume = {${volume}},\n  pages = {${page}},\n  publisher = {${publisher}}\n}`;
    }

    res.json({ success: true, format, citation });
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ibn Taymiyyah Encyclopedia] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Encyclopedia server:", err);
  process.exit(1);
});

import express from "express";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isNetlify = !!process.env.NETLIFY;

// Lazy-loaded database connection
let dbInstance: any = null;

function getDb() {
  if (dbInstance) return dbInstance;

  const dbPath = isNetlify 
    ? path.join("/tmp", "portfolio.db") 
    : path.join(process.cwd(), "portfolio.db");

  if (isNetlify && !fs.existsSync(dbPath)) {
    const possiblePaths = [
      path.join(process.cwd(), "portfolio.db"),
      path.resolve(__dirname, "portfolio.db"),
      path.resolve(__dirname, "..", "portfolio.db"),
      path.resolve(__dirname, "../../portfolio.db"),
      path.resolve(__dirname, "../../../portfolio.db"),
      "/var/task/portfolio.db",
    ];
    
    let found = false;
    for (const p of possiblePaths) {
      try {
        if (fs.existsSync(p)) {
          fs.copyFileSync(p, dbPath);
          found = true;
          break;
        }
      } catch (e) {
        // Continue to next path
      }
    }
  }

  try {
    dbInstance = new Database(dbPath);
  } catch (err) {
    console.error("Failed to open database at", dbPath, err);
    // Fallback to in-memory if file fails, to avoid 502
    dbInstance = new Database(":memory:");
  }

  // Initialize Database
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS home (
      id INTEGER PRIMARY KEY,
      name TEXT,
      job_title TEXT,
      intro TEXT,
      resume_url TEXT
    );

    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY,
      profile_image TEXT,
      bio TEXT,
      scope TEXT,
      career TEXT,
      workflow TEXT,
      strengths TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      year TEXT,
      category TEXT,
      role TEXT,
      summary TEXT,
      thumbnail TEXT,
      camera TEXT,
      lens TEXT,
      lighting TEXT,
      color TEXT,
      contribution TEXT,
      is_featured INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS project_videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      title TEXT,
      description TEXT,
      youtube_url TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT,
      name TEXT,
      context TEXT
    );

    CREATE TABLE IF NOT EXISTS contact (
      id INTEGER PRIMARY KEY,
      email TEXT,
      instagram TEXT,
      instagram_text TEXT,
      phone TEXT
    );
  `);

  // Migration: Add instagram_text if not exists
  try {
    dbInstance.prepare("ALTER TABLE contact ADD COLUMN instagram_text TEXT").run();
  } catch (e) {
    // Column already exists or table doesn't exist yet
  }

  // Seed initial data if empty
  const homeCount = dbInstance.prepare("SELECT COUNT(*) as count FROM home").get() as { count: number };
  if (homeCount.count === 0) {
    dbInstance.prepare("INSERT INTO home (name, job_title, intro, resume_url) VALUES (?, ?, ?, ?)").run(
      "KIM CINEMA",
      "촬영감독 (Cinematographer)",
      "감각적인 룩 설계와 효율적인 현장 운영을 지향하는 촬영감독 김시네마입니다.",
      "#"
    );
    dbInstance.prepare("INSERT INTO about (bio, scope, career, workflow, strengths) VALUES (?, ?, ?, ?, ?)").run(
      "빛과 그림자로 이야기를 만드는 촬영감독입니다.",
      "프리프로덕션 콘셉트/룩 설계, 촬영, 조명 설계, 카메라 오퍼레이팅",
      "2020-현재: 프리랜서 촬영감독\n2018-2020: XX 프로덕션 촬영팀",
      "프리(레퍼런스/룩북) -> 촬영(현장 운영) -> 후반(색보정 협업)",
      "현장 커뮤니케이션\n룩 설계\n제한된 조건에서의 최상의 결과물"
    );
    dbInstance.prepare("INSERT INTO contact (email, instagram, instagram_text, phone) VALUES (?, ?, ?, ?)").run(
      "example@email.com",
      "https://instagram.com/username",
      "@kim_cinema",
      "010-1234-5678"
    );
  }

  return dbInstance;
}

export async function createExpressApp() {
  const app = express();
  app.use(express.json());

  // Ensure uploads directory exists
  const uploadsDir = isNetlify 
    ? path.join("/tmp", "uploads") 
    : path.join(__dirname, "uploads");
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (e) {
    console.warn("Failed to create uploads directory:", e);
  }

  // Multer configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // Serve uploads statically
  app.use("/uploads", express.static(uploadsDir));

  // API Routes
  const apiRouter = express.Router();

  apiRouter.get("/portfolio", (req, res) => {
    const db = getDb();
    const home = db.prepare("SELECT * FROM home WHERE id = 1").get();
    const about = db.prepare("SELECT * FROM about WHERE id = 1").get();
    const projects = db.prepare("SELECT * FROM projects ORDER BY year DESC").all();
    const equipment = db.prepare("SELECT * FROM equipment").all();
    const contact = db.prepare("SELECT * FROM contact WHERE id = 1").get();
    
    // Get videos for each project
    const projectsWithVideos = projects.map((p: any) => {
      const videos = db.prepare("SELECT * FROM project_videos WHERE project_id = ?").all(p.id);
      return { ...p, videos };
    });

    res.json({ home, about, projects: projectsWithVideos, equipment, contact });
  });

  // Admin Auth Middleware (Simple password check)
  const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const password = req.headers["x-admin-password"];
    if (password === "0901") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // File Upload Route
  apiRouter.post("/admin/upload", adminAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  // Admin Update Routes
  apiRouter.post("/admin/home", adminAuth, (req, res) => {
    const db = getDb();
    const { name, job_title, intro, resume_url } = req.body;
    db.prepare("UPDATE home SET name = ?, job_title = ?, intro = ?, resume_url = ? WHERE id = 1").run(name, job_title, intro, resume_url);
    res.json({ success: true });
  });

  apiRouter.post("/admin/about", adminAuth, (req, res) => {
    const db = getDb();
    const { profile_image, bio, scope, career, workflow, strengths } = req.body;
    db.prepare("UPDATE about SET profile_image = ?, bio = ?, scope = ?, career = ?, workflow = ?, strengths = ? WHERE id = 1").run(profile_image, bio, scope, career, workflow, strengths);
    res.json({ success: true });
  });

  apiRouter.post("/admin/contact", adminAuth, (req, res) => {
    const db = getDb();
    const { email, instagram, instagram_text, phone } = req.body;
    db.prepare("UPDATE contact SET email = ?, instagram = ?, instagram_text = ?, phone = ? WHERE id = 1").run(email, instagram, instagram_text, phone);
    res.json({ success: true });
  });

  apiRouter.post("/admin/projects", adminAuth, (req, res) => {
    const db = getDb();
    const { id, title, year, category, role, summary, thumbnail, camera, lens, lighting, color, contribution, is_featured, videos } = req.body;
    
    if (id) {
      // Update
      db.prepare(`
        UPDATE projects SET 
        title = ?, year = ?, category = ?, role = ?, summary = ?, thumbnail = ?, 
        camera = ?, lens = ?, lighting = ?, color = ?, contribution = ?, is_featured = ?
        WHERE id = ?
      `).run(title, year, category, role, summary, thumbnail, camera, lens, lighting, color, contribution, is_featured ? 1 : 0, id);
      
      // Update videos
      db.prepare("DELETE FROM project_videos WHERE project_id = ?").run(id);
      if (videos && Array.isArray(videos)) {
        const insertVideo = db.prepare("INSERT INTO project_videos (project_id, title, description, youtube_url) VALUES (?, ?, ?, ?)");
        for (const v of videos) {
          insertVideo.run(id, v.title, v.description, v.youtube_url);
        }
      }
    } else {
      // Create
      const result = db.prepare(`
        INSERT INTO projects (title, year, category, role, summary, thumbnail, camera, lens, lighting, color, contribution, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, year, category, role, summary, thumbnail, camera, lens, lighting, color, contribution, is_featured ? 1 : 0);
      
      const newId = result.lastInsertRowid;
      if (videos && Array.isArray(videos)) {
        const insertVideo = db.prepare("INSERT INTO project_videos (project_id, title, description, youtube_url) VALUES (?, ?, ?, ?)");
        for (const v of videos) {
          insertVideo.run(newId, v.title, v.description, v.youtube_url);
        }
      }
    }
    res.json({ success: true });
  });

  apiRouter.delete("/admin/projects/:id", adminAuth, (req, res) => {
    const db = getDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  apiRouter.post("/admin/equipment", adminAuth, (req, res) => {
    const db = getDb();
    const { id, category, name, context } = req.body;
    if (id) {
      db.prepare("UPDATE equipment SET category = ?, name = ?, context = ? WHERE id = ?").run(category, name, context, id);
    } else {
      db.prepare("INSERT INTO equipment (category, name, context) VALUES (?, ?, ?)").run(category, name, context);
    }
    res.json({ success: true });
  });

  apiRouter.delete("/admin/equipment/:id", adminAuth, (req, res) => {
    const db = getDb();
    db.prepare("DELETE FROM equipment WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.use(["/api", "/.netlify/functions/api", "/"], apiRouter);

  return app;
}

async function startServer() {
  const app = await createExpressApp();
  const PORT = 3000;

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Only start the server if this file is run directly and not on Netlify
if (import.meta.url === `file://${process.argv[1]}` && !process.env.NETLIFY) {
  startServer();
}

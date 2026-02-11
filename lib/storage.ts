import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "storage");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- Users ---
export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: "admin" | "editor";
  createdAt: string;
}

const USERS_FILE = path.join(DATA_DIR, "users.json");

export function getUsers(): AdminUser[] {
  return readJsonFile<AdminUser[]>(USERS_FILE, []);
}

export function saveUsers(users: AdminUser[]) {
  writeJsonFile(USERS_FILE, users);
}

export function findUserByUsername(username: string): AdminUser | undefined {
  return getUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

// --- Content ---
export interface ContentPost {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  files: ContentFile[];
  pinned: boolean;
  tags: string[];
}

export interface ContentFile {
  id: string;
  name: string;
  originalName: string;
  type: "image" | "audio" | "video" | "document" | "other";
  mimeType: string;
  size: number;
  path: string;
}

const CONTENT_FILE = path.join(DATA_DIR, "content.json");

export function getContent(): ContentPost[] {
  return readJsonFile<ContentPost[]>(CONTENT_FILE, []);
}

export function saveContent(content: ContentPost[]) {
  writeJsonFile(CONTENT_FILE, content);
}

export function getContentById(id: string): ContentPost | undefined {
  return getContent().find((c) => c.id === id);
}

export function deleteContentById(id: string): boolean {
  const content = getContent();
  const post = content.find((c) => c.id === id);
  if (!post) return false;

  // Delete associated files
  for (const file of post.files) {
    const filePath = path.join(process.cwd(), "public", file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  const updated = content.filter((c) => c.id !== id);
  saveContent(updated);
  return true;
}

// --- Notifications ---
export interface Notification {
  id: string;
  type: "new_content" | "update_content" | "delete_content";
  title: string;
  message: string;
  contentId?: string;
  createdAt: string;
}

const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");

export function getNotifications(): Notification[] {
  return readJsonFile<Notification[]>(NOTIFICATIONS_FILE, []);
}

export function saveNotifications(notifications: Notification[]) {
  writeJsonFile(NOTIFICATIONS_FILE, notifications);
}

export function addNotification(
  notification: Omit<Notification, "id" | "createdAt">
) {
  const notifications = getNotifications();
  const newNotification: Notification = {
    ...notification,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(newNotification);
  // Keep only last 50 notifications
  if (notifications.length > 50) notifications.length = 50;
  saveNotifications(notifications);
  return newNotification;
}

// --- File Uploads ---
export function getUploadsDir() {
  ensureDir(UPLOADS_DIR);
  return UPLOADS_DIR;
}

export function getFileType(
  mimeType: string
): "image" | "audio" | "video" | "document" | "other" {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (
    mimeType.startsWith("application/pdf") ||
    mimeType.startsWith("text/") ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation")
  )
    return "document";
  return "other";
}

// --- Sessions ---
export interface Session {
  token: string;
  userId: string;
  username: string;
  role: string;
  expiresAt: string;
}

const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

export function getSessions(): Session[] {
  const sessions = readJsonFile<Session[]>(SESSIONS_FILE, []);
  // Clean expired sessions
  const now = new Date().toISOString();
  const valid = sessions.filter((s) => s.expiresAt > now);
  if (valid.length !== sessions.length) {
    saveSessions(valid);
  }
  return valid;
}

export function saveSessions(sessions: Session[]) {
  writeJsonFile(SESSIONS_FILE, sessions);
}

export function findSession(token: string): Session | undefined {
  return getSessions().find(
    (s) => s.token === token && s.expiresAt > new Date().toISOString()
  );
}

export function createSession(user: AdminUser): Session {
  const sessions = getSessions();
  const session: Session = {
    token: crypto.randomUUID(),
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
  };
  sessions.push(session);
  saveSessions(sessions);
  return session;
}

export function deleteSession(token: string) {
  const sessions = getSessions().filter((s) => s.token !== token);
  saveSessions(sessions);
}

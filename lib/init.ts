import bcrypt from "bcryptjs";
import { getUsers, saveUsers, type AdminUser } from "./storage";

export async function initializeDefaultAdmin() {
  const users = getUsers();
  if (users.length === 0) {
    const hash = await bcrypt.hash("bAyHaCk", 12);
    const defaultAdmin: AdminUser = {
      id: crypto.randomUUID(),
      username: "bAyHaCk",
      passwordHash: hash,
      role: "admin",
      createdAt: new Date().toISOString(),
    };
    saveUsers([defaultAdmin]);
  }
}

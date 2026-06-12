"use client";
// 用户系统 — localStorage 持久化，无需后端
// 密码使用 SHA-256 + 随机盐哈希存储，不存明文
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { hashPassword, verifyPassword } from "@/lib/crypto";

export interface UserProfile {
  name: string;
  /** 当前会话中的明文密码（仅内存，不持久化到 localStorage） */
  password: string;
  avatar: string;
  level: "beginner" | "intermediate" | "advanced";
  weight: number;
  height: number;
  age: number;
  goal: string;
  joinedAt: string;
}

/** 存储在 USERS_KEY 中的用户记录（密码为哈希值） */
interface StoredUser {
  passwordHash: string;
  avatar: string;
  level: string;
  joinedAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  /** 注册/登录（内部自动哈希密码） */
  login: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getUserDataKey: () => string;
  /** 查找用户是否存在（不返回密码） */
  findUser: (name: string) => { avatar: string } | null;
  /** 验证用户密码是否正确 */
  verifyUser: (name: string, password: string) => Promise<boolean>;
}

const STORAGE_KEY = "bouncelab_user";
const USERS_KEY = "bouncelab_users"; // 存储所有注册用户

const DEFAULT_USER: UserProfile = {
  name: "",
  password: "",
  avatar: "🏀",
  level: "intermediate",
  weight: 70,
  height: 175,
  age: 22,
  goal: "提升垂直弹跳",
  joinedAt: new Date().toISOString(),
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "入门",
  intermediate: "中级",
  advanced: "高级",
};

const UserContext = createContext<UserContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  updateProfile: () => {},
  getUserDataKey: () => "",
  findUser: () => null,
  verifyUser: async () => false,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!mounted) return;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, mounted]);

  const login = useCallback(async (profile: Partial<UserProfile>) => {
    const plainPassword = profile.password || "";
    const passwordHash = plainPassword ? await hashPassword(plainPassword) : "";

    const newUser: UserProfile = {
      ...DEFAULT_USER,
      ...profile,
      joinedAt: new Date().toISOString(),
    };
    // 保存到用户列表（密码以哈希存储）
    try {
      const users: Record<string, StoredUser> = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      users[newUser.name] = {
        passwordHash,
        avatar: newUser.avatar,
        level: newUser.level,
        joinedAt: newUser.joinedAt,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
    // 会话中保留明文密码（仅内存），不写 localStorage
    setUser(newUser);
    const { password: _, ...sessionUser } = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...sessionUser, _pwHash: passwordHash }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const getUserDataKey = useCallback(() => {
    if (!user) return "";
    // 使用用户名 + 密码哈希后 8 位作为稳定标识
    try {
      const session = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const hash = session._pwHash || "";
      return `bouncelab_${user.name}_${hash.slice(-8)}_`;
    } catch {
      return `bouncelab_${user.name}_`;
    }
  }, [user]);

  const findUser = useCallback((name: string) => {
    try {
      const users: Record<string, StoredUser> = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      const u = users[name];
      return u ? { avatar: u.avatar } : null;
    } catch { return null; }
  }, []);

  const verifyUser = useCallback(async (name: string, password: string): Promise<boolean> => {
    try {
      const users: Record<string, StoredUser> = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      const u = users[name];
      if (!u || !u.passwordHash) return false;
      return await verifyPassword(password, u.passwordHash);
    } catch { return false; }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile, getUserDataKey, findUser, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export { LEVEL_LABELS };

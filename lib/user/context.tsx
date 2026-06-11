"use client";
// 用户系统 — localStorage 持久化，无需后端
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface UserProfile {
  name: string;
  password: string;
  avatar: string;
  level: "beginner" | "intermediate" | "advanced";
  weight: number;
  height: number;
  age: number;
  goal: string;
  joinedAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getUserDataKey: () => string;
  findUser: (name: string) => { password: string; avatar: string } | null;
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
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  getUserDataKey: () => "",
  findUser: () => null,
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

  const login = useCallback((profile: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      ...profile,
      joinedAt: new Date().toISOString(),
    };
    // 保存到用户列表
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      users[newUser.name] = { password: newUser.password, avatar: newUser.avatar, level: newUser.level, joinedAt: newUser.joinedAt };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {}
    // 移除密码后才存 session
    const { password: _, ...sessionUser } = newUser;
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const getUserDataKey = useCallback(() => {
    if (!user) return "";
    return `bouncelab_${user.name}_${user.password}_`;
  }, [user]);

  const findUser = useCallback((name: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      return users[name] || null;
    } catch { return null; }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile, getUserDataKey, findUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export { LEVEL_LABELS };

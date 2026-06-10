"use client";
// 用户系统 — localStorage 持久化，无需后端
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface UserProfile {
  name: string;
  avatar: string; // emoji
  level: "beginner" | "intermediate" | "advanced";
  weight: number; // kg
  height: number; // cm
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
}

const STORAGE_KEY = "bouncelab_user";

const DEFAULT_USER: UserProfile = {
  name: "",
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
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export { LEVEL_LABELS };

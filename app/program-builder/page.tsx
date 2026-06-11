"use client";
// 训练组装器 — 从动作库挑选动作，组装完整训练日计划
import { useState, useReducer, useEffect, useCallback } from "react";
import { CATEGORIES, EXERCISES, type Exercise } from "@/lib/exercises/data";

// ================================================================
// Types
// ================================================================
type PlanPhase = "warmup" | "main" | "accessory" | "cooldown";
const PHASE_LABELS: Record<PlanPhase, { label: string; icon: string; desc: string }> = {
  warmup: { label: "热身激活", icon: "🔥", desc: "动态拉伸、激活、低强度准备" },
  main: { label: "主训练", icon: "💪", desc: "核心力量/增强式/速度训练" },
  accessory: { label: "辅助训练", icon: "🔧", desc: "核心、上肢、预康复补充" },
  cooldown: { label: "整理放松", icon: "🧘", desc: "拉伸、泡沫轴、恢复" },
};

interface PlanExercise {
  uid: string; // unique id for this plan entry
  exerciseId: string;
  sets: number;
  reps: string; // e.g. "3-5" or "8-10" or "30s"
  restSec: number;
  note: string;
  phase: PlanPhase;
}

interface SavedPlan {
  id: string;
  name: string;
  createdAt: string;
  exercises: PlanExercise[];
}

type PlanAction =
  | { type: "ADD_EXERCISE"; exerciseId: string; phase: PlanPhase }
  | { type: "REMOVE_EXERCISE"; uid: string }
  | { type: "UPDATE_EXERCISE"; uid: string; field: "sets" | "reps" | "restSec" | "note" | "phase"; value: string | number }
  | { type: "MOVE_EXERCISE"; uid: string; direction: "up" | "down" }
  | { type: "LOAD_PLAN"; exercises: PlanExercise[] }
  | { type: "CLEAR_PLAN" };

function planReducer(state: PlanExercise[], action: PlanAction): PlanExercise[] {
  switch (action.type) {
    case "ADD_EXERCISE": {
      const ex = EXERCISES.find(e => e.id === action.exerciseId);
      if (!ex) return state;
      // Parse default sets/reps from exercise data
      const defaultSetsReps = ex.setsReps.split("\n")[0]; // take first line
      const setsMatch = defaultSetsReps.match(/(\d+)-?(\d+)?\s*组/);
      const repsMatch = defaultSetsReps.match(/[×x]\s*(\d+[-~]?\d*\s*次?)/);
      const sets = setsMatch ? parseInt(setsMatch[2] || setsMatch[1]) : 3;
      const reps = repsMatch ? repsMatch[1].replace(/次/g, "").trim() : "8-10";
      return [...state, {
        uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        exerciseId: ex.id,
        sets,
        reps,
        restSec: ex.category === "plyometrics" || ex.category === "olympic_lifts" ? 180 : 90,
        note: "",
        phase: action.phase,
      }];
    }
    case "REMOVE_EXERCISE":
      return state.filter(e => e.uid !== action.uid);
    case "UPDATE_EXERCISE":
      return state.map(e => e.uid === action.uid ? { ...e, [action.field]: action.value } : e);
    case "MOVE_EXERCISE": {
      const idx = state.findIndex(e => e.uid === action.uid);
      if (idx < 0) return state;
      const newIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.length) return state;
      const next = [...state];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    }
    case "LOAD_PLAN":
      return action.exercises;
    case "CLEAR_PLAN":
      return [];
    default:
      return state;
  }
}

// ================================================================
// Pre-built Templates
// ================================================================
interface Template {
  name: string;
  icon: string;
  desc: string;
  exercises: { exerciseId: string; phase: PlanPhase; sets: number; reps: string; restSec: number; note: string }[];
}
const TEMPLATES: Template[] = [
  // ══════ 力量日（6种） ══════
  {
    name: "力量日 · 初级 · 无器械", icon: "💪", desc: "自重力量入门",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "12", restSec: 60, note: "可用水瓶替代" },
      { exerciseId: "bodyweight-squat", phase: "main", sets: 3, reps: "15-20", restSec: 90, note: "全幅度" },
      { exerciseId: "walking-lunge", phase: "main", sets: 3, reps: "12/侧", restSec: 90, note: "自重" },
      { exerciseId: "single-leg-glute-bridge", phase: "main", sets: 3, reps: "12/侧", restSec: 60, note: "臀肌" },
      { exerciseId: "calf-raise", phase: "accessory", sets: 3, reps: "20", restSec: 60, note: "自重" },
      { exerciseId: "plank", phase: "accessory", sets: 3, reps: "45s", restSec: 45, note: "" },
    ],
  },
  {
    name: "力量日 · 初级 · 有器械", icon: "💪", desc: "杠铃哑铃入门",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "10", restSec: 60, note: "轻负荷激活" },
      { exerciseId: "back-squat", phase: "main", sets: 4, reps: "8-10", restSec: 120, note: "65-75% 1RM" },
      { exerciseId: "romanian-deadlift", phase: "main", sets: 3, reps: "10", restSec: 90, note: "60-70% 1RM" },
      { exerciseId: "hip-thrust", phase: "main", sets: 3, reps: "10", restSec: 90, note: "顶峰收缩" },
      { exerciseId: "calf-raise", phase: "accessory", sets: 3, reps: "15", restSec: 60, note: "慢离心" },
      { exerciseId: "pallof-press", phase: "accessory", sets: 3, reps: "10/侧", restSec: 60, note: "" },
    ],
  },
  {
    name: "力量日 · 中级 · 无器械", icon: "💪", desc: "进阶自重+单腿",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "15", restSec: 45, note: "激活" },
      { exerciseId: "bulgarian-split-squat", phase: "main", sets: 3, reps: "10/侧", restSec: 90, note: "可背包加重" },
      { exerciseId: "single-leg-rdl", phase: "main", sets: 3, reps: "10/侧", restSec: 90, note: "控制" },
      { exerciseId: "jump-squat", phase: "main", sets: 4, reps: "6", restSec: 120, note: "自重爆发" },
      { exerciseId: "single-leg-calf-raise", phase: "accessory", sets: 3, reps: "15/侧", restSec: 60, note: "" },
      { exerciseId: "side-plank", phase: "accessory", sets: 3, reps: "30s/侧", restSec: 45, note: "" },
    ],
  },
  {
    name: "力量日 · 中级 · 有器械", icon: "💪", desc: "杠铃进阶，力量储备期",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "10", restSec: 60, note: "" },
      { exerciseId: "back-squat", phase: "main", sets: 4, reps: "4-6", restSec: 150, note: "80-90% 1RM" },
      { exerciseId: "deadlift", phase: "main", sets: 3, reps: "5", restSec: 150, note: "80-90% 1RM" },
      { exerciseId: "bulgarian-split-squat", phase: "accessory", sets: 3, reps: "8/侧", restSec: 90, note: "注重弱侧" },
      { exerciseId: "hip-thrust", phase: "accessory", sets: 3, reps: "10", restSec: 90, note: "顶峰收缩" },
      { exerciseId: "calf-raise", phase: "accessory", sets: 3, reps: "15", restSec: 60, note: "慢离心" },
    ],
  },
  {
    name: "力量日 · 高级 · 无器械", icon: "💪", desc: "极限自重+单腿爆发",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 45, note: "" },
      { exerciseId: "pistol-squat", phase: "main", sets: 4, reps: "6-8/侧", restSec: 120, note: "全幅度单腿" },
      { exerciseId: "single-leg-rdl", phase: "main", sets: 3, reps: "8/侧", restSec: 90, note: "慢离心3s" },
      { exerciseId: "jump-squat", phase: "main", sets: 4, reps: "8", restSec: 120, note: "最大高度" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 3, reps: "5/腿", restSec: 120, note: "" },
      { exerciseId: "ab-wheel-rollout", phase: "accessory", sets: 3, reps: "10", restSec: 60, note: "" },
    ],
  },
  {
    name: "力量日 · 高级 · 有器械", icon: "💪", desc: "大负荷力量巅峰期",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "8", restSec: 60, note: "" },
      { exerciseId: "back-squat", phase: "main", sets: 5, reps: "3-5", restSec: 180, note: "85-95% 1RM" },
      { exerciseId: "deadlift", phase: "main", sets: 4, reps: "3-5", restSec: 180, note: "85-95% 1RM" },
      { exerciseId: "front-squat", phase: "main", sets: 3, reps: "4-6", restSec: 150, note: "75-85% 1RM" },
      { exerciseId: "hip-thrust", phase: "accessory", sets: 4, reps: "8", restSec: 90, note: "80-90% 1RM" },
      { exerciseId: "pallof-press", phase: "accessory", sets: 3, reps: "8/侧", restSec: 60, note: "" },
    ],
  },
  // ══════ 增强式爆发日（6种） ══════
  {
    name: "增强式 · 初级 · 无器械", icon: "⚡", desc: "入门低冲击跳跃",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 45, note: "激活" },
      { exerciseId: "box-jump", phase: "main", sets: 3, reps: "5", restSec: 120, note: "低箱30cm" },
      { exerciseId: "broad-jump", phase: "main", sets: 3, reps: "5", restSec: 90, note: "落地稳定" },
      { exerciseId: "tuck-jump", phase: "main", sets: 3, reps: "6", restSec: 90, note: "连续" },
      { exerciseId: "single-leg-glute-bridge", phase: "accessory", sets: 3, reps: "12/侧", restSec: 60, note: "" },
      { exerciseId: "pigeon-stretch", phase: "cooldown", sets: 1, reps: "60s/侧", restSec: 0, note: "" },
    ],
  },
  {
    name: "增强式 · 初级 · 有器械", icon: "⚡", desc: "轻器械+跳跃入门",
    exercises: [
      { exerciseId: "a-skip", phase: "warmup", sets: 2, reps: "15m", restSec: 45, note: "" },
      { exerciseId: "box-jump", phase: "main", sets: 4, reps: "5", restSec: 120, note: "45-60cm箱" },
      { exerciseId: "broad-jump", phase: "main", sets: 4, reps: "4", restSec: 120, note: "" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "6栏", restSec: 120, note: "低栏30cm" },
      { exerciseId: "med-ball-slam", phase: "main", sets: 3, reps: "8", restSec: 90, note: "4-6kg药球" },
      { exerciseId: "pallof-press", phase: "accessory", sets: 3, reps: "10/侧", restSec: 60, note: "" },
    ],
  },
  {
    name: "增强式 · 中级 · 无器械", icon: "⚡", desc: "中等强度增强式",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 60, note: "激活跟腱" },
      { exerciseId: "a-skip", phase: "warmup", sets: 2, reps: "20m", restSec: 45, note: "跑姿激活" },
      { exerciseId: "box-jump", phase: "main", sets: 4, reps: "5", restSec: 150, note: "最大爆发力" },
      { exerciseId: "broad-jump", phase: "main", sets: 4, reps: "4", restSec: 120, note: "" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "6栏", restSec: 120, note: "中栏45cm" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 3, reps: "5/腿", restSec: 120, note: "" },
      { exerciseId: "pigeon-stretch", phase: "cooldown", sets: 1, reps: "60s/侧", restSec: 0, note: "" },
    ],
  },
  {
    name: "增强式 · 中级 · 有器械", icon: "⚡", desc: "爆发力转化期",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 60, note: "激活跟腱" },
      { exerciseId: "box-jump", phase: "main", sets: 4, reps: "5", restSec: 150, note: "最大爆发力" },
      { exerciseId: "depth-jump", phase: "main", sets: 3, reps: "4", restSec: 180, note: "30-45cm箱" },
      { exerciseId: "broad-jump", phase: "main", sets: 4, reps: "4", restSec: 120, note: "" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "6栏", restSec: 120, note: "低栏30cm" },
      { exerciseId: "med-ball-overhead-throw", phase: "main", sets: 3, reps: "8", restSec: 120, note: "4-6kg" },
    ],
  },
  {
    name: "增强式 · 高级 · 无器械", icon: "⚡", desc: "极限增强式+连续跳",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "25", restSec: 60, note: "" },
      { exerciseId: "depth-jump", phase: "main", sets: 4, reps: "4", restSec: 180, note: "45-60cm箱" },
      { exerciseId: "tuck-jump", phase: "main", sets: 4, reps: "8", restSec: 150, note: "连续爆发" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 4, reps: "5/腿", restSec: 120, note: "最大距离" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "8栏", restSec: 120, note: "高栏60cm" },
      { exerciseId: "single-leg-calf-raise", phase: "accessory", sets: 4, reps: "12/侧", restSec: 60, note: "" },
    ],
  },
  {
    name: "增强式 · 高级 · 有器械", icon: "⚡", desc: "极限增强式+负重跳跃",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 60, note: "" },
      { exerciseId: "depth-jump", phase: "main", sets: 5, reps: "4", restSec: 180, note: "45-60cm箱" },
      { exerciseId: "box-jump", phase: "main", sets: 4, reps: "5", restSec: 150, note: "90-120cm箱" },
      { exerciseId: "jump-squat", phase: "main", sets: 4, reps: "5", restSec: 150, note: "30% 1RM负重" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "8栏", restSec: 120, note: "高栏" },
      { exerciseId: "med-ball-slam", phase: "accessory", sets: 3, reps: "6", restSec: 90, note: "8-10kg" },
    ],
  },
  // ══════ 举重日（6种） ══════
  {
    name: "举重日 · 初级 · 无器械", icon: "🏆", desc: "自重模拟举重爆发",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "12", restSec: 60, note: "激活" },
      { exerciseId: "jump-squat", phase: "main", sets: 4, reps: "6", restSec: 120, note: "自重爆发" },
      { exerciseId: "jump-shrug", phase: "main", sets: 3, reps: "8", restSec: 90, note: "模拟提拉" },
      { exerciseId: "broad-jump", phase: "main", sets: 3, reps: "5", restSec: 90, note: "" },
      { exerciseId: "plank", phase: "accessory", sets: 3, reps: "45s", restSec: 45, note: "" },
    ],
  },
  {
    name: "举重日 · 初级 · 有器械", icon: "🏆", desc: "轻杠铃学技术",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "10", restSec: 60, note: "" },
      { exerciseId: "hang-clean", phase: "main", sets: 4, reps: "5", restSec: 150, note: "轻重量学技术" },
      { exerciseId: "jump-shrug", phase: "main", sets: 3, reps: "5", restSec: 120, note: "" },
      { exerciseId: "front-squat", phase: "main", sets: 3, reps: "8", restSec: 120, note: "60-70% 1RM" },
      { exerciseId: "push-press", phase: "accessory", sets: 3, reps: "8", restSec: 90, note: "" },
    ],
  },
  {
    name: "举重日 · 中级 · 无器械", icon: "🏆", desc: "爆发自重+模拟举重",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "20", restSec: 45, note: "" },
      { exerciseId: "jump-squat", phase: "main", sets: 5, reps: "5", restSec: 150, note: "最大高度" },
      { exerciseId: "jump-shrug", phase: "main", sets: 4, reps: "6", restSec: 120, note: "" },
      { exerciseId: "tuck-jump", phase: "main", sets: 4, reps: "6", restSec: 120, note: "" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 3, reps: "5/腿", restSec: 120, note: "" },
      { exerciseId: "ab-wheel-rollout", phase: "accessory", sets: 3, reps: "8", restSec: 60, note: "" },
    ],
  },
  {
    name: "举重日 · 中级 · 有器械", icon: "🏆", desc: "举重+力量，神经爆发训练",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "12", restSec: 60, note: "激活" },
      { exerciseId: "hang-clean", phase: "main", sets: 5, reps: "3", restSec: 180, note: "70-80% 1RM" },
      { exerciseId: "jump-shrug", phase: "main", sets: 4, reps: "5", restSec: 150, note: "手臂不发力" },
      { exerciseId: "front-squat", phase: "main", sets: 4, reps: "5", restSec: 150, note: "75-85% 1RM" },
      { exerciseId: "push-press", phase: "accessory", sets: 3, reps: "6", restSec: 120, note: "" },
      { exerciseId: "ab-wheel-rollout", phase: "accessory", sets: 3, reps: "10", restSec: 60, note: "" },
    ],
  },
  {
    name: "举重日 · 高级 · 无器械", icon: "🏆", desc: "极限爆发自重",
    exercises: [
      { exerciseId: "pogo-jump", phase: "warmup", sets: 2, reps: "25", restSec: 45, note: "" },
      { exerciseId: "jump-squat", phase: "main", sets: 5, reps: "5", restSec: 150, note: "" },
      { exerciseId: "depth-jump", phase: "main", sets: 4, reps: "4", restSec: 180, note: "45-60cm" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 4, reps: "6/腿", restSec: 120, note: "" },
      { exerciseId: "tuck-jump", phase: "main", sets: 4, reps: "10", restSec: 120, note: "" },
      { exerciseId: "ab-wheel-rollout", phase: "accessory", sets: 4, reps: "10", restSec: 60, note: "" },
    ],
  },
  {
    name: "举重日 · 高级 · 有器械", icon: "🏆", desc: "大负荷举重+爆发力",
    exercises: [
      { exerciseId: "goblet-squat", phase: "warmup", sets: 2, reps: "8", restSec: 60, note: "" },
      { exerciseId: "hang-clean", phase: "main", sets: 6, reps: "2-3", restSec: 180, note: "80-90% 1RM" },
      { exerciseId: "jump-shrug", phase: "main", sets: 4, reps: "4", restSec: 150, note: "" },
      { exerciseId: "front-squat", phase: "main", sets: 5, reps: "3-5", restSec: 150, note: "80-90% 1RM" },
      { exerciseId: "push-press", phase: "accessory", sets: 3, reps: "4-6", restSec: 120, note: "" },
      { exerciseId: "ab-wheel-rollout", phase: "accessory", sets: 3, reps: "12", restSec: 60, note: "" },
    ],
  },
  // ══════ 速度敏捷日（6种） ══════
  {
    name: "速度敏捷 · 初级 · 无器械", icon: "🏃", desc: "基础跑姿+低强度敏捷",
    exercises: [
      { exerciseId: "a-skip", phase: "warmup", sets: 2, reps: "15m", restSec: 45, note: "跑姿激活" },
      { exerciseId: "sprint-30m", phase: "main", sets: 4, reps: "1", restSec: 150, note: "90%强度" },
      { exerciseId: "ladder-drill", phase: "main", sets: 1, reps: "3种×2组", restSec: 90, note: "精确优先" },
      { exerciseId: "tuck-jump", phase: "main", sets: 3, reps: "6", restSec: 90, note: "" },
      { exerciseId: "plank", phase: "accessory", sets: 3, reps: "45s", restSec: 45, note: "" },
    ],
  },
  {
    name: "速度敏捷 · 初级 · 有器械", icon: "🏃", desc: "绳梯+轻阻力冲刺",
    exercises: [
      { exerciseId: "a-skip", phase: "warmup", sets: 2, reps: "15m", restSec: 45, note: "" },
      { exerciseId: "ladder-drill", phase: "warmup", sets: 1, reps: "4种×2组", restSec: 60, note: "" },
      { exerciseId: "sprint-30m", phase: "main", sets: 5, reps: "1", restSec: 150, note: "全力" },
      { exerciseId: "resisted-sprint", phase: "main", sets: 3, reps: "1", restSec: 120, note: "轻弹力带" },
      { exerciseId: "suitcase-carry", phase: "accessory", sets: 3, reps: "30m/侧", restSec: 60, note: "轻哑铃" },
    ],
  },
  {
    name: "速度敏捷 · 中级 · 无器械", icon: "🏃", desc: "多向变向+增强式组合",
    exercises: [
      { exerciseId: "ladder-drill", phase: "warmup", sets: 1, reps: "4种×2组", restSec: 60, note: "" },
      { exerciseId: "sprint-30m", phase: "main", sets: 5, reps: "1", restSec: 180, note: "全力冲刺" },
      { exerciseId: "tuck-jump", phase: "main", sets: 3, reps: "8", restSec: 120, note: "连续" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 3, reps: "5/腿", restSec: 120, note: "" },
      { exerciseId: "broad-jump", phase: "main", sets: 3, reps: "4", restSec: 120, note: "" },
    ],
  },
  {
    name: "速度敏捷 · 中级 · 有器械", icon: "🏃", desc: "短跑+绳梯+增强式",
    exercises: [
      { exerciseId: "ladder-drill", phase: "warmup", sets: 1, reps: "4种×2组", restSec: 60, note: "精确优先" },
      { exerciseId: "sprint-30m", phase: "main", sets: 5, reps: "1", restSec: 180, note: "全力冲刺" },
      { exerciseId: "resisted-sprint", phase: "main", sets: 4, reps: "1", restSec: 150, note: "10%体重阻力" },
      { exerciseId: "tuck-jump", phase: "main", sets: 3, reps: "8", restSec: 120, note: "连续爆发" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 3, reps: "5/腿", restSec: 120, note: "" },
      { exerciseId: "suitcase-carry", phase: "accessory", sets: 3, reps: "40m/侧", restSec: 60, note: "" },
    ],
  },
  {
    name: "速度敏捷 · 高级 · 无器械", icon: "🏃", desc: "极限冲刺+多向爆发",
    exercises: [
      { exerciseId: "ladder-drill", phase: "warmup", sets: 1, reps: "5种×2组", restSec: 60, note: "" },
      { exerciseId: "sprint-30m", phase: "main", sets: 6, reps: "1", restSec: 180, note: "100%全力" },
      { exerciseId: "tuck-jump", phase: "main", sets: 4, reps: "10", restSec: 120, note: "" },
      { exerciseId: "single-leg-bound", phase: "main", sets: 4, reps: "6/腿", restSec: 120, note: "最大距离" },
      { exerciseId: "hurdle-hop", phase: "main", sets: 3, reps: "6栏", restSec: 120, note: "" },
    ],
  },
  {
    name: "速度敏捷 · 高级 · 有器械", icon: "🏃", desc: "抗阻冲刺+极限变向",
    exercises: [
      { exerciseId: "ladder-drill", phase: "warmup", sets: 1, reps: "5种×2组", restSec: 60, note: "" },
      { exerciseId: "sprint-30m", phase: "main", sets: 5, reps: "1", restSec: 180, note: "" },
      { exerciseId: "resisted-sprint", phase: "main", sets: 4, reps: "1", restSec: 180, note: "15-20%体重" },
      { exerciseId: "depth-jump", phase: "main", sets: 4, reps: "4", restSec: 180, note: "短触地" },
      { exerciseId: "suitcase-carry", phase: "accessory", sets: 3, reps: "50m/侧", restSec: 60, note: "大重量" },
    ],
  },
  // ══════ 恢复与预康复日（6种） ══════
  {
    name: "恢复日 · 初级 · 无器械", icon: "🧘", desc: "基础恢复拉伸",
    exercises: [
      { exerciseId: "couch-stretch", phase: "main", sets: 2, reps: "60s/侧", restSec: 30, note: "髋屈肌" },
      { exerciseId: "pigeon-stretch", phase: "main", sets: 2, reps: "60s/侧", restSec: 30, note: "臀肌" },
      { exerciseId: "foam-rolling-quads", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "foam-rolling-calves", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "plank", phase: "accessory", sets: 2, reps: "30s", restSec: 30, note: "" },
    ],
  },
  {
    name: "恢复日 · 初级 · 有器械", icon: "🧘", desc: "泡沫轴+弹力带恢复",
    exercises: [
      { exerciseId: "banded-glute-bridge", phase: "warmup", sets: 2, reps: "15", restSec: 30, note: "" },
      { exerciseId: "foam-rolling-quads", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "foam-rolling-calves", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "eccentric-heel-drop", phase: "main", sets: 3, reps: "15", restSec: 60, note: "直膝+屈膝" },
      { exerciseId: "couch-stretch", phase: "cooldown", sets: 2, reps: "90s/侧", restSec: 30, note: "" },
    ],
  },
  {
    name: "恢复日 · 中级 · 无器械", icon: "🧘", desc: "主动恢复+核心",
    exercises: [
      { exerciseId: "hip-airplane", phase: "warmup", sets: 2, reps: "6/侧", restSec: 45, note: "" },
      { exerciseId: "couch-stretch", phase: "main", sets: 3, reps: "90s/侧", restSec: 30, note: "深度拉伸" },
      { exerciseId: "pigeon-stretch", phase: "main", sets: 2, reps: "90s/侧", restSec: 30, note: "" },
      { exerciseId: "single-leg-glute-bridge", phase: "main", sets: 3, reps: "12/侧", restSec: 60, note: "" },
      { exerciseId: "side-plank", phase: "accessory", sets: 2, reps: "30s/侧", restSec: 30, note: "" },
    ],
  },
  {
    name: "恢复日 · 中级 · 有器械", icon: "🧘", desc: "恢复+活动度+预康复",
    exercises: [
      { exerciseId: "banded-glute-bridge", phase: "warmup", sets: 2, reps: "15", restSec: 30, note: "激活臀肌" },
      { exerciseId: "banded-lateral-walk", phase: "warmup", sets: 2, reps: "12步/向", restSec: 30, note: "" },
      { exerciseId: "ankle-abc", phase: "warmup", sets: 1, reps: "A-Z", restSec: 0, note: "" },
      { exerciseId: "couch-stretch", phase: "main", sets: 3, reps: "90s/侧", restSec: 30, note: "深度拉伸" },
      { exerciseId: "foam-rolling-quads", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "foam-rolling-calves", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "eccentric-heel-drop", phase: "main", sets: 3, reps: "15", restSec: 60, note: "直膝+屈膝" },
    ],
  },
  {
    name: "恢复日 · 高级 · 无器械", icon: "🧘", desc: "深度恢复+预康复",
    exercises: [
      { exerciseId: "hip-airplane", phase: "warmup", sets: 3, reps: "6/侧", restSec: 45, note: "" },
      { exerciseId: "couch-stretch", phase: "main", sets: 3, reps: "120s/侧", restSec: 30, note: "" },
      { exerciseId: "pigeon-stretch", phase: "main", sets: 3, reps: "120s/侧", restSec: 30, note: "" },
      { exerciseId: "eccentric-heel-drop", phase: "main", sets: 3, reps: "20", restSec: 60, note: "慢速" },
      { exerciseId: "single-leg-glute-bridge", phase: "accessory", sets: 3, reps: "15/侧", restSec: 60, note: "" },
      { exerciseId: "plank", phase: "accessory", sets: 3, reps: "60s", restSec: 45, note: "" },
    ],
  },
  {
    name: "恢复日 · 高级 · 有器械", icon: "🧘", desc: "全面恢复+预康复",
    exercises: [
      { exerciseId: "banded-glute-bridge", phase: "warmup", sets: 2, reps: "15", restSec: 30, note: "激活臀肌" },
      { exerciseId: "banded-lateral-walk", phase: "warmup", sets: 2, reps: "12步/向", restSec: 30, note: "" },
      { exerciseId: "ankle-abc", phase: "warmup", sets: 1, reps: "A-Z", restSec: 0, note: "" },
      { exerciseId: "couch-stretch", phase: "main", sets: 3, reps: "90s/侧", restSec: 30, note: "深度拉伸" },
      { exerciseId: "hip-airplane", phase: "main", sets: 2, reps: "6/侧", restSec: 45, note: "控制旋转" },
      { exerciseId: "foam-rolling-quads", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "foam-rolling-calves", phase: "main", sets: 1, reps: "2分钟/侧", restSec: 0, note: "" },
      { exerciseId: "eccentric-heel-drop", phase: "main", sets: 3, reps: "15", restSec: 60, note: "直膝+屈膝" },
      { exerciseId: "contrast-bath", phase: "cooldown", sets: 1, reps: "5轮", restSec: 0, note: "热1min/冷1min" },
    ],
  },
];

// ================================================================
// Constants
// ================================================================
const STORAGE_KEY = "bouncelab_saved_plans";

// ================================================================
// Components
// ================================================================

/** Mini exercise card for the library browser */
function MiniExerciseCard({ ex, onAdd, added }: { ex: Exercise; onAdd: (phase: PlanPhase) => void; added: boolean }) {
  const [showPicker, setShowPicker] = useState(false);
  const diffColor: Record<string, string> = { "初级": "text-green-400", "中级": "text-amber-400", "高级": "text-red-400" };

  return (
    <div className={`bg-[#1e293b] border rounded-lg p-3 flex items-center gap-3 transition-all ${added ? "border-amber-500/40 opacity-70" : "border-slate-700/50 hover:border-slate-500"}`}>
      <span className="text-xl flex-shrink-0">{ex.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-slate-200 truncate">{ex.name}</span>
          <span className={`text-xs ${diffColor[ex.difficulty]}`}>{ex.difficulty}</span>
        </div>
        <p className="text-xs text-slate-500 truncate">{ex.description.split("。")[0].slice(0, 50)}</p>
      </div>
      {!added ? (
        <div className="relative flex-shrink-0">
          <button onClick={() => setShowPicker(!showPicker)} className="px-3 py-1.5 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/25 transition-colors">
            + 添加
          </button>
          {showPicker && (
            <div className="absolute right-0 top-full mt-1 bg-[#0f172a] border border-slate-600 rounded-lg shadow-xl z-30 py-1 w-36" onMouseLeave={() => setShowPicker(false)}>
              {(Object.keys(PHASE_LABELS) as PlanPhase[]).map(phase => (
                <button key={phase} onClick={() => { onAdd(phase); setShowPicker(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2">
                  <span>{PHASE_LABELS[phase].icon}</span> {PHASE_LABELS[phase].label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span className="text-xs text-amber-400 flex-shrink-0 px-2">✓ 已添加</span>
      )}
    </div>
  );
}

/** Editable exercise row in the plan */
function PlanExerciseRow({ pe, index, total, dispatch }: { pe: PlanExercise; index: number; total: number; dispatch: React.Dispatch<PlanAction> }) {
  const ex = EXERCISES.find(e => e.id === pe.exerciseId);
  if (!ex) return null;

  return (
    <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3 group">
      <div className="flex items-center gap-3 mb-2">
        {/* Move buttons */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button onClick={() => dispatch({ type: "MOVE_EXERCISE", uid: pe.uid, direction: "up" })} disabled={index === 0}
            className="text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default text-xs leading-none">▲</button>
          <button onClick={() => dispatch({ type: "MOVE_EXERCISE", uid: pe.uid, direction: "down" })} disabled={index === total - 1}
            className="text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-default text-xs leading-none">▼</button>
        </div>
        {/* Info */}
        <span className="text-lg flex-shrink-0">{ex.icon}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-200">{ex.name}</span>
          <span className="text-xs text-slate-500 ml-2">{ex.nameEn}</span>
          <p className="text-[10px] text-slate-600 truncate mt-0.5">{ex.description.split("。")[0]}</p>
        </div>
        {/* Phase badge */}
        <select value={pe.phase} onChange={e => dispatch({ type: "UPDATE_EXERCISE", uid: pe.uid, field: "phase", value: e.target.value })}
          className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1 text-slate-300 outline-none flex-shrink-0">
          {(Object.keys(PHASE_LABELS) as PlanPhase[]).map(p => (
            <option key={p} value={p}>{PHASE_LABELS[p].icon} {PHASE_LABELS[p].label}</option>
          ))}
        </select>
        {/* Remove */}
        <button onClick={() => dispatch({ type: "REMOVE_EXERCISE", uid: pe.uid })}
          className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0 text-sm opacity-0 group-hover:opacity-100">✕</button>
      </div>
      {/* Editable params */}
      <div className="flex flex-wrap gap-2 ml-10">
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500">组</label>
          <input type="number" min={1} max={10} value={pe.sets} onChange={e => { const v = parseInt(e.target.value); dispatch({ type: "UPDATE_EXERCISE", uid: pe.uid, field: "sets", value: isNaN(v) ? 1 : v }); }}
            className="w-12 text-center text-xs bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-slate-200 outline-none focus:border-amber-500/50" />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500">次</label>
          <input type="text" value={pe.reps} onChange={e => dispatch({ type: "UPDATE_EXERCISE", uid: pe.uid, field: "reps", value: e.target.value })}
            className="w-16 text-center text-xs bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-slate-200 outline-none focus:border-amber-500/50" placeholder="8-10" />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-slate-500">休息(s)</label>
          <input type="number" min={0} max={600} step={15} value={pe.restSec} onChange={e => { const v = parseInt(e.target.value); dispatch({ type: "UPDATE_EXERCISE", uid: pe.uid, field: "restSec", value: isNaN(v) ? 0 : v }); }}
            className="w-14 text-center text-xs bg-slate-700 border border-slate-600 rounded px-1 py-0.5 text-slate-200 outline-none focus:border-amber-500/50" />
        </div>
        <input type="text" value={pe.note} onChange={e => dispatch({ type: "UPDATE_EXERCISE", uid: pe.uid, field: "note", value: e.target.value })}
          className="flex-1 min-w-[80px] text-xs bg-slate-700 border border-slate-600 rounded px-2 py-0.5 text-slate-300 outline-none focus:border-amber-500/50" placeholder="备注：如 %1RM、节奏..." />
      </div>
    </div>
  );
}

// ================================================================
// Unified Calendar Component (merged into main page)
// ================================================================
const CALENDAR_PLANS_KEY = "bounce-calendar-plans";
const WEEK_START_KEY = "bounce-training-start-week";

interface CalendarPlan {
  id: string; name: string; dayOfWeek: number;
  exercises: PlanExercise[]; createdAt: string;
  rawContent?: string; batchId?: string;
}

function UnifiedCalendar({ plan, planName, savedPlans, showToast, showDayPicker, setShowDayPicker, loadPlan, setPlanName }: {
  plan: PlanExercise[]; planName: string; savedPlans: SavedPlan[];
  showToast: (msg: string) => void;
  showDayPicker: boolean; setShowDayPicker: (v: boolean) => void;
  loadPlan: (p: SavedPlan) => void;
  setPlanName: (n: string) => void;
}) {
  const [calendarPlans, setCalendarPlans] = useState<CalendarPlan[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [startWeek, setStartWeek] = useState("");
  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  const [expandedPlanIds, setExpandedPlanIds] = useState<Set<string>>(new Set());
  const [expandedBatches, setExpandedBatches] = useState<Set<string>>(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [selectedDayPlans, setSelectedDayPlans] = useState<CalendarPlan[] | null>(null);

  useEffect(() => {
    try { setCalendarPlans(JSON.parse(localStorage.getItem(CALENDAR_PLANS_KEY) || "[]")); } catch {}
    const sw = localStorage.getItem(WEEK_START_KEY);
    if (sw) setStartWeek(sw);
  }, []);

  const saveCalendarPlans = (plans: CalendarPlan[]) => {
    setCalendarPlans(plans);
    localStorage.setItem(CALENDAR_PLANS_KEY, JSON.stringify(plans));
  };

  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,"0"); const day = String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  };

  const getMondayOfWeek = (weekStr: string): Date | null => {
    if (!weekStr) return null;
    const [y, w] = weekStr.split("-W").map(Number);
    if (!y || !w) return null;
    const jan4 = new Date(y, 0, 4);
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - (jan4.getDay() + 6) % 7 + (w - 1) * 7);
    return monday;
  };

  const assignPlanToDay = (dayOfWeek: number) => {
    if (plan.length === 0) { showToast("请先添加动作"); return; }
    // Use current week's Monday as base, not startWeek
    const now = new Date();
    const currentMonday = new Date(now);
    currentMonday.setDate(now.getDate() - (now.getDay() + 6) % 7);
    const planDate = new Date(currentMonday);
    planDate.setDate(currentMonday.getDate() + dayOfWeek);
    const dateStr = formatLocalDate(planDate);
    const newPlan: CalendarPlan = { id: Date.now().toString(36), name: planName, dayOfWeek, exercises: [...plan], createdAt: dateStr };
    saveCalendarPlans([...calendarPlans, newPlan]);
    showToast(`已安排到${["周一","周二","周三","周四","周五","周六","周日"][dayOfWeek]} (${dateStr})`);
    setShowDayPicker(false);
  };

  const removeCalendarPlan = (id: string) => {
    saveCalendarPlans(calendarPlans.filter(p => p.id !== id));
  };

  const removeBatch = (datePrefix: string) => {
    const toRemove = calendarPlans.filter(p => p.createdAt.startsWith(datePrefix));
    if (toRemove.length === 0) return;
    saveCalendarPlans(calendarPlans.filter(p => !p.createdAt.startsWith(datePrefix)));
    showToast(`已批量删除 ${toRemove.length} 个计划`);
  };

  const saveStartWeek = () => {
    if (!startWeek) return;
    localStorage.setItem(WEEK_START_KEY, startWeek);
    showToast("训练起始周已设定");
  };

  const today = formatLocalDate(new Date());
  const year = viewDate.getFullYear(); const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startPad = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: string; day: number; isCurrentMonth: boolean; plans: CalendarPlan[] }[] = [];
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startPad-1; i>=0; i--) {
    const d = prevMonthDays-i;
    days.push({ date: `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`, day: d, isCurrentMonth: false, plans: [] });
  }
  for (let d=1; d<=daysInMonth; d++) {
    const ds = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    days.push({ date: ds, day: d, isCurrentMonth: true, plans: calendarPlans.filter(p => p.createdAt === ds) });
  }

  const startMonday = getMondayOfWeek(startWeek);
  const currentWeekNum = startMonday ? Math.floor((new Date().getTime() - startMonday.getTime()) / (7*24*60*60*1000)) + 1 : null;

  // Group AI plans by import date for batch display
  const aiPlanDates = [...new Set(calendarPlans.filter(p => p.rawContent).map(p => p.createdAt.slice(0,7)))].sort();
  const manualPlans = calendarPlans.filter(p => !p.rawContent);

  return (
    <>
      {/* Week selector */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-slate-400 shrink-0">起始周：</span>
        <input type="week" value={startWeek} onChange={e => setStartWeek(e.target.value)}
          className="bg-slate-800 border border-slate-600/50 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-amber-500/50" />
        <button onClick={saveStartWeek} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-lg">确认</button>
        {currentWeekNum && currentWeekNum >= 1 && currentWeekNum <= 12 && (
          <span className="text-xs text-amber-400 ml-auto">第 {currentWeekNum} 周</span>
        )}
        <button onClick={() => setShowDayPicker(true)} disabled={plan.length === 0}
          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-lg hover:bg-amber-500/20 disabled:opacity-40">
          📅 安排到日历
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50">
          <button onClick={() => setViewDate(new Date(year, month-1))} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">◀</button>
          <h3 className="text-sm font-bold text-white">{year}年{month+1}月</h3>
          <button onClick={() => setViewDate(new Date(year, month+1))} className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs">▶</button>
        </div>
        <div className="grid grid-cols-7 border-b border-slate-700/50">
          {["一","二","三","四","五","六","日"].map(w => <div key={w} className="p-1.5 text-center text-[10px] text-slate-400">{w}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const isToday = d.date === today; const hasPlans = d.plans.length > 0;
            return (
              <button key={i} onClick={() => hasPlans ? setSelectedDayPlans(d.plans) : null}
                className={`min-h-[50px] p-1 border-b border-r border-slate-700/30 text-left transition-all hover:bg-slate-700/30 ${!d.isCurrentMonth?"opacity-30":""} ${isToday?"bg-amber-500/10 ring-1 ring-amber-500/30":""} ${hasPlans?"cursor-pointer":""}`}>
                <span className={`text-[10px] ${isToday?"text-amber-400 font-bold":d.isCurrentMonth?"text-slate-300":"text-slate-600"}`}>{d.day}</span>
                {hasPlans && <div className="mt-0.5 flex flex-wrap gap-0.5">{d.plans.slice(0,3).map((p,j) => (
                  <span key={j} className="block w-1.5 h-1.5 rounded-full bg-amber-500" title={p.name} />
                ))}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scheduled plans - grouped */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
        <h3 className="text-sm font-bold text-slate-300 mb-3">已安排的训练计划 ({calendarPlans.length})</h3>
        {calendarPlans.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">暂无安排</p>
        ) : (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {/* AI batch plans - grouped by month */}
            {aiPlanDates.map(dateKey => {
              const batchPlans = calendarPlans.filter(p => p.rawContent && p.createdAt.startsWith(dateKey));
              const isExpanded = expandedBatches.has(dateKey);
              // Group by week within batch
              const weeks = [...new Set(batchPlans.map(p => {
                const d = new Date(p.createdAt + "T00:00:00");
                const jan4 = new Date(d.getFullYear(), 0, 4);
                return Math.ceil(((d.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7);
              }))].sort((a,b) => a-b);
              return (
                <div key={dateKey} className="border border-emerald-500/20 rounded-lg overflow-hidden">
                  <div className="bg-emerald-500/5 px-3 py-2 flex items-center gap-2">
                    <button onClick={() => {
                      setExpandedBatches(prev => { const n = new Set(prev); n.has(dateKey) ? n.delete(dateKey) : n.add(dateKey); return n; });
                    }} className="text-xs text-emerald-400 hover:text-emerald-300">
                      {isExpanded ? "▼" : "▶"} AI训练计划 ({batchPlans.length}天)
                    </button>
                    <span className="text-[10px] text-slate-500">{dateKey}</span>
                    <button onClick={() => removeBatch(dateKey)}
                      className="ml-auto text-[10px] text-red-400 hover:text-red-300">批量删除</button>
                  </div>
                  {isExpanded && weeks.map(w => {
                    const weekPlans = batchPlans.filter(p => {
                      const d = new Date(p.createdAt + "T00:00:00");
                      const jan4 = new Date(d.getFullYear(), 0, 4);
                      return Math.ceil(((d.getTime() - jan4.getTime()) / 86400000 + jan4.getDay() + 1) / 7) === w;
                    });
                    const weekExpanded = expandedWeeks.has(w);
                    return (
                      <div key={w} className="border-t border-slate-700/30">
                        <button onClick={() => {
                          setExpandedWeeks(prev => { const n = new Set(prev); n.has(w) ? n.delete(w) : n.add(w); return n; });
                        }} className="w-full text-left px-4 py-1.5 text-xs text-amber-400 hover:bg-slate-800/30 flex items-center gap-2">
                          {weekExpanded ? "▼" : "▶"} 第{w}周 ({weekPlans.length}天)
                        </button>
                        {weekExpanded && weekPlans.sort((a,b) => a.dayOfWeek-b.dayOfWeek).map(p => (
                          <div key={p.id} className="px-6 py-1.5 border-t border-slate-700/20">
                            <div className="flex items-center gap-2">
                              <button onClick={() => {
                                setExpandedPlanIds(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; });
                              }} className="text-[10px] text-amber-400">
                                {expandedPlanIds.has(p.id) ? "▼" : "▶"}
                              </button>
                              <span className="text-xs text-amber-400 w-8">{["一","二","三","四","五","六","日"][p.dayOfWeek]}</span>
                              <span className="text-xs text-slate-500 w-20">{p.createdAt}</span>
                              <span className="text-xs text-slate-300 flex-1 truncate">{p.name}</span>
                              <button onClick={() => removeCalendarPlan(p.id)} className="text-[10px] text-slate-600 hover:text-red-400">✕</button>
                            </div>
                            {expandedPlanIds.has(p.id) && p.rawContent && (
                              <pre className="mt-1 text-[10px] text-slate-400 whitespace-pre-wrap leading-relaxed bg-slate-800/50 rounded p-2">{p.rawContent}</pre>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Manual plans */}
            {manualPlans.length > 0 && (
              <div className="border border-amber-500/20 rounded-lg overflow-hidden">
                <div className="bg-amber-500/5 px-3 py-2">
                  <span className="text-xs text-amber-400">手动组装计划 ({manualPlans.length})</span>
                </div>
                {manualPlans.sort((a,b) => a.createdAt.localeCompare(b.createdAt)).map(p => (
                  <div key={p.id} className="px-3 py-1.5 border-t border-slate-700/30 flex items-center gap-2">
                    <span className="text-xs text-amber-400 w-8">{["一","二","三","四","五","六","日"][p.dayOfWeek]}</span>
                    <span className="text-xs text-slate-500 w-20">{p.createdAt}</span>
                    <span className="text-xs text-slate-300 flex-1 truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-600">{p.exercises.filter(pe => pe.phase==="main"||pe.phase==="accessory").length}动作</span>
                    <button onClick={() => removeCalendarPlan(p.id)} className="text-[10px] text-slate-600 hover:text-red-400">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Day detail popup */}
      {selectedDayPlans && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedDayPlans(null)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-md w-full p-5 shadow-2xl max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-white mb-3">📋 {selectedDayPlans[0]?.createdAt} 训练详情</h3>
            {selectedDayPlans.map((p, i) => (
              <div key={p.id} className="mb-3 bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm font-medium text-amber-400 mb-1">{p.name}</p>
                {p.rawContent ? (
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{p.rawContent}</pre>
                ) : (
                  <div className="text-xs text-slate-400 space-y-0.5">
                    {p.exercises.map((pe, j) => {
                      const ex = EXERCISES.find(e => e.id === pe.exerciseId);
                      return <p key={j}>{ex?.icon} {ex?.name || pe.exerciseId} {pe.sets}×{pe.reps}</p>;
                    })}
                  </div>
                )}
              </div>
            ))}
            <button onClick={() => setSelectedDayPlans(null)} className="w-full py-2 text-sm text-slate-400 hover:text-slate-200 border border-slate-600 rounded-lg">关闭</button>
          </div>
        </div>
      )}

      {/* Day picker modal */}
      {showDayPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDayPicker(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-sm w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-100 mb-2">选择训练日期</h3>
            <p className="text-xs text-slate-500 mb-4">将「{planName}」安排到本周哪天训练？（当前周）</p>
            <div className="space-y-1.5 mb-4">
              {(() => {
                const now = new Date();
                const monday = new Date(now);
                monday.setDate(now.getDate() - (now.getDay() + 6) % 7);
                return ["周一","周二","周三","周四","周五","周六","周日"].map((wd, i) => {
                  const d = new Date(monday);
                  d.setDate(monday.getDate() + i);
                  const ds = formatLocalDate(d);
                  const isToday = ds === today;
                  return (
                    <button key={i} onClick={() => assignPlanToDay(i)}
                      className={`w-full py-2.5 text-sm rounded-lg transition-all border flex items-center justify-between px-4 ${
                        isToday ? "bg-amber-500/10 border-amber-500/30" : "bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/30"
                      }`}>
                      <span className="font-medium">{wd}</span>
                      <span className={`text-xs ${isToday ? "text-amber-400" : "text-slate-500"}`}>{ds} {isToday ? "(今天)" : ""}</span>
                    </button>
                  );
                });
              })()}
            </div>
            <p className="text-[10px] text-slate-600 mb-4">安排后将显示在日历对应日期上</p>
            <button onClick={() => setShowDayPicker(false)} className="w-full py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">取消</button>
          </div>
        </div>
      )}
    </>
  );
}

// ================================================================
// Main Page
// ================================================================
export default function ProgramBuilderPage() {
  const [plan, dispatch] = useReducer(planReducer, []);
  const [planName, setPlanName] = useState("我的训练计划");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [expandedTemplateGroup, setExpandedTemplateGroup] = useState<string | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // New: tab & calendar state
  const [activeTab, setActiveTab] = useState<"build" | "library">("library");
  const [showDayPicker, setShowDayPicker] = useState(false);

  // Load saved plans on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedPlans(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Filter exercises
  const filtered = (() => {
    let list = activeCategory === "all" ? EXERCISES : EXERCISES.filter(e => e.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.includes(q) || e.nameEn.toLowerCase().includes(q) || e.targetMuscles.includes(q));
    }
    return list;
  })();

  // Check if exercise is in plan
  const isInPlan = (exId: string) => plan.some(pe => pe.exerciseId === exId);

  // Group plan by phase
  const groupedPlan = (Object.keys(PHASE_LABELS) as PlanPhase[]).map(phase => ({
    phase,
    ...PHASE_LABELS[phase],
    exercises: plan.filter(pe => pe.phase === phase),
  })).filter(g => g.exercises.length > 0);

  // Total estimated time
  const totalTimeMin = plan.reduce((sum, pe) => {
    const workTime = pe.sets * 0.5; // ~30s per set
    const restTime = (pe.sets - 1) * (pe.restSec / 60);
    return sum + workTime + restTime;
  }, 0);

  // Save plan
  const savePlan = () => {
    if (plan.length === 0) { showToast("⚠️ 请先添加动作"); return; }
    const saved: SavedPlan = {
      id: Date.now().toString(36),
      name: planName || "未命名计划",
      createdAt: new Date().toLocaleDateString("zh-CN"),
      exercises: plan,
    };
    const updated = [saved, ...savedPlans.filter(p => p.id !== saved.id)];
    setSavedPlans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast("✅ 计划已保存！");
  };

  // Load plan
  const loadPlan = (p: SavedPlan) => {
    dispatch({ type: "LOAD_PLAN", exercises: p.exercises });
    setPlanName(p.name);
    setShowSaved(false);
    showToast("📂 计划已加载");
  };

  // Delete saved plan
  const deletePlan = (id: string) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    showToast("🗑️ 已删除");
  };

  // Load template
  const loadTemplate = (t: Template) => {
    const exercises: PlanExercise[] = t.exercises.map(te => ({
      uid: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) + te.exerciseId,
      exerciseId: te.exerciseId,
      sets: te.sets,
      reps: te.reps,
      restSec: te.restSec,
      note: te.note,
      phase: te.phase,
    }));
    dispatch({ type: "LOAD_PLAN", exercises });
    setPlanName(t.name);
    setShowTemplates(false);
    showToast("📋 模板已加载！");
  };

  // Export as text
  const exportPlan = () => {
    if (plan.length === 0) return;
    let text = `📋 ${planName}\n${"═".repeat(40)}\n`;
    text += `⏱ 预估时长：约 ${Math.round(totalTimeMin)} 分钟\n\n`;
    for (const g of groupedPlan) {
      text += `\n${g.icon} ${g.label}\n${"─".repeat(30)}\n`;
      for (const pe of g.exercises) {
        const ex = EXERCISES.find(e => e.id === pe.exerciseId);
        if (!ex) continue;
        text += `  ${ex.icon} ${ex.name} — ${pe.sets}组×${pe.reps}次  休息${pe.restSec}s`;
        if (pe.note) text += `  [${pe.note}]`;
        text += "\n";
      }
    }
    text += `\n${"═".repeat(40)}\n由 BounceLab 训练组装器生成`;
    navigator.clipboard.writeText(text);
    showToast("📋 已复制到剪贴板！");
  };

  const addedExerciseIds = new Set(plan.map(pe => pe.exerciseId));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-black font-semibold px-6 py-3 rounded-xl shadow-2xl text-sm animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-slate-50 mb-2">🧩 训练计划</h1>
        <p className="text-slate-400">组装训练 · 日历管理 · 一站式训练规划</p>
      </div>

      {/* Unified layout: Left=Builder, Right=Calendar */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ============ LEFT: Builder ============ */}
        <div className="space-y-4">
          {/* Exercise Library (collapsible) */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl overflow-hidden">
            <button onClick={() => setActiveTab(activeTab === "library" ? "build" : "library")}
              className="w-full px-4 py-3 flex items-center gap-2 text-sm font-bold text-slate-200 hover:bg-slate-700/30 transition-colors">
              <span>📚 动作库</span>
              <span className="text-xs text-slate-500 ml-auto">{activeTab === "library" ? "收起 ▲" : "展开 ▼"}</span>
            </button>
            {activeTab === "library" && (
            <div className="px-4 pb-4 border-t border-slate-700/50 pt-3">
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setActiveCategory("all"); }}
                placeholder="搜索动作..." className="w-full px-3 py-2 mb-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-amber-500/50" />
              <div className="flex flex-wrap gap-1 mb-3">
                <button onClick={() => setActiveCategory("all")}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${activeCategory === "all" ? "bg-amber-500/15 text-amber-400" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>全部</button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${activeCategory === cat.id ? "bg-amber-500/15 text-amber-400" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}>
                    <span>{cat.icon}</span> <span className="hidden sm:inline">{cat.label}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                {filtered.map(ex => (
                  <MiniExerciseCard key={ex.id} ex={ex} onAdd={(phase) => dispatch({ type: "ADD_EXERCISE", exerciseId: ex.id, phase })} added={addedExerciseIds.has(ex.id)} />
                ))}
                {filtered.length === 0 && <p className="text-xs text-slate-500 text-center py-8">没有匹配的动作</p>}
              </div>
            </div>
            )}
          </div>

          {/* Plan Builder */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <input type="text" value={planName} onChange={e => setPlanName(e.target.value)}
                className="flex-1 min-w-[120px] bg-transparent text-base font-bold text-slate-100 outline-none border-b border-transparent focus:border-amber-500/50 transition-colors px-1"
                placeholder="输入计划名称..." />
              <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                {plan.filter(p => p.phase === "main" || p.phase === "accessory").length} 动作 · 约 {Math.round(totalTimeMin)} 分
              </span>
              <button onClick={savePlan} className="px-2.5 py-1.5 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/25 transition-colors">💾</button>
              <button onClick={() => setShowSaved(true)} className="px-2.5 py-1.5 text-xs bg-slate-700 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors" disabled={savedPlans.length === 0}>📂</button>
              <button onClick={() => setShowTemplates(true)} className="px-2.5 py-1.5 text-xs bg-slate-700 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors">📋</button>
              <button onClick={exportPlan} className="px-2.5 py-1.5 text-xs bg-slate-700 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors" disabled={plan.length === 0}>📤</button>
              <button onClick={() => { dispatch({ type: "CLEAR_PLAN" }); setPlanName("我的训练计划"); showToast("🗑️ 已清空"); }}
                className="px-2.5 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors" disabled={plan.length === 0}>✕</button>
            </div>
            {plan.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm mb-2">你的训练计划还是空的</p>
                <p className="text-xs text-slate-500">展开上方动作库添加动作，或点击 📋 使用模板</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {groupedPlan.map(group => (
                  <div key={group.phase} className="border border-slate-700/30 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-slate-800/50 flex items-center gap-2">
                      <span>{group.icon}</span>
                      <span className="text-xs font-bold text-slate-300">{group.label}</span>
                      <span className="text-[10px] text-slate-500">{group.exercises.length}个</span>
                    </div>
                    <div className="p-2 space-y-1.5">
                      {group.exercises.map((pe, i) => (
                        <PlanExerciseRow key={pe.uid} pe={pe} index={i} total={group.exercises.length} dispatch={dispatch} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ============ RIGHT: Calendar ============ */}
        <div className="space-y-4">
          <UnifiedCalendar
            plan={plan} planName={planName} savedPlans={savedPlans}
            showToast={showToast} showDayPicker={showDayPicker} setShowDayPicker={setShowDayPicker}
            loadPlan={loadPlan} setPlanName={setPlanName}
          />
        </div>
      </div>

      {/* ============ MODAL: Templates ============ */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowTemplates(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-100 mb-4">📋 预设模板（5类 × 6种 = 30模板）</h3>
            {(() => {
              const groups = [
                { key: "力量日", icon: "💪", templates: TEMPLATES.filter(t => t.name.startsWith("力量日")) },
                { key: "增强式", icon: "⚡", templates: TEMPLATES.filter(t => t.name.startsWith("增强式")) },
                { key: "举重日", icon: "🏆", templates: TEMPLATES.filter(t => t.name.startsWith("举重日")) },
                { key: "速度敏捷", icon: "🏃", templates: TEMPLATES.filter(t => t.name.startsWith("速度敏捷")) },
                { key: "恢复日", icon: "🧘", templates: TEMPLATES.filter(t => t.name.startsWith("恢复日")) },
              ];
              return groups.map(g => (
                <div key={g.key} className="mb-2">
                  <button
                    onClick={() => setExpandedTemplateGroup(expandedTemplateGroup === g.key ? null : g.key)}
                    className="w-full text-left p-3 bg-slate-800/70 border border-slate-700/50 rounded-lg hover:border-amber-500/30 transition-colors flex items-center gap-2"
                  >
                    <span className="text-lg">{g.icon}</span>
                    <span className="font-semibold text-slate-200 text-sm">{g.key}</span>
                    <span className="text-xs text-slate-500 ml-auto">{g.templates.length} 种变体</span>
                    <span className={`text-xs text-slate-400 transition-transform ${expandedTemplateGroup === g.key ? "rotate-90" : ""}`}>▶</span>
                  </button>
                  {expandedTemplateGroup === g.key && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-slate-700/50 pl-3">
                      {g.templates.map(t => (
                        <button key={t.name} onClick={() => loadTemplate(t)}
                          className="w-full text-left p-2 bg-slate-800/30 border border-slate-700/30 rounded-lg hover:border-amber-500/40 transition-colors group">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-300 text-xs">{t.name.replace(g.key + " · ", "")}</span>
                            <span className="text-[10px] text-slate-500 ml-auto">{t.exercises.filter(e => e.phase === "main" || e.phase === "accessory").length} 训练动作</span>
                          </div>
                          <p className="text-[10px] text-slate-600 mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ));
            })()}
            <button onClick={() => setShowTemplates(false)} className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">取消</button>
          </div>
        </div>
      )}

      {/* ============ MODAL: Saved Plans ============ */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowSaved(false)}>
          <div className="bg-[#1e293b] border border-slate-600 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-100 mb-4">📂 已保存的计划</h3>
            {savedPlans.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">暂无保存的计划</p>
            ) : (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {savedPlans.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.createdAt} · {p.exercises.length} 动作</p>
                    </div>
                    <button onClick={() => loadPlan(p)} className="px-3 py-1 text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded hover:bg-amber-500/25 transition-colors">加载</button>
                    <button onClick={() => deletePlan(p.id)} className="px-2 py-1 text-xs text-slate-500 hover:text-red-400 transition-colors">🗑️</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setShowSaved(false)} className="mt-4 w-full py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">关闭</button>
          </div>
        </div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
      `}</style>
    </div>
  );
}

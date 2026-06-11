# ============================================================
# BounceLab Next.js Dockerfile
# 用于 CloudBase CloudRun 容器型部署
# ============================================================

# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json* ./
RUN npm install

# 复制源码
COPY . .

# 构建 Next.js 应用
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建产物和必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 设置权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]

#!/bin/bash
# ===================================================
# BounceLab 腾讯云一键部署脚本
# 在服务器上执行: bash deploy.sh
# ===================================================

set -e

echo "🚀 BounceLab 部署开始..."

# 1. 更新系统
echo "📦 更新系统包..."
apt-get update -y && apt-get upgrade -y

# 2. 安装 Node.js 20
echo "📦 安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v
npm -v

# 3. 安装 PM2
echo "📦 安装 PM2..."
npm install -g pm2

# 4. 安装 Nginx
echo "📦 安装 Nginx..."
apt-get install -y nginx

# 5. 克隆代码
echo "📦 克隆代码..."
cd /opt
if [ -d "bouncelab" ]; then
  cd bouncelab
  git pull origin master
else
  git clone https://gitee.com/hfzr/bouncelab.git
  cd bouncelab
fi

# 6. 创建环境变量文件
echo "📝 创建 .env.local..."
cat > .env.local << 'EOF'
DEEPSEEK_API_KEY=sk-33702c2b309c4995bac973e825c43f18
EOF

# 7. 安装依赖 + 构建
echo "📦 安装依赖..."
npm install

echo "🔨 构建项目..."
npm run build

# 8. PM2 启动
echo "🚀 启动服务..."
pm2 delete bouncelab 2>/dev/null || true
pm2 start npm --name "bouncelab" -- start
pm2 save
pm2 startup

# 9. Nginx 配置
echo "⚙️ 配置 Nginx..."
cat > /etc/nginx/sites-available/bouncelab << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/bouncelab /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "✅ 部署完成！"
echo "🌐 访问 http://$(curl -s ifconfig.me) 即可使用 BounceLab"
echo "📊 管理命令："
echo "   pm2 status          - 查看进程状态"
echo "   pm2 logs bouncelab  - 查看日志"
echo "   pm2 restart bouncelab - 重启服务"

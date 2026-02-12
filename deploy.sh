#!/bin/bash
set -e

# === AnyFreeTools 部署脚本 ===
# 流程: 本地打包 → push GitHub → 服务器拉取 → 发布

SERVER="45.63.22.102"
PORT="34567"
USER="root"
PASS="datayes@123"
REPO_DIR="/root/tools"
DEPLOY_DIR="/var/www/tools"

echo "📦 Step 1: 本地构建..."
npx next build

echo "📤 Step 2: 提交并推送到 GitHub..."
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" || echo "nothing to commit"
git push origin main

echo "🚀 Step 3: 服务器拉取并部署..."
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -p $PORT $USER@$SERVER \
  "cd $REPO_DIR && git pull origin main && rm -rf $DEPLOY_DIR/* && cp -r $REPO_DIR/out/* $DEPLOY_DIR/"

echo "✅ 部署完成! https://anyfreetools.com"

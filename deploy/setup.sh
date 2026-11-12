#!/usr/bin/env bash
# EC2(Ubuntu) 최초 1회 실행: 프로그램 설치 + 서비스/Nginx 등록 + 첫 배포
# 사용법: bash deploy/setup.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
RUN_USER="$(whoami)"

echo "==> 패키지 설치"
sudo apt-get update -y
sudo apt-get install -y python3-venv python3-pip nginx curl rsync git

# Vite 6은 Node 20 이상이 필요
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  echo "==> Node.js 22 설치"
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> 백엔드 가상환경"
[ -d "$APP_DIR/backend/venv" ] || python3 -m venv "$APP_DIR/backend/venv"

if [ ! -f "$APP_DIR/backend/.env" ]; then
  cp "$APP_DIR/backend/.env.example" "$APP_DIR/backend/.env"
  NEED_ENV=1
fi

echo "==> systemd 서비스 등록 (movie)"
sudo tee /etc/systemd/system/movie.service >/dev/null <<EOF
[Unit]
Description=FastAPI Movie backend
After=network.target

[Service]
User=$RUN_USER
WorkingDirectory=$APP_DIR/backend
ExecStart=$APP_DIR/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable movie

echo "==> Nginx 설정"
sudo tee /etc/nginx/sites-available/movie >/dev/null <<'EOF'
server {
    listen 80 default_server;
    server_name _;

    root /var/www/movie;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri /index.html;
    }
}
EOF
sudo ln -sf /etc/nginx/sites-available/movie /etc/nginx/sites-enabled/movie
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

SKIP_PULL=1 bash "$APP_DIR/deploy/deploy.sh"

if [ "${NEED_ENV:-0}" = "1" ]; then
  echo
  echo "!! backend/.env 에 TMDB 키를 입력해야 합니다:"
  echo "   nano $APP_DIR/backend/.env"
  echo "   sudo systemctl restart movie"
fi

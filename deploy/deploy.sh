#!/usr/bin/env bash
# 최신 코드로 재배포 (수동 실행 또는 GitHub Actions에서 호출)
# 사용법: bash deploy/deploy.sh
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

if [ "${SKIP_PULL:-0}" != "1" ]; then
  echo "==> 최신 코드 받기"
  git pull --ff-only
fi

echo "==> 백엔드 패키지 설치"
backend/venv/bin/pip install -q -r backend/requirements.txt

echo "==> 프론트엔드 빌드"
cd frontend
npm ci --no-audit --no-fund
npm run build
sudo mkdir -p /var/www/movie
sudo rsync -a --delete dist/ /var/www/movie/
cd "$APP_DIR"

echo "==> 백엔드 재시작"
sudo systemctl restart movie
sleep 2
sudo systemctl is-active movie

echo "==> 배포 완료"

# fastapi-movie-19

TMDB API로 영화·시리즈 데이터를 가져와 OTT 스타일 UI로 보여주는 학습용 프로젝트입니다.

- **백엔드**: FastAPI (TMDB API 프록시)
- **프론트엔드**: React + Vite

## 폴더 구조

```
fastapi-movie-19/
├─ backend/
│  ├─ main.py            # FastAPI 앱 (TMDB 호출)
│  ├─ requirements.txt
│  ├─ .env               # TMDB 키 (git 제외)
│  └─ .env.example       # .env 예시
└─ frontend/
   ├─ index.html
   ├─ vite.config.js     # /api → localhost:8000 프록시
   └─ src/
      ├─ App.jsx
      ├─ api.js
      ├─ index.css
      └─ components/
         ├─ Header.jsx       # 상단 메뉴 + 검색
         ├─ HeroBanner.jsx   # 메인 배너 (자동 전환)
         ├─ Row.jsx          # 포스터 가로 줄 / 순위 줄
         ├─ DetailModal.jsx  # 상세 정보 + 예고편
         └─ Footer.jsx
```

## 환경 변수 설정

`backend/.env.example`을 복사해 `backend/.env`를 만들고 키를 입력합니다.
키는 [TMDB API 설정](https://www.themoviedb.org/settings/api)에서 확인할 수 있습니다.

```
TMDB_API_KEY=발급받은_API_Key
TMDB_ACCESS_TOKEN=발급받은_Read_Access_Token
TMDB_LANGUAGE=ko-KR
FRONTEND_ORIGIN=http://localhost:5173
```

- 둘 중 하나만 있어도 됩니다. `TMDB_ACCESS_TOKEN`이 있으면 이 값을 먼저 사용합니다.
- `.env`는 `.gitignore`에 포함되어 git에 올라가지 않습니다.

## 실행 방법

프로젝트 맨 위 폴더(`fastapi-movie-19`)에서 실행합니다.

```bash
npm install      # 처음 한 번 (concurrently 설치)
npm run setup    # 처음 한 번 (백엔드 pip + 프론트 npm 설치)
npm run dev      # 백엔드(8000) + 프론트(5173) 동시 실행
```

- 두 서버의 로그가 `[BACK]`, `[FRONT]`로 구분되어 한 터미널에 나옵니다.
- `Ctrl+C`를 누르면 두 서버가 함께 꺼집니다.
- 하나만 켜려면 `npm run back` 또는 `npm run front`를 실행합니다.

### 따로 실행하기

터미널 2개를 엽니다.

**백엔드** (http://localhost:8000)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**프론트엔드** (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 http://localhost:5173 에 접속합니다.

## API

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/api/home` | 메인 화면 섹션 (지금 뜨는 콘텐츠, 인기 영화·시리즈, 평점 높은 영화, 극장 상영작, 공개 예정) |
| GET | `/api/{movie\|tv}/{id}` | 상세 정보 + 출연진 + 예고편 |
| GET | `/api/search?q=검색어` | 영화·시리즈 검색 |

API 문서는 백엔드 실행 후 http://localhost:8000/docs 에서 볼 수 있습니다.

## 참고

- Python 3.15에서는 `uvicorn[standard]`가 설치되지 않아 기본 `uvicorn`을 사용합니다.
- This product uses the TMDB API but is not endorsed or certified by TMDB.

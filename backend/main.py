import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).parent / ".env")

TMDB_BASE = "https://api.themoviedb.org/3"
API_KEY = os.getenv("TMDB_API_KEY", "")
ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN", "")
LANGUAGE = os.getenv("TMDB_LANGUAGE", "ko-KR")

app = FastAPI(title="TMDB Movie API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _valid(v: str) -> bool:
    return bool(v) and not v.startswith("여기에")


async def tmdb(path: str, **params):
    headers = {"accept": "application/json"}
    params = {"language": LANGUAGE, **params}
    if _valid(ACCESS_TOKEN):
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
    elif _valid(API_KEY):
        params["api_key"] = API_KEY
    else:
        raise HTTPException(500, "TMDB 키가 .env에 설정되지 않았습니다.")
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{TMDB_BASE}{path}", params=params, headers=headers)
    if r.status_code != 200:
        raise HTTPException(r.status_code, r.json().get("status_message", "TMDB error"))
    return r.json()


@app.get("/api/home")
async def home():
    """메인 화면용 섹션 묶음"""
    sections = [
        ("trending", "지금 뜨는 콘텐츠", "/trending/all/week"),
        ("popular_movie", "인기 영화", "/movie/popular"),
        ("popular_tv", "인기 시리즈", "/tv/popular"),
        ("top_rated", "평점 높은 영화", "/movie/top_rated"),
        ("now_playing", "극장 상영작", "/movie/now_playing"),
        ("upcoming", "공개 예정", "/movie/upcoming"),
    ]
    result = []
    for key, title, path in sections:
        data = await tmdb(path, region="KR")
        result.append({"key": key, "title": title, "items": data.get("results", [])})
    return {"sections": result}


@app.get("/api/{media}/{item_id}")
async def detail(media: str, item_id: int):
    if media not in ("movie", "tv"):
        raise HTTPException(400, "media must be movie or tv")
    return await tmdb(f"/{media}/{item_id}", append_to_response="credits,videos")


@app.get("/api/search")
async def search(q: str = Query(..., min_length=1)):
    return await tmdb("/search/multi", query=q)

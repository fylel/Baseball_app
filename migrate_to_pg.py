"""
SQLite → PostgreSQL 遷移腳本（2018-2025 資料）

使用方式：
  1. 先到 Railway 建立 PostgreSQL 服務，複製 DATABASE_URL
  2. 執行：
     $env:DATABASE_URL="postgresql://user:pass@host:port/dbname"
     python migrate_to_pg.py
"""

import os
import sys
import sqlite3
import pandas as pd
from sqlalchemy import create_engine, text

SQLITE_PATH = os.path.join(os.path.dirname(__file__), "backends", "baseball_data.db")
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("❌ 請先設定環境變數 DATABASE_URL")
    print('   範例：$env:DATABASE_URL="postgresql://..."')
    sys.exit(1)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"🔗 來源：{SQLITE_PATH}")
print(f"🔗 目標：{DATABASE_URL[:40]}...")

sqlite_conn = sqlite3.connect(SQLITE_PATH)
pg_engine = create_engine(DATABASE_URL)

# 先建立 table
CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS pitches (
    game_date    TEXT,
    pitch_type   TEXT,
    balls        INTEGER,
    strikes      INTEGER,
    stand        TEXT,
    p_throws     TEXT,
    on_1b        INTEGER,
    on_2b        INTEGER,
    on_3b        INTEGER,
    pitcher_role TEXT,
    inning       REAL,
    release_speed REAL,
    plate_x      REAL,
    plate_z      REAL,
    description  TEXT,
    type         TEXT,
    zone         INTEGER,
    player_name  TEXT,
    pitcher      INTEGER,
    batter       INTEGER,
    events       TEXT,
    is_out       INTEGER
);
"""

CREATE_INDEXES = [
    "CREATE INDEX IF NOT EXISTS idx_pname ON pitches(player_name);",
    "CREATE INDEX IF NOT EXISTS idx_gdate ON pitches(game_date);",
    "CREATE INDEX IF NOT EXISTS idx_ptype ON pitches(pitch_type);",
    "CREATE INDEX IF NOT EXISTS idx_count ON pitches(balls, strikes);",
    "CREATE INDEX IF NOT EXISTS idx_pitcher ON pitches(pitcher);",
    "CREATE INDEX IF NOT EXISTS idx_batter ON pitches(batter);",
]

print("📋 建立 PostgreSQL table...")
with pg_engine.connect() as conn:
    conn.execute(text(CREATE_TABLE))
    conn.commit()

# 分批讀取並寫入（每批 50,000 筆，避免記憶體不足）
CHUNK_SIZE = 50_000
YEARS = list(range(2018, 2026))
year_filter = ", ".join(f"'{y}'" for y in YEARS)
query = f"SELECT * FROM pitches WHERE substr(game_date, 1, 4) IN ({year_filter})"

print(f"📦 開始遷移 2018-2025 資料（每批 {CHUNK_SIZE:,} 筆）...")
total = 0

for chunk in pd.read_sql(query, sqlite_conn, chunksize=CHUNK_SIZE):
    chunk.to_sql("pitches", pg_engine, if_exists="append", index=False, method="multi")
    total += len(chunk)
    print(f"  ✅ 已遷移 {total:,} 筆")

sqlite_conn.close()

print("📋 建立索引...")
with pg_engine.connect() as conn:
    for idx_sql in CREATE_INDEXES:
        conn.execute(text(idx_sql))
    conn.commit()

print(f"🎉 完成！共遷移 {total:,} 筆資料到 PostgreSQL。")

import os
import pandas as pd
from sqlalchemy import create_engine, text
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pybaseball import playerid_reverse_lookup
import uvicorn

# 支援 Railway (postgres://) 和本機 SQLite
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'baseball_data.db')}"
)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

batter_name_map = {}
TABLE_NAME = "pitches"


@app.on_event("startup")
async def startup_event():
    global batter_name_map
    try:
        with engine.connect() as conn:
            u_ids = pd.read_sql(
                text(f"SELECT DISTINCT batter FROM {TABLE_NAME} WHERE batter IS NOT NULL"),
                conn
            )['batter'].tolist()
        if u_ids:
            lookup_df = playerid_reverse_lookup(u_ids, key_type='mlbam')
            for _, row in lookup_df.iterrows():
                batter_name_map[str(row['key_mlbam'])] = f"{row['name_last'].title()}, {row['name_first'].title()}"
    except Exception as e:
        print(f"啟動出錯: {e}")


@app.get("/api/batters")
async def get_batters():
    return sorted([{"id": k, "name": v} for k, v in batter_name_map.items()], key=lambda x: x['name'])


@app.get("/api/pitchers")
async def get_pitchers():
    try:
        with engine.connect() as conn:
            df = pd.read_sql(
                text(f"SELECT DISTINCT pitcher, player_name FROM {TABLE_NAME} WHERE player_name IS NOT NULL"),
                conn
            )
        return [{"id": str(int(row['pitcher'])), "name": row['player_name']} for _, row in df.iterrows()]
    except:
        return []


@app.get("/api/pitches")
async def get_pitches(
    year: str = None,
    pitcherId: str = None,
    batterId: str = None,
    pitcherRole: str = "All",
    zone: str = None,
    pitchType: str = None,
    balls: str = None,
    strikes: str = None
):
    try:
        y = str(year).strip() if year else "ALL"
        p_id = str(pitcherId).strip() if pitcherId else ""
        b_id = str(batterId).strip() if batterId else ""
        role = str(pitcherRole).strip() if pitcherRole else "All"
        z = str(zone).strip() if zone else ""
        pt = str(pitchType).strip() if pitchType else ""
        b = str(balls).strip() if balls else ""
        s = str(strikes).strip() if strikes else ""

        null_vals = ["", "none", "null", "undefined", "all"]

        if p_id.lower() in null_vals and b_id.lower() in null_vals:
            return []

        conds = []

        if y.upper() != "ALL":
            conds.append(f"substr(game_date, 1, 4) = '{y}'")
        if p_id.lower() not in null_vals and p_id != "0":
            conds.append(f"pitcher = {p_id}")
        if b_id.lower() not in null_vals and b_id != "0":
            conds.append(f"batter = {b_id}")
        if role.lower() not in null_vals:
            conds.append(f"pitcher_role = '{role}'")

        if z and z.lower() not in null_vals:
            valid_zones = [int(x) for x in z.split(',') if x.strip().isdigit()]
            if valid_zones:
                zones_str = ", ".join(map(str, valid_zones))
                conds.append(f"zone IN ({zones_str})")

        if pt and pt.lower() not in null_vals:
            valid_pts = [f"'{x.strip()}'" for x in pt.split(',') if x.strip()]
            if valid_pts:
                pt_str = ", ".join(valid_pts)
                conds.append(f"pitch_type IN ({pt_str})")

        if b and b.lower() not in null_vals:
            conds.append(f"balls = {b}")
        if s and s.lower() not in null_vals:
            conds.append(f"strikes = {s}")

        where = " WHERE " + " AND ".join(conds) if conds else ""
        query = f"SELECT * FROM {TABLE_NAME}{where} ORDER BY game_date DESC"
        print(f"DEBUG SQL: {query}")

        with engine.connect() as conn:
            df = pd.read_sql(text(query), conn)

        if df.empty:
            return []

        col_map = {
            'pitch_type': 'pitchType',
            'release_speed': 'speed',
            'plate_x': 'plateX',
            'plate_z': 'plateZ',
            'is_out': 'isOut'
        }
        for old, new in col_map.items():
            if old in df.columns:
                df[new] = df[old]

        records = df.to_dict(orient='records')
        return [{k: (None if pd.isna(v) else v) for k, v in row.items()} for row in records]

    except Exception as e:
        print(f"❌ API 錯誤: {e}")
        return []


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))

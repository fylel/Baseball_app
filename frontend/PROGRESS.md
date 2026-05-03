# PitchLab 進度記錄

## 專案基本資訊
- **前端路徑**：`c:\Users\黃\Desktop\new_baseball_app_frontend-main`
- **後端路徑**：`c:\Users\黃\Desktop\new_baseball_app_backend-main`
- **框架**：React + Vite
- **UI 套件**：Ant Design（深色主題）
- **字體**：Barlow Condensed、JetBrains Mono、Bebas Neue（新加）

## 已完成的事

### Landing Page
- 新建 `src/pages/LandingPage.jsx`
- 背景圖：`public/hero-bg.jpg`（棒球打者揮棒）
- 字體：Bebas Neue（大字）
- 大字底部：**N.J.D**（橙色半透明，有緩慢漂移動畫）
- 標語：**PREDICT THE PLAY. WIN SMARTER.**
- 副標：Analyze every pitch with MLB Statcast data.
- 進入頁面時文字從下滑入動畫
- 離開時整頁向上滑走動畫

### Navbar（所有子頁面共用）
- 新建 `src/components/PageNavbar.jsx`
- 左邊：PitchLab logo（點擊回 Landing Page）
- 右邊三個連結：Features、Historical Data、Pitch Prediction
- 當前頁面連結會變橙色並加底線

### 路由（React Router）
- `/` → Landing Page
- `/features` → Features（空佔位頁）
- `/historical-data` → 現有數據分析頁
- `/prediction` → Pitch Prediction（空佔位頁）

### 頁面
- `src/pages/FeaturesPage.jsx` — 空，顯示 "Coming soon"
- `src/pages/HistoricalDataPage.jsx` — 原本的數據分析功能移到這裡
- `src/pages/PitchPredictionPage.jsx` — 空，顯示 "Coming soon"

### App.jsx
- 改成只負責 Router，所有邏輯移到各自頁面

## 下次要做的事
- [ ] 部署到 Vercel（前端）讓別人可以看
- [ ] Features 頁面內容
- [ ] Pitch Prediction 頁面內容（等後端預測功能完成）
- [ ] 其他調整（動畫、樣式等）

## 啟動方式
```bash
cd c:\Users\黃\Desktop\new_baseball_app_frontend-main
npm run dev
```
開啟 http://localhost:5173/

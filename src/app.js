const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// 미들웨어 설정
app.use(cors()); // 프론트엔드 도메인 통신 허용
app.use(express.json()); // 클라이언트가 보낸 JSON 데이터 해석 허용

// 라우터 불러오기
const itemRouter = require("./routes/items");
const coordinationRouter = require("./routes/coordinations");
const userRouter = require("./routes/users");

// 기본 테스트 라우트
app.get("/", (req, res) => {
  res.send("Fashion Backend Server is running!");
});

// API 경로에 라우터 연결
app.use("/api/items", itemRouter);
app.use("/api/coordinations", coordinationRouter);
app.use("/api/users", userRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 랭킹 조회 기능
const rankingRouter = require("./routes/rankings");
app.use("/api/rankings", rankingRouter);

// node.js express mysql2 pool dotenv - 구글링(티스토리)

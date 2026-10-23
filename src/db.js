const mysql = require("mysql2/promise");
require("dotenv").config(); // .env 파일의 환경 변수를 불러오는 코드

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // 연결 초과 시 빈 자리 생길 때까지 대기
  connectionLimit: 10, // 동시 최대 연결 수 (10개 제한)
  queueLimit: 0, // 대기열 개수 제한 없음 (0 = 무제한)
});

module.exports = pool; // 다른 파일에서 불러와 쓸 수 있게 내보내기

// node.js express mysql2 pool dotenv - 구글링(티스토리)
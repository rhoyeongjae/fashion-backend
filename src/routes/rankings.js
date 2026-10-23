const express = require("express");
const router = express.Router();
const db = require("../db");

// 저ㅁ수 높은 순 - Top 5 조회
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT coordination_id, user_id, ai_score, ai_feedback, coordination_code
        FROM coordinations
        ORDER BY ai_score DESC
        LIMIT 5`;
    const [rows] = await db.query(sql);
    res.status(200).json({ succes: true, data: row });
  } catch (error) {
    console.error("랭키 조회 오류: ", error);
    res.status(500).json({ succes: false, message: "랭킹 조회 실패" });
  }
});

module.exports = router;

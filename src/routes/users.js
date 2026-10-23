const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /api/users/login - 유저 확인 및 없으면 자동 가입
router.post("/login", async (req, res) => {
  const { user_id, nickname } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "user_id가 필요합니다." });
  }

  try {
    // 기존 유저인지 확인
    const [existing] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (existing.length > 0) {
      // 이미 가입된 유저
      return res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: existing[0],
      });
    }

    // 신규 유저 생성
    const sql = "INSERT INTO users (user_id, nickname) VALUES (?, ?)";
    await db.query(sql, [user_id, nickname || "패션피플"]);

    res.status(201).json({
      success: true,
      message: "신규 유저 회원가입 완료",
      user: { user_id, nickname: nickname || "패션피플" },
    });
  } catch (error) {
    console.error("유저 처리 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

module.exports = router;

// node.js express mysql2 pool dotenv - 구글링(티스토리)

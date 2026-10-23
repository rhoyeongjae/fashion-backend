const express = require("express");
const router = express.Router();
const db = require("../db");

// AI 피드백 생성 헬퍼 함수
function generateAIFeedback(items) {
  const score = Math.floor(Math.random() * 26) + 75;

  const feedbacks = [
    "트렌디하면서도 색상 조합이 완벽한 룩이네요. 당신은 혹시 패셔니스타 ?",
    "개성이 돋보이는 개성파 스트릿 패션이네요. 유후~",
    "깔끔하고 과하지 않은 데일리 코디네요. 짱입니다 ! !",
    "시선을 사로잡는 화려하고 임팩트 있는 조합입니다 ! !",
    "시즌 분위기에 딱 맞는 센스 있는 코디네요. 역시는 역시 ! !",
  ];

  const randomComment = feedbacks[Math.floor(Math.random() * feedbacks.length)];

  return {
    score,
    feedback: `[AI 점수: ${score}점] ${randomComment}`,
  };
}

// 옷 정보 저장 + AI 피드백 생성 + DB 저장
router.post("/", async (req, res) => {
  const { user_id, items } = req.body;

  try {
    // 1. AI 피드백 및 점수 자동으로 뽑아냄
    const aiResult = generateAIFeedback(items);

    // 2. 6자리 고유 공유 코드 생성
    const coordination_code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    const sqlCoord = `
      INSERT INTO coordinations (user_id, coordination_code, ai_score, ai_feedback)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.query(sqlCoord, [
      user_id || "guest",
      coordination_code,
      aiResult.score,
      aiResult.feedback,
    ]);

    const coordination_id = result.insertId;

    // 4. 두 개의 서로 다른 테이블 정보를 서로 짝지어 연결해 주는 연결고리 테이블
    if (items && Array.isArray(items) && items.length > 0) {
      const sqlItem = `
        INSERT INTO coordination_items (coordination_id, item_id)
        VALUES ?
      `;
      const values = items.map((itemId) => [coordination_id, itemId]);
      await db.query(sqlItem, [values]);
    }

    res.status(201).json({
      success: true,
      message: "코디 및 AI 피드백 저장 완료",
      data: {
        coordination_id,
        coordination_code,
        ai_score: aiResult.score,
        ai_feedback: aiResult.feedback,
      },
    });
  } catch (error) {
    console.error("코디 및 AI 피드백 저장 오류:", error);
    res.status(500).json({ success: false, message: "저장 실패" });
  }
});

// 공유 코드로 결과 및 입은 옷 목록 조회
router.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const sql = `
      SELECT c.*, GROUP_CONCAT(ci.item_id) as item_ids
      FROM coordinations c
      LEFT JOIN coordination_items ci ON c.coordination_id = ci.coordination_id
      WHERE c.coordination_code = ?
      GROUP BY c.coordination_id
    `;
    const [rows] = await db.query(sql, [code]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "해당 코드를 찾을 수 없습니다." });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("조회 오류:", error);
    res.status(500).json({ success: false, message: "조회 실패" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/items - 전체 아이템 조회 또는 카테고리별 조회 (?category=hair)
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    let sql = "SELECT item_id, category, item_name FROM items";
    let params = [];

    if (category) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    const [rows] = await db.query(sql, params);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("아이템 조회 오류:", error);
    res.status(500).json({ success: false, message: "아이템 목록 조회 실패" });
  }
});

module.exports = router;

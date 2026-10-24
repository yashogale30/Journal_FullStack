const express = require("express");
const service = require("../services/journalService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const user = await service.createUser(req.body.username);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

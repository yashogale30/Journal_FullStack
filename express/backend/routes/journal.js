const express = require("express");
const service = require("../services/journalService");

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  try {
    const entries = await service.getEntriesByUsername(req.params.username);
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

router.post("/:username", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const entry = await service.createEntry(req.params.username, title, content);
    if (!entry) return res.status(404).json({ error: "User not found" });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const entry = await service.updateEntry(req.params.id, title, content);
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await service.deleteEntry(req.params.id);
    res.json({ deleted: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
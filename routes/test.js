const router = require("express").Router();
const Partner = require("../models/Partner");
const Test = require("../models/Test");
const jwt = require("jsonwebtoken");
router.post("/admin/addrafferhistory", async (req, res) => {
  const newHistory = new Test(req.body);
  try {
    const data = await newHistory.save();
    res.status(200).json("Data Added success");
  } catch (err) {
    res.status(500).json("cant sent data");
  }
});
router.get("/userrafferhistory/:id", async (req, res) => {
  const rafferid = req.params.id;
  try {
    const data = await Test.find({ rafferid });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json("someting wrong");
  }
});

module.exports = router;

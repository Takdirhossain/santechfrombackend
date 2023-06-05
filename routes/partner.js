const router = require("express").Router();
const Partner = require("../models/Partner");
const verify = require("../verifytoken");
router.get("/admin/partnerinfo", async (req, res) => {
  try {
    const data = await Partner.find({});
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

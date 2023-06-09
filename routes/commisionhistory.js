const router = require("express").Router();
const Commisionhistory = require("../models/CommissionRaffer")
//raffer history
router.post("/admin/commisionhistory", async (req, res) => {
  const newcommision = new Commisionhistory(req.body);
  try {
    const data = await newcommision.save();
    res.status(200).json("Data Added success");
  } catch (err) {
    res.status(500).json("something wrong")
  }
});
router.get("/commisionhistory/:id", async (req, res) => {
    const rafferid = req.params.id;
    try {
      const data = await Commisionhistory.find({ rafferid });
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json("someting wrong");
    }
  });
module.exports = router;

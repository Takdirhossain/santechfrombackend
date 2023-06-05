const router = require("express").Router();
const Partner = require("../models/Partner");
const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken");

router.post("/partnerlogin", async (req, res) => {
  try {
    const user = await Partner.findOne({ partnerId: req.body.partnerId })
    !user && res.status(401).json("Cant find the user")
    const accesstoken = jwt.sign({id:user._id}, process.env.SECRET_KEY, {expiresIn:"5d"})
    res.status(200).json({user, accesstoken})
  } catch (err) {
    res.status(500).json("Cant find user")
  }
});
router.post("/adminreg", async (req, res) => {
  const newAdmin = new Admin(req.body);
  try {
    const saveAdmin = await newAdmin.save()
    res.status(200).json(`Data update successful ${saveAdmin}`)
  } catch (err) {
    res.status(500).json(err)
  }
});
router.post("/adminlogin", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password });
    if (!admin) {
      return res.status(401).json("Can't find the admin");
    }
    const accessToken = jwt.sign({ id: admin._id }, "testkey", { expiresIn: "5d" });
    res.status(200).json({ admin, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports =router
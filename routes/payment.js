const router = require("express").Router();
const Paymentschema = require("../models/Payment");

router.post("/userpayment", async (req, res) => {
  const paymentInfo = new Paymentschema(req.body);
  try {
    const data = await paymentInfo.save();
    res.status(200).json("Payment method successfull added");
    console.log(data);
  } catch (err) {
    res.status(500).json("cant add payment");
  }
});
router.get("/payment/:id", async(req, res)=> {
    const rafferid = req.params.id 
    try{
        const data = await Paymentschema.find({"payment.rafferid":rafferid})
        res.status(200).json(data)
    }catch(err){
        res.json("cant find ")
    }
})
module.exports = router;

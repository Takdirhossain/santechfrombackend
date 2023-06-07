const router = require("express").Router();
const Message = require("../models/Messgae");
router.post("/admin/message", async (req, res) => {
    const message = new Message(req.body)
  try {
    const data = await message.save();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json("cant added data");
  }
});
router.get("/message/:id", async(req, res)=> {
    const rafferid = req.params.id 
    try{
        const data = await Message.find({rafferid})
        res.status(200).json(data)
    }catch(err){
        res.status(500).json("cant find messgae")
    }
})
module.exports = router;
const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
app.use(cors());
app.use(express.json());
const handlebars = require("handlebars");
const fs = require("fs");

//stored pdf file name for mailing
let filename;
// Multer storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      (filename = file.fieldname + Date.now() + "-" + file.originalname)
    );
  },
});
const upload = multer({ storage: storage }).single("file");

//nodemailer config setup
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "takdirhossain35@gmail.com",
    pass: "xnfquozhyaycwydo",
  },
});

//registation form
app.post("/registration", (req, res) => {
  const { email, partnerId } = req.body;

  //handalebers for email templates
  const emailSource = fs.readFileSync("registration.html", "utf-8");
  const emailTemplate = handlebars.compile(emailSource);
  const emailHtml = emailTemplate({
    partnerId: partnerId,
  });

  let message = {
    from: "takdirhossain35@gmail.com", // sender address
    to: `${email}, villegasemanuel23@gmail.com`, // list of receivers
    subject: "Registration Success", // Subject line
    html: emailHtml,
  };
  transporter
    .sendMail(message)
    .then((info) => {
      return res.send({
        partnerId,
      });
    })
    .catch((err) => {
      return res.send("someting wrong");
    });
});

//subscription form
app.post("/subscription", (req, res) => {
  const { email, pass, Package, visits, date } = req.body;

  const emailSource = fs.readFileSync("email.html", "utf-8");
  const emailTemplate = handlebars.compile(emailSource);
  const emailHtml = emailTemplate({
    pass: pass,
    email: email,
    Package: Package,
    visits: visits,
    date: date,
  });

  let message = {
    from: "takdirhossain35@gmail.com",
    to: `${email}, villegasemanuel23@gmail.com`,
    subject: "Subscription success",
    html: emailHtml,
  };
  transporter
    .sendMail(message)
    .then((info) => {
      return res.send({
        msg: "you should receive an email",
      });
    })
    .catch((err) => {
      return res.send("someting wrong");
    });
});

//career form
app.post("/career", upload, async (req, res) => {
  const {
    name,
    email,
    country,
    state,
    city,
    experience,
    positins,
    potisionType,
    gender,
    dateofbirth,
    Experienced,
    ctc,
    file,
  } = req.body;
  const { filename, path } = req.file;
  console.log(name, email, filename, path);

  // create reusable transporter object using the default SMTP transport

  let message = {
    from: email, // sender address
    to: "villegasemanuel23@gmail.com", // list of receivers
    subject: "Job Applications", // Subject line
    text: `
    New Application arrived
    Country: ${country}
    State: ${state}
    City: ${city}
    Experience: ${experience}
    Position: ${positins}
    PotisionType: ${potisionType}
    Name: ${name}
    Email: ${email}
    Gender: ${gender}
    Date of birth: ${dateofbirth}
    Experienced: ${Experienced}
    Expect CTC: ${ctc}
    `, // plain text body
    attachments: [
      {
        filename: filename,
        path: `./files/${filename}`,
        contentType: "application/pdf",
      },
    ],
  };
  transporter
    .sendMail(message)
    .then((info) => {
      return res.send({
        msg: "you should receive an email",
      });
    })
    .catch((err) => {
      return res.send("someting wrong");
    });
});

app.listen(5000, () => {
  console.log("server is running");
});

const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const port = 5000;
const env = require("dotenv");

const Partner = require("./models/Partner");
const auth = require("./routes/auth")
const partner = require("./routes/partner")
const commisionhistory = require("./routes/commisionhistory")
const test = require("./routes/test")
const payment = require("./routes/payment")
const message = require("./routes/message")
env.config();
app.use(express.json());
const handlebars = require("handlebars");
const fs = require("fs");
const Razorpay = require("razorpay");
const stripe = require("stripe")(
  "sk_test_51N5av4SAHh9BgXprWRwEyrRHMHfgwAQhN3Y1iP3Zy9xpK9kg25JNGDVPWh834h9VM4bQLhMgTB8RV8EEQEH0BUgH00tK5jFa3C"
);

app.use(express.json());
app.use(cors());

//mongodb connection

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database is connected");
    app.listen(port, () => {
      console.log(`server is running ${port}`);
    });
  });

const razorpay = new Razorpay({
  key_id: "rzp_test_WjQrOkgltnhkbY",
  key_secret: "m4Mrb5DiykHS7xUeWoDaVhv4",
});

//routes
app.use("/auth", auth)
app.use("/auth", partner)
app.use("/auth", test)
app.use("/auth", commisionhistory)
app.use("/auth", payment)
app.use("/auth", message)


app.post("/order", async (req, res) => {
  const { amount, fulladdress, password, distance, permission, name, email } =
    req.body;
  const currency = "INR";
  const options = {
    amount: amount,
    currency: currency,

    receipt: "order_rcptid_11",
    payment_capture: 1,
  };
  razorpay.orders.create(options, function (err, order) {
    if (err) {
      return res.send({ message: "server error" });
    }
    return res.send({ message: "order created", data: order });
  });
});

app.post("/stripe", async (req, res) => {
  const {
    amount,
    fulladdress,
    password,
    distance,
    permission,
    currency,
    name,
    email,
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Product Name",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      cancel_url: "http://localhost:3000/regindivudal",
    });

    res.json({ id: session.id });

    if (session.status === "open") {
      const emailSource = fs.readFileSync(
        "./templete/induvidual/index.html",
        "utf-8"
      );
      const emailTemplate = handlebars.compile(emailSource);
      const emailHtml = emailTemplate({
        email: email,
        password: password,
        amount: amount,
      });

      let message = {
        from: "takdirhossain35@gmail.com", // sender address
        to: `${email}`, // list of receivers
        subject: "Registration Success", // Subject line
        html: emailHtml,
      };
      transporter
        .sendMail(message)
        .then((info) => {})
        .catch((err) => {});
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

app.post("/another", (req, res) => {
  const { name } = req.body;
  console.log(name);
});

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
app.post("/registration", async (req, res) => {
  const newPartner = new Partner(req.body);
  console.log(req.body);
  const {
    name,
    country,
    state,
    city,
    businessName,
    Businesscate,
    email,
    partnerId,
  } = req.body;
try{
const savePartner = await newPartner.save()
res.status(200).json(partnerId)
console.log(partnerId);
  //handalebers for email templates
  const emailSource = fs.readFileSync(
    "./templete/regtemplete/index.html",
    "utf-8"
  );
  const emailTemplate = handlebars.compile(emailSource);
  const emailHtml = emailTemplate({
    partnerId: partnerId,
  });

  let message = {
    from: "takdirhossain35@gmail.com", // sender address
    to: `${email}`, // list of receivers
    subject: "Registration Success", // Subject line
    html: emailHtml,
  };
  let messageadmin = {
    from: "takdirhossain35@gmail.com", // sender address
    to: `iamtakdir619@gmail.com`, // list of receivers
    subject: "Registration Success", // Subject line
    html: `
    New Partner Registation success
    name: ${name},
    country: ${country}
    state: ${state},
    City: ${city},
    businessName: ${businessName},
    Business Category:  ${Businesscate}
    `,
  };
  transporter
    .sendMail(message)
    .then((info) => {
      return res.send({
        partnerId,
      });
    })
    .catch((err) => {
      
    });
  transporter
    .sendMail(messageadmin)
    .then((info) => {
      return res.send({
        partnerId,
      });
    })
    .catch((err) => {
      
    });
}catch(err){
res.status(500).json("cant add data")
}

});

//subscription form
app.post("/subscription", (req, res) => {
  const { email, pass, Package, visits, date } = req.body;

  const emailSource = fs.readFileSync(
    "./templete/partnertemplete/index.html",
    "utf-8"
  );
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
    to: `${email}`,
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
    to: "iamtakdir619@gmail.com", // list of receivers
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

app.get("/", (req, res) => {
  res.send("Our server is running");
});

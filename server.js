const express = require("express");
const path = require("node:path");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(file);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

let connectToMDB = async () => {
  try {
    await mongoose.connect(process.env.dbPath);
    console.log("Connected successfully");
  } catch (err) {
    console.log("something went wrong");
  }
};

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "./client/build")));

let userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profilePic: String,
});

let User = new mongoose.model("user", userSchema);

app.post("/validateLogin", upload.none(), async (req, res) => {
  console.log(req.body);

  let userDetails = await User.find().and({ email: req.body.email });

  console.log(userDetails);

  if (userDetails.length == 0) {
    res.json({ status: "failure", msg: "User doesnot exist." });
  } else {
    let result = await bcrypt.compare(
      req.body.password,
      userDetails[0].password
    );

    console.log(result);

    if (result == true) {
      let encryptedCredentials = jwt.sign(
        { email: userDetails[0].email, password: userDetails[0].password },
        "Raghu"
      );

      console.log(encryptedCredentials);

      console.log(userDetails[0]);

      res.json({
        status: "success",
        msg: "Valid Credentials",
        token: encryptedCredentials,
        data: userDetails[0],
      });
    } else {
      res.json({ status: "failure", msg: "Incorrect password." });
    }
  }
});

app.post("/validateToken", upload.none(), async (req, res) => {
  console.log(req.body.token);

  try {
    let decryptedCredentials = jwt.verify(req.body.token, "Raghu");

    let userDetails = await User.find().and({
      email: decryptedCredentials.email,
    });

    if (userDetails.length > 0) {
      if (userDetails[0].password == decryptedCredentials.password) {
        res.json({
          status: "success",
          msg: "Valid Credentials",
          data: userDetails[0],
        });
      }
    } else {
      res.json({
        status: "failure",
        msg: "Invalid Token",
      });
    }
  } catch (err) {
    res.json({
      status: "failure",
      msg: "Invalid Token",
    });
  }
});

app.post("/signup", upload.single("profilePic"), async (req, res) => {
  console.log("we have received the request from client");
  console.log(req.file);
  console.log(req.body);

  let hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log(req.body.password);
  console.log(hashedPassword);

  let userDetails = await User.find().and({ email: req.body.email });

  if (userDetails.length > 0) {
    res.json({ status: "failure", msg: "User already exists" });
  } else {
    try {
      let newUser = new User({
        firstName: req.body.fn,
        lastName: req.body.ln,
        email: req.body.email,
        password: hashedPassword,
        profilePic: req.file.path,
      });

      await User.insertMany([newUser]);
      res.json({ status: "success", msg: "User Created Successfully" });
    } catch (err) {
      res.json({ status: "failure", msg: err });
    }
  }
});

app.patch("/udpateDetails", upload.single("profilePic"), async (req, res) => {
  console.log(req.body);

  await User.updateMany(
    { email: req.body.email },
    {
      firstName: req.body.fn,
      lastName: req.body.ln,
      password: req.body.password,
      profilePic: req.file.path,
    }
  );
  res.json(["collected updated data"]);
});

app.delete("/deleteUser", upload.none(), async (req, res) => {
  try {
    let deletedUser = await User.deleteMany({ email: req.body.email });
    res.json({ status: "success", msg: "Deleted user successfully" });
  } catch (err) {
    res.json(err);
  }
});

app.listen(process.env.port, () => {
  console.log("Listening to port 1234");
});

connectToMDB();

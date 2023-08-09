
require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000

const path = require("path");


const Register = require("./src/models/registers");
const statick_path = path.join(__dirname, "/public");

mongoose.set('strictQuery', false);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(statick_path));
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/register", async (req, res) => {
  try {
    const password = req.body.passwordd;
    const confpassword = req.body.confpassword;

    if (password === confpassword) {
      const registerClient = new Register({
        email: req.body.emailvalue,
        password: req.body.passwordd,
        confpassword: req.body.confpassword,
      });
      const registered = await registerClient.save();
      use = res.redirect("/")
    } else {
      res.send("password are not matching");
    }
  }catch (error) {
    res.status(400).send(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.emailvaluelogin;
    const password = req.body.passworddlogin;
    console.log(`email ${email}, are correct and password ${password}`);
    const userEmail = await Register.findOne({ email });
    if (userEmail.password === password) {
        use = res.redirect("/")
    } else {
      res.send("Password are not matching conditions");
    }
  } catch (error) {
    res.status(400).send("Invalid email");
  }
});
//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})
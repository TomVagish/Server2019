const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyparser = require("body-parser");
const checkAuth = require("../middleware/check-Token-Valid");
// mongoose schema
const User = require("./models/user");
// md5 create hash to userpassword
const md5 = require("md5");

// create json web token to logged-in users
const jwt = require("jsonwebtoken");

// validation check
const { check, validationResult } = require("express-validator/check");


router.use(bodyparser());
router.use(cors());



// register route
router.post(
  "/register",
  [
    // username must be an email
    check("Email").isEmail(),
    // password must be at least 5 chars long
    check("Password").isLength({ min: 5 })
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = new User({
      userEmail: req.body.Email,
      userName: req.body.Username,
      userPassword: md5(req.body.Password)
    });

    user
      .save()
      .then(() => {
        res.status(200).json({
          message: "signup success ! "
        });
      })
      .catch(err => {
        return res.status(500).json({
          message: "Email Or Username Already Exist !"
        });
      });
  }
);

// login route
router.post("/login", (req, res, next) => {
 

  User.findOne({ userEmail: req.body.Email }).then(user => {
    if (!user) {
      return res.status(401).json({ message: "User Not Exist !" });
    }



    // check if the passwords is equal after  MD5-hash !
    if (md5(req.body.Password) == user.userPassword) {
      // Create token when the user success to login!
      const token = jwt.sign(
        {
          email: user.userEmail,
          userId: user._Id
        },
        process.env.JWT_KEY,
        { expiresIn: "2h" }
      );
      res.status(200).json({ token: token,username:user.userName });
      req.session.userId = user._Id;
    } else {
      return res.status(400).json({ message: "WRONG PASSWORD !" });
    }
  });
});

module.exports = router;

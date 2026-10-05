const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET || "adnanisdmwad";

// simple POST route
// route 1 //no login required "/api/auth/createuser"
router.post(
  "/createuser",
  [
    //use express validator 
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phoneNumber", "Enter a valid phone number").isLength({ min: 10 }),
    body("address", "Enter a valid address").isLength({ min: 5 }),
    body("city", "Enter a valid city").isLength({ min: 2 }),
    body("zipCode", "Enter a valid ZIP code").isLength({ min: 5 }),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // find the validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check whether the user with this email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      //create a sequre password
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);

      // decide role: first user becomes admin for bootstrapping
      const usersCount = await User.countDocuments();
      const role = usersCount === 0 ? 'admin' : 'user';

      // create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        city: req.body.city,
        zipCode: req.body.zipCode,
        password: secPass,
        role,
      });

      //use jwt
      const data = {
        user: {
          id: user.id,
        },
      };
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
   
// Authenticate a user
// Route 2 // no login required "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    // check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // compare password
  const passcompare = await bcrypt.compare(password, user.password);
      if (!passcompare) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct credentials" });
      }

      // generate JWT
      const data = {
        user: {
          id: user.id,
        },
      };
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
)


//Route 3 get loginuser details post "/api/auth/getuser" .ogin required
//pass middlware
router.post(
  "/getuser",fetchuser,async (req, res) => {

try {
    const userId = req.user.id;
    const loggedInUser = await User.findById(userId).select("-password");
    res.send(loggedInUser);

} 
catch (error) {
  console.error(error.message);
      res.status(500).send("Internal Server Error");
   }
  })



module.exports = router;
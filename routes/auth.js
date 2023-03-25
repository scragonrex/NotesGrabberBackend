const express = require('express');
const mongoose = require("mongoose");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const router = express.Router();

const JWT_SECRET = "MyPathIsAlone$";

const { body, validationResult } = require('express-validator');

// ROUTE 1: Creating a user using POST:"/api/auth/", Doesn't require Authentication
router.post('/createuser', [
   body('name', 'Enter a valid name').isLength({ min: 3 }),
   body('password', 'Password must be atleast of 5 characters').isLength({ min: 5 }),
   body('email', 'Enter a valid email').isEmail()]
   , async (req, res) => {
      let success =false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({success, errors: errors.array() });
      }

      try {

         let user = await User.findOne({ email: req.body.email });
         if (user) {
            return res.status(400).json({ success, error: "Sorry the user already exist" })
         }

         //Creating salt and  pepper
         const salt = await bcrypt.genSalt(10);

         //Generating hash code of password
         const secPass = await bcrypt.hash(req.body.password, salt);
         user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
         });

         const data = {
            user: {
               id: user.id
            }
         }
         const authToken = jwt.sign(data, JWT_SECRET);
         success=true;
         res.json({ success, authToken });
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error")
      }

   })


//ROUTE 2: Authenticate a user using POST:"/api/auth/", No login required
router.post('/login', [
   body('email', 'Enter a valid email').isLength({ min: 3 }),
   body('password', 'Password cannot be blank').exists()],
   async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
         const user = await User.findOne({ email });
         if (!user) {
            success = false;
            return res.status(400).json({ error: "Please login with correct credentials" });
         }
         const comparePass = await bcrypt.compare(password, user.password);
         if (!comparePass){
            success=false;
            return res.status(400).json({ success, error: "Please login with correct credentials" });
         }
         const data = {
            user: {
               id: user.id
            }
         }
         const authToken = jwt.sign(data, JWT_SECRET);
         success=true;
         res.json({ success, authToken });
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error")
      }
   });


//ROUTE 3: Get logged in user details using POST:"/api/auth/getuser", Login required
router.post('/getuser', fetchuser,
   async (req, res) => {
      try {
         const userId = req.user.id;
         const user = await User.findById(userId).select("-password");
         res.send(user);
      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal server error")
      }
   });
module.exports = router
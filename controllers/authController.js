const User = require("../modules/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const test = (req, res) => {
  res.json("test is working");
};

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, profilePic, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, profilePic, cb) => {
    cb(null, profilePic.fieldname + "-" + Date.now() + profilePic.originalname);
  },
});

const upload = multer({ storage: storage }).single("profilePic");

const CreateIndividualAccount = async (req, res) => {
  try {
    // Handle profile picture upload
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(500).json({ error: err.message });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: "Unknown error occurred" });
      }

      // Everything went fine.
      const {
        firstName,
        lastName,
        email,
        password,
        accountType,
        history,
        bookedAppointments,
      } = req.body;
      // const profilePic = req.file.filename;

      // Check if user with the same email already exists

      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({
          error: "Email is already in used ...!",
        });
      }

      const hashedPassword = await hashPassword(password);

      // create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        // profilePic: profilePic,
        accountType,
        history,
        bookedAppointments,
      });

      res.status(201).json({ user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// LOGIN USER

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cheack if user exist
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: "No user found...!",
      });
    }

    // cheack if password match

    const match = await comparePassword(password, user.password);
    if (match) {
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          firstName: user.firstName,
          secondName: user.secondName,
          profilePic: user.profilePic,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            console.log(err); // Log the error
            return res.status(500).json({ error: "Internal Server Error" }); // Send an error response
          }
          res.cookie("token", token); // Set the token in a cookie
          res.json(user); // Send the user data in the response
        }
      );
    }

    if (!match) {
      res.json({
        error: "Password do not match...!",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// get user details

const getProfile = (req, res) => {
  const token = req.cookies.token; // Extract the token from cookies
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        console.error(err); // Log the error
        return res.status(500).json({ error: "Failed to verify token" }); // Send an error response
      }
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// forgot password

const forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.json({
        error: "User does not exist ...!",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "artontaofeeq@gmail.com", // Your Gmail email address
        pass: "wdol ldjb eazl qgyl", // Your Gmail password
      },
    });

    const mailOptions = {
      from: "artontaofeeq@gmail.com", // Sender email address
      to: email, // Recipient email address
      subject: "Reset your password",
      text: `http://localhost:3000/#ResetPassword/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send reset email" });
      } else {
        // If the email is sent successfully, return a success response
        return res.json({ status: "Success", role: user.role });
      }
    });
  });
};

// Reset password

const resetPassword = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err); // Log the error for debugging
      return res.status(400).json({
        error: "Reset password error: Invalid token or token expired",
      });
    }

    try {
      // Decode the token and verify if the user ID matches
      const decodedId = decoded.id;
      if (decodedId !== id) {
        return res.status(400).json({
          error: "Reset password error: Invalid token or user ID",
        });
      }

      // Hash the new password
      bcrypt.hash(password, 10).then((hashedPassword) => {
        // Update the user's password
        User.findByIdAndUpdate(id, { password: hashedPassword })
          .then(() => res.json({ status: "Success" }))
          .catch((updateError) => {
            console.error("Error updating password:", updateError); // Log the error for debugging
            return res.status(500).json({ error: "Failed to update password" });
          });
      });
    } catch (error) {
      console.error("Unexpected error:", error); // Log the unexpected error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

const updateUser = async (req, res) => {
  const { id, firstName, secondName } = req.body;

  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          firstName: firstName,
          secondName: secondName,
        },
      }
    );

    return res.json({ satus: "ok", data: "updated" });

    re;
  } catch (error) {
    return res.json({ status: "error", data: error });
  }
};

// Logout user
const logout = async (req, res) => {
  // Clear the token cookie by setting its value to null and setting its expiration date to a past date
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logout successful" });
};

module.exports = {
  test,
  CreateIndividualAccount,
  loginUser,
  getProfile,
  forgotPassword,
  resetPassword,
  updateUser,
  logout,
};

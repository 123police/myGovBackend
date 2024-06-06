const User = require("../modules/user");
const multer = require("multer");
const UserModel = require("../modules/user");

const test = (req, res) => {
  res.json("test is working");
};

const login = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "Unknown error occurred" });
      }

      const { email, password } = req.body;

      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({ error: "You have already login " });
      }

      const user = await User.create({
        email,
        password,
      });

      res.status(201).json({ user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + file.originalname);
  },
});

// Setup multer to handle multiple files
const upload = multer({ storage: storage }).fields([
  { name: "mediaCareCard", maxCount: 1 },
  { name: "DriverLicense", maxCount: 1 },
]);

const forgotPassword = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "Unknown error occurred" });
      }

      console.log("Request body:", req.body); // Add this line for debugging
      const { email, phoneNumber } = req.body;
      const mediaCareCard = req.files.mediaCareCard
        ? req.files.mediaCareCard[0].filename
        : null;
      const DriverLicense = req.files.DriverLicense
        ? req.files.DriverLicense[0].filename
        : null;

      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({ error: "You have already login " });
      }

      const user = await User.create({
        email,
        phoneNumber,
        mediaCareCard,
        DriverLicense,
      });

      res.status(201).json({ user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all users and their images

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    const updatedUsers = users.map((user) => ({
      ...user._doc,
      mediaCareCard: user.mediaCareCard
        ? `/public/Images/${user.mediaCareCard}`
        : null,
      DriverLicense: user.DriverLicense
        ? `/public/Images/${user.DriverLicense}`
        : null,
    }));
    res.json(updatedUsers);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  test,
  login,
  forgotPassword,
  getAllUsers,
};

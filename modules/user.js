const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Correct capitalization

const userSchema = new Schema({
  // Correct capitalization
  profilePic: String,
  email: { type: String, required: true },
  password: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  mediaCareCard: { type: String, required: false },
  DriverLicense: { type: String, required: false },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

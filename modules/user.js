const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Correct capitalization

const userSchema = new Schema({
  // Correct capitalization
  profilePic: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, required: true },
  history: { type: String, required: true },
  bookedAppointments: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

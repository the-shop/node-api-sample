import debug from "debug";
import mongoose from "mongoose";

const User = mongoose.model("User");

const logMessage = debug("engage:seed:users:message");

const admin = new User({
  _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  firstName: "Sample",
  lastName: "Admin",
  email: "admin@user.com",
  password: "aaaaaa0!",
  role: "admin"
});

const attemptSave = async (userModel) => {
  const foundModel = await User.findOne({ email: userModel.email });

  if (!foundModel) {
    logMessage("Creating user %s", userModel.name);
    return userModel.save();
  }

  logMessage("User %s already exists, skipping", foundModel.name);
  return foundModel;
};

const run = () => {
  return Promise.all([
    attemptSave(admin)
  ]);
};

export default { run };

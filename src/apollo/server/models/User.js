const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2")
const bcrypt = require("bcrypt")

if (mongoose.models.users) {
  module.exports = mongoose.model('users');
} else {

  const UserSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true },
    password: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
  }, { timestamps: true });

  UserSchema.plugin(mongoosePaginate);

  UserSchema.pre("save", async function () {
    const user = this;
    if (user.isModified("password")) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(this.password, saltRounds);
    }
  });

  UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  module.exports = mongoose.model('users', UserSchema);
}
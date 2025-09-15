const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const sellerSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    minlength: 8,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 50,
  },
  password: {
    type: String,
    required: function () {
      return this.signupType === 'self';
    },
    minlength: 8,
    maxlength: 100, // hash will be longer than 10 chars
  },
  signupType: {
    type: String,
    enum: ['self', 'google'],
    required: true,
  },
  gst: {
    type: String,
    unique: true,
    required: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  },
  pancard: {
    type: String,
    unique: true,
    required: true,
    match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  },
  address: {
    area: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 150,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    pincode: {
      type: String,
      required: true,
      match: /^\d{6}$/, // only 6 digit numbers
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 15,
  },
});

// 🔑 Pre-save hook to hash password
sellerSchema.pre('save', async function (next) {
  if (this.signupType !== 'self') return next(); // skip if google signup
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT) || 10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
sellerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Seller = mongoose.model('Seller', sellerSchema);
module.exports = Seller;

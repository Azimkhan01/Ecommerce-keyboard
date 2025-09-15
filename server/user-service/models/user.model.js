const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    min:3,
    max:50
  },
  password: {
    type: String,
    required: function (){
        return this.signupType ===  'self'
    },
    min:8,
    max:50
  },
  email: {
    unique:true,
    type: String,
    trim: true,
    min:8,
    max:50,
    required: true,
  },
  signupType: {
    type: String,
    enum: ['self', 'google'],
    required: true,
  },
});

// 🔑 Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash if password is new or modified
  if (!user.isModified('password')) return next();

  try {
    
    user.password = await bcrypt.hashSync(user.password, Number(process.env.SALT));
    next();
  } catch (err) {
    next(err);
  }
});

// Optional: method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 


const userSchema = new mongoose.Schema(
    {
      name: { 
        type: String, 
        required: true, 
        trim: true 
      },
      email: { 
        type: String, 
        required: true, 
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      },
      password: { 
        type: String, 
        required: true 
      },
      role: { 
        type: String, 
        default: 'user' 
      },
    },
    { timestamps: true }
);


userSchema.pre('save', async function (next) {
  console.log("🔥 Pre-save middleware triggered"); 
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    console.log("Generated Salt:", salt); 
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Final Hashed Password:", this.password); 
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("Candidate Password:", candidatePassword); 
    console.log("Stored Hashed Password:", this.password); 
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};


userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return user ? true : false;
};

module.exports = mongoose.model('User', userSchema);

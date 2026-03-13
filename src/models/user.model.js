const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   email:{
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^.+@(?:[\w-]+\.)+\w+$/, "Please enter a valid email address"],
    unique: [true, "Email already exists"],
},

name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
},

password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
    select: false
},
systemUser: {
    type: Boolean,
    default: false,
    immutable: true,
    select: false

},
},{
    timestamps: true
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
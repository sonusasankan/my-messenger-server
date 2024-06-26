import mongoose from 'mongoose';
import bcrypt  from 'bcryptjs';

const UserSchema = new mongoose.Schema({
   username : {
    type: String,
    required: true,
    unique: true
   },
   email : {
    type: String,
    required: true,
    unique: true
   },
   password : {
    type: String,
    required: true
   },
   profilePicture : {
    type: String,
   },
   hasFriends : {
    type: Boolean
   },
   hasMessages : {
    type: Boolean
   },
   createdAt : {
     type: Date,
     default: Date.now,
   },
   updatedAt : {
     type: Date,
     default: Date.now
   }
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model('User', UserSchema);

export default User;
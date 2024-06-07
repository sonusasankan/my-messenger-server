import mongoose from "mongoose";

const friendListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const FriendList = mongoose.model('FriendList', friendListSchema);

export default FriendList;

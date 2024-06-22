import User from '../models/user.js'
import FriendList from '../models/friendList.js';

export const createUser = async (req, res) => {
  try{
    const {username, email, password, profilePicture, createdAt, updatedAt } = req.body;
    const user = new User({ username, email, password, profilePicture, createdAt, updatedAt });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getUser = (req, res) => {
  const { userid } = req.params;

  User.findById(userid)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.message });
    });
};

export const getAllUsers = async (req, res) => {
  const currentUserId = req.user._id; // Assuming `req.user` is set by the auth middleware

  try {
    // Find the current user's friend list
    const friendList = await FriendList.findOne({ user: currentUserId });

    let excludedUserIds = []; // Initialize an array to hold excluded user IDs

    if (friendList) {
      // If friendList exists, get all friends' IDs
      excludedUserIds = friendList.friends.map(friend => friend.toString());
    }

    // Exclude the current user and users already in the friend list
    const users = await User.find({
      _id: { $ne: currentUserId, $nin: excludedUserIds }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


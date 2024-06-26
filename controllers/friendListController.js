import FriendList from '../models/friendList.js';
import Message from '../models/message.js';
import User from '../models/user.js';

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

   // Get the friend list
   const friendList = await FriendList.findOne({ user: userId }).populate({
    path: 'friends',
    select: '-password', // Exclude the password field
  });

    if (!friendList) {
      return res.status(404).json({ error: 'Friend list not found' });
    }

    // Get the friends and their most recent conversation timestamps
    const friendsWithTimestamps = await Promise.all(
      friendList.friends.map(async (friend) => {
        const recentMessage = await Message.findOne({
          $or: [
            { sender: userId, receiver: friend._id },
            { sender: friend._id, receiver: userId }
          ]
        }).sort({ timestamp: -1 }).exec();

        return {
          friend,
          lastConversation: recentMessage ? recentMessage.timestamp : new Date(0)
        };
      })
    );

    // Sort friends by the most recent conversation timestamp
    friendsWithTimestamps.sort((a, b) => b.lastConversation - a.lastConversation);

    // Extract sorted friends
    const sortedFriends = friendsWithTimestamps.map(item => item.friend);

    res.json(sortedFriends);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addFriends = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Validate userId (optional step)
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user's friend list
    let friendList = await FriendList.findOne({ user: userId });

    // If no friend list exists for the user, create one
    if (!friendList) {
      friendList = new FriendList({ user: userId, friends: [] });
    }

    // Check if the friend already exists in the list
    const isFriendAlreadyAdded = friendList.friends.some(
      (friend) => friend.toString() === friendId
    );

    if (isFriendAlreadyAdded) {
      return res.status(400).json({ error: 'Friend is already in the list' });
    }

    // Add the new friend to the list
    friendList.friends.push(friendId);

    // Save the updated friend list
    await friendList.save();

    //fetch the user
    const user = await User.findById(userId);

    // Only set hasFriends to true if it's currently false
    if (!user.hasFriends) {
      user.hasFriends = true;
      await user.save();
    }

     // Find the newly added friend's data
     const newFriend = await User.findById(friendId).select('-password'); // Exclude the password field

     if (!newFriend) {
       return res.status(404).json({ error: 'Newly added friend not found' });
     }
 
     res.status(200).json(newFriend);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeFriends = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    // Find the user's friend list
    const friendList = await FriendList.findOne({ user: userId });

    // If friendList doesn't exist, return error
    if (!friendList) {
      return res.status(404).json({ error: 'Friend list not found for the user' });
    }

    // Check if the friendId exists in the friendList
    const index = friendList.friends.indexOf(friendId);

    if (index === -1) {
      return res.status(404).json({ error: 'Friend not found in the friend list' });
    }

    // Remove friendId from the friendList
    friendList.friends.splice(index, 1);

    // Save the updated friend list
    await friendList.save();

    // Check if the friend list is empty and update user
    if (friendList.friends.length === 0) {
      const user = await User.findById(userId);
      if (user) {
        user.hasFriends = false;
        await user.save();
      }
    }

    // Find the removed friend's data
    const removedFriend = await User.findById(friendId).select('-password'); // Exclude the password field

    if (!removedFriend) {
      return res.status(404).json({ error: 'Removed friend not found' });
    }

    res.status(200).json(removedFriend);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

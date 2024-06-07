import FriendList from '../models/friendList.js';
import Message from '../models/message.js';

export const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the friend list
    const friendList = await FriendList.findOne({ user: userId }).populate('friends');

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



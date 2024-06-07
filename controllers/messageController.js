import Message from '../models/message.js';
import User from '../models/user.js';

export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.query;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: -1 }).limit(10).exec();
    
    // Reverse the messages to maintain the correct order
    const orderedMessages = messages.reverse();
    
    res.json(orderedMessages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getMostRecentFriend = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the most recent message involving the user
    const recentMessage = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).sort({ timestamp: -1 }).limit(1).exec();

    if (recentMessage.length === 0) {
      return res.status(404).json({ error: 'No recent conversations found' });
    }

    // Determine the friend from the most recent message
    const mostRecentFriend = recentMessage[0].sender.toString() === userId 
      ? recentMessage[0].receiver
      : recentMessage[0].sender;

    const user = await User.findById(mostRecentFriend)

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
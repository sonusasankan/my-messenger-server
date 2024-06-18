import User from '../models/user.js'


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


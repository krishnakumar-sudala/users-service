const authService = require('./service');

exports.signup = async (req, res) => {
  try {
    const user = await authService.signup(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const tokens = await authService.login(req.body);
    res.status(200).json(tokens);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const tokens = await authService.refresh(req.body.token);
    res.status(200).json(tokens);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req, res) => {
  const { fullname, address, birthday, avatar_url, phone, email, password, is_active, role } = req.body;

  try {
    const response = await registerUser({ fullname, address, birthday, avatar_url, phone, email, password, is_active, role });
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password} = req.body;

  try {
    const response = await loginUser({ email, password});
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
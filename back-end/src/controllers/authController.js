import { registerUser, loginUser, confirmRegister, forgotPassword, resetPassword } from '../services/authService.js';

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

    // Thiết lập cookie với JWT
    const token = response.token;
    res.cookie('token', token, {
      httpOnly: true, // Cookie không thể truy cập từ JavaScript
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000 // 8h
    });

    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token'); // Xóa cookie
  res.status(200).json({ message: 'Logged out successfully' });
}

export const confirm = async (req, res) => {
  const { email, code } = req.body;

  try {
    const response = await confirmRegister({ email, code });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const checkAuth = (req, res) => {
  if (req.user) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

export const forgotPsswd = async(req, res) => {
  const { email } = req.body;
  try{
    const response = await forgotPassword({ email });
    res.status(200).json(response);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
};

export const resetPsswd = async(req, res) => {
  const { email, code, password } = req.body;
  try{
    const response = await resetPassword({ email, code, password });
    res.status(200).json(response);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
}
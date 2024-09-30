const { registerUser, loginUser, confirmRegister, forgotPassword, resetPassword } = require('../services/authService.js');

// Đăng ký người dùng
const register = async (req, res) => {
  const { firstname, lastname, address, birthday, phone, email, password, repeat_psswd } = req.body;

  try {
    const response = await registerUser({ firstname, lastname, address, birthday, phone, email, password, repeat_psswd });
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await loginUser({ email, password, res });
    console.log(response);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng xuất
const logout = (req, res) => {
  res.clearCookie('token'); // Xóa cookie
  res.status(200).json({ message: 'Logged out successfully' });
};

// Xác nhận đăng ký
const confirm = async (req, res) => {
  const { email, code } = req.body;

  try {
    const response = await confirmRegister({ email, code });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Kiểm tra xác thực
const checkAuth = (req, res) => {
  if (req.user) {
    res.status(200).json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

// Quên mật khẩu
const forgotPsswd = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await forgotPassword({ email });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đặt lại mật khẩu
const resetPsswd = async (req, res) => {
  const { email, code, password } = req.body;
  try {
    const response = await resetPassword({ email, code, password });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  confirm,
  checkAuth,
  forgotPsswd,
  resetPsswd
};

const passport = require('../config/oAuth2Config.js');
const { registerUser, loginUser, confirmRegister, forgotPassword, resetPassword, changePassword, googleAuthCallback, linkGoogleAccount, unlinkGoogleAccount } = require('../services/authService.js');

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
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng xuất
const logout = async (req, res) => {
  try {
    if (req.user?.id) {
      await Token.update(
        { revoked: true, expired: true },
        { where: { userId: req.user.id } }
      );
    }
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'None',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'None',
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  }
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

const changePwd = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const response = await changePassword({ userId, oldPassword, newPassword });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Google OAuth routes
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const googleCallback = async (req, res, next) => {
  passport.authenticate('google', { session: false }, async (err, user) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
    }
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }

    try {
      const result = await googleAuthCallback(user, res);
      // Redirect to frontend with success
      res.redirect(`${process.env.FRONTEND_URL}/login?success=true`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_processing_error`);
    }
  })(req, res, next);
};

// Link Google account to existing user
const linkGoogle = async (req, res) => {
  // This would be called after user is authenticated and wants to link Google
  const userId = req.user.id;
  const { googleProfile } = req.body;
  
  try {
    const response = await linkGoogleAccount(userId, googleProfile);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Unlink Google account
const unlinkGoogle = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const response = await unlinkGoogleAccount(userId);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  confirm,
  checkAuth,
  forgotPsswd,
  resetPsswd,
  changePwd,
  googleAuth,
  googleCallback,
  linkGoogle,
  unlinkGoogle,
};

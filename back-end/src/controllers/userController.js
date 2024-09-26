import { uploadAvatarService } from "../services/uploadService.js";
import { getUserById, updateUserById } from "../services/userService.js";

export const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await getUserById(userId);

  res.json({
    message: "Success",
    data: {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      gender: user.gender,
      avatar_url: user.avatar_url,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
    }
  });
}

export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const { firstname, lastname, address, birthday, gender, phone } = req.body;

    // Kiểm tra và upload avatar nếu có
    let avatar_url = null;
    if (req.file) {
      avatar_url = await uploadAvatarService(req, res); // Nhận URL từ Cloudinary
    }

    const updatedUser = await updateUserById(userId, { 
      firstname, 
      lastname, 
      address, 
      birthday, 
      gender, 
      avatar_url, 
      phone 
    });

    res.status(201).json({
      message: "Success",
      data: updatedUser
    });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  };
}
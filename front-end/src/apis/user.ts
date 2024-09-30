export const updateProfileApis = async (firstname: string, lastname: string, address: string, 
    phone: string, gender: boolean, birthday: Date | null, avatar: File | null) => {
  const formData = new FormData(); 

  formData.append('firstname', firstname);
  formData.append('lastname', lastname);
  formData.append('address', address);
  formData.append('phone', phone);
  formData.append('gender', gender.toString()); // Append gender as a string

  if (birthday) {
    formData.append('birthday', birthday.toISOString()); // If have birthday, append it
  }
  
  if (avatar) {
    formData.append('avatar_url', avatar); // Append avatar file if it exists
  }

  try {
    const response = await fetch('http://localhost:8080/api/v1/user/profile/edit', {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    return data;
  } catch (err) {
    console.error('Có lỗi xảy ra: ', err);
  }
};

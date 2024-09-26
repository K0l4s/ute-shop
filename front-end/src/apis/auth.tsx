// auth.tsx

export const forgotPasswordApis = async (email: String) => {
    // Call API to send reset password email
    const response = await fetch('http://localhost:8008/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email
        }),
      });
    // const data = await response.json();
    // console.log('Data:', data);
    return response;
};

export const resetPasswordApis = async (email: String, password: String, code: String) => {
    // Call API to reset password
    const response = await fetch('http://localhost:8080/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          code
        }),
      });
    // const data = await response.json();
    // console.log('Data:', data);
    return response;
};

export const activeAccountApis = async (email: String, code: String) => {
    // Call API to reset password
    const response = await fetch('http://localhost:8080/api/v1/auth/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        code
      }),
    });
  // const data = await response.json();
  // console.log('Data:', data);
  return response;
};
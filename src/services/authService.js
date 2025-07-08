import axios from 'axios';

const API_URL = 'https://projeto-back-zsio.onrender.com';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || 'Login failed';
  }
};

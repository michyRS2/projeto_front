import axios from 'axios';

const API_URL = 'https://projeto-back-zsio.onrender.com';

const getDashboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/formando/dashboard`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dashboard:", error);
    throw error;
  }
};

export default {
  getDashboard
};

import axios from 'axios';

const getDashboard = async () => {
  try {
    const response = await axios.get('http://localhost:3000/formando/dashboard', {
      withCredentials: true  // 🔑 isto permite enviar o cookie authToken
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
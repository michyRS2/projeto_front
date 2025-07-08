import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";

import MainLayout from "./layouts/MainLayout";
import Perfil from "./views/Perfil";
import Login from "./views/Login";
import Register from "./views/Register";
import DashboardFormando from "./views/Formando/DashboardFormando";
import CursoRecomendado from "./views/Formando/CursoRecomendado";
import CursoInscrito from "./views/Formando/CursoInscrito";
import DashboardGestor from "./views/Gestor/DashboardGestor";
import NovoCurso from "./views/Gestor/NovoCurso";
import EditarCurso from "./views/Gestor/EditarCurso";
import NotFound from "./views/NotFound"; // Importando o componente de erro 404
import ModulosAulas from "./views/Gestor/ModulosAulas";
import DashboardFormador from "./views/Formador/DashboardFormador";
import EditarCursoFormador from "./views/Formador/EditarCursoFormador";
import ResetPassword from "./views/ResetPassword";

function App() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/check", {
          withCredentials: true,
        });
        if (res.status === 200) {
          setAuth({ isAuthenticated: true, role: res.data.user.role });
        }
      } catch {
        setAuth({ isAuthenticated: false, role: null });
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/"
            element={
              auth.isAuthenticated ? (
                auth.role === "formando" ? (
                  <Navigate to="/formando/dashboard" />
                ) : auth.role === "gestor" ? (
                  <Navigate to="/gestor/dashboard" />
                ) : auth.role === "formador" ? (
                  <Navigate to="/formador/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/formando/dashboard" element={<DashboardFormando />} />
          <Route path="/cursos/:cursoId" element={<CursoRecomendado />} />
          <Route path="/cursosInscritos/:cursoId" element={<CursoInscrito />} />

          <Route path="/gestor/dashboard" element={<DashboardGestor />} />
          <Route path="/formador/dashboard" element={<DashboardFormador />} />
          <Route path="/formador/editar-curso/:id" element={<EditarCursoFormador />} />
          <Route path="/gestor/criar-curso" element={<NovoCurso />} />
          <Route path="/gestor/cursos/editar/:id" element={<EditarCurso />} />
          <Route
            path="/gestor/cursos/:cursoId/modulos"
            element={<ModulosAulas />}
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

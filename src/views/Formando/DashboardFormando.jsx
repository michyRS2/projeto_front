import React, { useEffect, useState } from "react";
import {
  Container,
  Spinner,
  Nav,
  Navbar,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { FaBell, FaUser } from "react-icons/fa";
import formandoService from "../../services/formandoService";
import CursoCard from "../../components/CursoCard";
import ForumCard from "../../components/ForumCard";
import "../../styles/dashboardFormando.css";
import { Link } from 'react-router-dom';


const DashboardFormando = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await formandoService.getDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
        setError("Erro ao carregar os dados do dashboard");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <p>{error}</p>;

  const { cursosInscritos, cursosRecomendados, forum, percursoFormativo } =
    dashboardData;

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <Container className="mt-4">
        <h1>Bem-vindo </h1>

        {/* Cursos Inscritos */}

        <section className="mt-4">
          <h2>Cursos Inscritos</h2>
          <div className="scroll-carousel">
            {cursosInscritos.map((curso) => (
              <div key={curso.ID_Curso} className="carousel-item-card">
                <CursoCard curso={{...curso, inscrito:true}} />
              </div>
            ))}
          </div>
        </section>

        {/* Cursos Recomendados */}
        <section className="mt-4">
          <h2>Cursos Recomendados</h2>
          <div className="scroll-carousel">
            {cursosRecomendados.map((curso) => (
              <div key={curso.ID_Curso} className="carousel-item-card">
                <CursoCard curso={{...curso, inscrito:false}} />
              </div>
            ))}
          </div>
        </section>

        {/* Percurso Formativo */}
        {percursoFormativo && (
          <section className="mt-4">
            <h2>Percurso Formativo</h2>
            <div className="scroll-carousel">
              {percursoFormativo.map((etapa) => (
                <div key={etapa.ID_Etapa} className="carousel-item-card">
                  <CursoCard curso={etapa} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Últimos Tópicos do Fórum */}
        <section className="mt-4">
          <h2>Últimos Tópicos do Fórum</h2>
          <div className="scroll-carousel">
            {forum.map((topico) => (
              <div key={topico.ID_Forum} className="carousel-item-card">
                <ForumCard topico={topico} />
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default DashboardFormando;

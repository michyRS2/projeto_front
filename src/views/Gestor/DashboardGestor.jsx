import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import EstatisticaBox from "../../components/EstatisticaBox";
import CursoCardGestor from "../../components/CursoCardGestor";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const DashboardGestor = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDados = async () => {
      try {
        const resStats = await axios.get("http://localhost:3000/gestor/dashboard", {
          withCredentials: true,
        });

        const resCursos = await axios.get("http://localhost:3000/gestor/cursos", {
          withCredentials: true,
        });

        setStats(resStats.data);
        setCursos(Array.isArray(resCursos.data) ? resCursos.data : []);
      } catch (error) {
        console.error("Erro ao carregar dados do gestor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handleEditarCurso = (curso) => {
    navigate(`/gestor/cursos/editar/${curso.ID_Curso}`);
  };

  const handleEliminarCurso = async (curso) => {
    if (window.confirm(`Confirmar eliminação do curso "${curso.Nome_Curso}"?`)) {
      try {
        await axios.delete(`http://localhost:3000/gestor/cursos/${curso.ID_Curso}`, {
          withCredentials: true
        });
        setCursos(cursos.filter((c) => c.ID_Curso !== curso.ID_Curso));
      } catch (error) {
        console.error("Erro ao eliminar curso:", error);
      }
    }
  };

  if (loading) return <p>A carregar dados...</p>;
  if (!stats) return <p>Erro ao carregar estatísticas.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard do Gestor</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EstatisticaBox titulo="Total de Utilizadores" valor={stats.totalUtilizadores} />
        <EstatisticaBox titulo="Novos este mês" valor={stats.novosUtilizadores} />
        <EstatisticaBox titulo="Utilizadores Ativos" valor={stats.utilizadoresAtivos} />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Cursos por Categoria</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.cursosPorCategoria}>
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link to="/gestor/criar-curso" className="btn btn-success mt-3">
        Criar Novo Curso
      </Link>

      <div className="space-y-4 mt-4">
        {cursos.length === 0 ? (
          <p>Não há cursos disponíveis.</p>
        ) : (
          cursos.map((curso) => (
            <CursoCardGestor
              key={curso.ID_Curso}
              curso={curso}
              onEditar={handleEditarCurso}
              onEliminar={handleEliminarCurso}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardGestor;

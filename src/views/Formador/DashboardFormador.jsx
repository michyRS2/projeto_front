import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CursoCardFormador from "../../components/CursoCardFormador";

const DashboardFormador = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/formador/dashboard", { withCredentials: true })
      .then(res => setCursos(res.data.cursosDoFormador || []))
      .catch(err => console.error("Erro ao carregar cursos:", err));
  }, []);

  const handleEditarCurso = (curso) => {
    navigate(`/formador/editar-curso/${curso.ID_Curso}`);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard do Formador</h1>
      {cursos.length === 0 ? (
        <p>Não há cursos atribuídos.</p>
      ) : (
        cursos.map((curso) => (
          <CursoCardFormador
            key={curso.ID_Curso}
            curso={curso}
            onEditar={handleEditarCurso}
          />
        ))
      )}
    </div>
  );
};

export default DashboardFormador;

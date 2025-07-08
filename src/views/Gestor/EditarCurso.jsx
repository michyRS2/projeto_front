import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditarCurso = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);

  const [formadores, setFormadores] = useState([]);


useEffect(() => {
  const fetchFormadores = async () => {
    const res = await fetch(`https://projeto-back-zsio.onrender.com/gestor/formadores`, {
      credentials: "include"
    });
    const data = await res.json();
    setFormadores(data);
  };

  if (curso?.Tipo_Curso === "síncrono") {
    fetchFormadores();
  }
}, [curso?.Tipo_Curso]);


useEffect(() => {
  const fetchCurso = async () => {
    try {
      const resCurso = await fetch(`https://projeto-back-zsio.onrender.com/gestor/cursos/${id}`, {
        credentials: 'include'
      });
      if (!resCurso.ok) {
        throw new Error(`Erro ${resCurso.status}: ${resCurso.statusText}`);
      }
      const dadosCurso = await resCurso.json();
      setCurso(dadosCurso);

      if (dadosCurso.Tipo_Curso === "assíncrono" && dadosCurso.modulos) {
        const modulosComAulas = dadosCurso.modulos.map(mod => ({
          ...mod,
          Aulas: Array.isArray(mod.aulas) ? mod.aulas : [],
        }));
        setModulos(modulosComAulas);
      }
    } catch (err) {
      console.error("Erro ao carregar curso:", err);
    }
  };

  fetchCurso();
}, [id]);


  const atualizarModulo = (idx, campo, valor) => {
    const novos = [...modulos];
    novos[idx][campo] = valor;
    setModulos(novos);
  };

  const atualizarAula = (modIdx, aulaIdx, campo, valor) => {
    const novos = [...modulos];
    novos[modIdx].Aulas[aulaIdx][campo] = valor;
    setModulos(novos);
  };

  const adicionarModulo = () => {
    setModulos([...modulos, { Titulo: "", Aulas: [{ Titulo: "", Descricao: "" }] }]);
  };

  const adicionarAula = (modIdx) => {
  const novos = [...modulos];
  if (!novos[modIdx].Aulas) {
    novos[modIdx].Aulas = [];
  }
  novos[modIdx].Aulas.push({ Titulo: "", Descricao: "" });
  setModulos(novos);
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payloadCurso = {
      Nome_Curso: curso.Nome_Curso,
      Tipo_Curso: curso.Tipo_Curso,
      Data_Inicio: curso.Data_Inicio,
      Data_Fim: curso.Data_Fim,
      Imagem: curso.Imagem,
      ID_Topico: curso.ID_Topico,
      Objetivos: curso.Objetivos,
      Includes: curso.Includes,
      ...(curso.Tipo_Curso === "síncrono" && {
      Vagas: curso.Vagas,
      ID_Formador: curso.ID_Formador,
    }),
    };

    try {
      const resCurso = await fetch(`https://projeto-back-zsio.onrender.com/gestor/cursos/${id}`, {
        credentials: 'include',
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadCurso),
      });

      if (!resCurso.ok) throw new Error("Erro ao atualizar curso.");

      if (curso.Tipo_Curso === "assíncrono") {
        const resModulos = await fetch(`https://projeto-back-zsio.onrender.com/gestor/cursos/${id}/list`, {
          credentials: "include",
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modulos),
        });

        if (!resModulos.ok) throw new Error("Erro ao atualizar módulos.");
      }

      alert("Curso atualizado com sucesso!");
      navigate("/gestor/dashboard");
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao atualizar curso.");
    }
  };

  if (!curso) return <p>A carregar curso...</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Curso</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome</label>
          <input type="text" className="form-control" value={curso.Nome_Curso} onChange={(e) => setCurso({ ...curso, Nome_Curso: e.target.value })} />
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <input type="text" className="form-control" value={curso.Tipo_Curso} disabled />
        </div>

        <div className="mb-3">
          <label>Data Início</label>
          <input type="date" className="form-control" value={curso.Data_Inicio?.slice(0, 10)} onChange={(e) => setCurso({ ...curso, Data_Inicio: e.target.value })} />
        </div>

        <div className="mb-3">
          <label>Data Fim</label>
          <input type="date" className="form-control" value={curso.Data_Fim?.slice(0, 10)} onChange={(e) => setCurso({ ...curso, Data_Fim: e.target.value })} />
        </div>

        {curso.Tipo_Curso === "síncrono" && (
          <>
            <div className="mb-3">
              <label>Vagas</label>
              <input type="number" className="form-control" value={curso.Vagas} onChange={(e) => setCurso({ ...curso, Vagas: e.target.value })} />
            </div>

            <div className="mb-3">
              <label>Formador</label>
              <select className="form-select" value={curso.ID_Formador || ""} onChange={(e) => setCurso({ ...curso, ID_Formador: e.target.value })}>
                <option value="">Selecione</option>
                {formadores.map((f) => (
                  <option key={f.ID_Formador} value={f.ID_Formador}>{f.Nome}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {curso.Tipo_Curso === "assíncrono" && (
          <>
            <h4 className="mt-4">Objetivos</h4>
            {curso.Objetivos.map((obj, idx) => (
              <input
                key={idx}
                className="form-control mb-2"
                value={obj}
                onChange={(e) => {
                  const novos = [...curso.Objetivos];
                  novos[idx] = e.target.value;
                  setCurso({ ...curso, Objetivos: novos });
                }}
              />
            ))}
            <button type="button" onClick={() => setCurso({ ...curso, Objetivos: [...curso.Objetivos, ""] })}>
              + Objetivo
            </button>

            <h4 className="mt-4">Includes</h4>
            {curso.Includes.map((inc, idx) => (
              <input
                key={idx}
                className="form-control mb-2"
                value={inc}
                onChange={(e) => {
                  const novos = [...curso.Includes];
                  novos[idx] = e.target.value;
                  setCurso({ ...curso, Includes: novos });
                }}
              />
            ))}
            <button type="button" onClick={() => setCurso({ ...curso, Includes: [...curso.Includes, ""] })}>
              + Include
            </button>

            <h4 className="mt-4">Módulos e Aulas</h4>
            {modulos.map((mod, modIdx) => (
              <div key={modIdx} className="border p-3 mb-3 rounded">
                <label>Título do Módulo</label>
                <input
                  className="form-control mb-2"
                  value={mod.Titulo}
                  onChange={(e) => atualizarModulo(modIdx, "Titulo", e.target.value)}
                />

                <h6>Aulas</h6>
                {(mod.Aulas || []).map((aula, aulaIdx) => (
                   <div key={aulaIdx} className="mb-2">
                   <input
                   className="form-control mb-1"
                   placeholder="Título da Aula"
                   value={aula.Titulo}
                  onChange={(e) => atualizarAula(modIdx, aulaIdx, "Titulo", e.target.value)}
                   />
                   <input
                   className="form-control"
                   placeholder="Descrição"
                   value={aula.Descricao}
                   onChange={(e) => atualizarAula(modIdx, aulaIdx, "Descricao", e.target.value)}
                  />
                  </div>
                ))}
    <button type="button" onClick={() => adicionarAula(modIdx)}>
      + Aula
    </button>
  </div>
))}
            <button type="button" className="btn btn-secondary mt-2" onClick={adicionarModulo}>
              + Módulo
            </button>
          </>
        )}

        <button type="submit" className="btn btn-primary mt-4">
          Guardar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditarCurso;



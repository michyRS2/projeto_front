import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditarCursoFormador = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/formador/editar-curso/${id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setCurso(data);

        if (Array.isArray(data.modulos)) {
          const modulosComAulas = data.modulos.map((mod) => ({
            ...mod,
            Aulas: mod.aulas || [],
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
    setModulos([
      ...modulos,
      { Titulo: "", Aulas: [{ Titulo: "", Descricao: "" }] },
    ]);
  };

  const removerModulo = (modIdx) => {
    const novos = [...modulos];
    novos.splice(modIdx, 1);
    setModulos(novos);
  };

  const adicionarAula = (modIdx) => {
    const novos = [...modulos];
    novos[modIdx].Aulas.push({ Titulo: "", Descricao: "" });
    setModulos(novos);
  };

  const removerAula = (modIdx, aulaIdx) => {
    const novos = [...modulos];
    novos[modIdx].Aulas.splice(aulaIdx, 1);
    setModulos(novos);
  };

  const removerObjetivo = (idx) => {
    const novos = [...curso.Objetivos];
    novos.splice(idx, 1);
    setCurso({ ...curso, Objetivos: novos });
  };

  const removerInclude = (idx) => {
    const novos = [...curso.Includes];
    novos.splice(idx, 1);
    setCurso({ ...curso, Includes: novos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3000/formador/editar-curso/${id}/list`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Objetivos: curso.Objetivos || [],
            Includes: curso.Includes || [],
            Modulos: modulos || [],
          }),
        }
      );

      if (res.ok) {
        alert("Curso atualizado com sucesso!");
        navigate("/formador/dashboard");
      } else {
        alert("Erro ao atualizar curso");
      }
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
    }
  };

  if (!curso) return <p>A carregar...</p>;

  return (
    <div className="container mt-4">
      <h2>Editar Conteúdo do Curso</h2>
      <form onSubmit={handleSubmit}>
        <h4 className="mt-4">Objetivos</h4>
        {curso.Objetivos.map((obj, idx) => (
          <div key={idx} className="d-flex mb-2 gap-2">
            <input
              className="form-control"
              value={obj}
              onChange={(e) => {
                const novos = [...curso.Objetivos];
                novos[idx] = e.target.value;
                setCurso({ ...curso, Objetivos: novos });
              }}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removerObjetivo(idx)}
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCurso({ ...curso, Objetivos: [...curso.Objetivos, ""] })
          }
        >
          + Objetivo
        </button>

        <h4 className="mt-4">Includes</h4>
        {curso.Includes.map((inc, idx) => (
          <div key={idx} className="d-flex mb-2 gap-2">
            <input
              className="form-control"
              value={inc}
              onChange={(e) => {
                const novos = [...curso.Includes];
                novos[idx] = e.target.value;
                setCurso({ ...curso, Includes: novos });
              }}
            />
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => removerInclude(idx)}
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setCurso({ ...curso, Includes: [...curso.Includes, ""] })
          }
        >
          + Include
        </button>

        <h4 className="mt-4">Módulos e Aulas</h4>
        {modulos.map((mod, modIdx) => (
          <div key={modIdx} className="border p-3 mb-3 rounded">
            <label>Título do Módulo</label>
            <input
              className="form-control mb-2"
              value={mod.Titulo}
              onChange={(e) =>
                atualizarModulo(modIdx, "Titulo", e.target.value)
              }
              required
            />
            <button
              type="button"
              className="btn btn-danger mb-2"
              onClick={() => removerModulo(modIdx)}
            >
              Remover Módulo
            </button>

            <h6>Aulas</h6>
            {mod.Aulas.map((aula, aulaIdx) => (
              <div key={aulaIdx} className="mb-2 d-flex flex-column">
                <input
                  className="form-control mb-1"
                  placeholder="Título da Aula"
                  value={aula.Titulo}
                  onChange={(e) =>
                    atualizarAula(modIdx, aulaIdx, "Titulo", e.target.value)
                  }
                  required
                />
                <input
                  className="form-control mb-1"
                  placeholder="Descrição"
                  value={aula.Descricao}
                  onChange={(e) =>
                    atualizarAula(modIdx, aulaIdx, "Descricao", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn btn-warning btn-sm mb-2"
                  onClick={() => removerAula(modIdx, aulaIdx)}
                >
                  Remover Aula
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => adicionarAula(modIdx)}
            >
              + Aula
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={adicionarModulo}
        >
          + Módulo
        </button>

        <button type="submit" className="btn btn-success mt-4">
          Guardar Alterações
        </button>
      </form>
    </div>
  );
};

export default EditarCursoFormador;

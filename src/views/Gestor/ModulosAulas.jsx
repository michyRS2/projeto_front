// frontend/src/views/Gestor/ModulosAulas.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ModulosAulas = () => {
  const { cursoId } = useParams();
  const navigate = useNavigate();

  const [modulos, setModulos] = useState([
    { Titulo: "", Aulas: [{ Titulo: "", Descricao: "" }] }
  ]);

  const adicionarModulo = () =>
    setModulos([...modulos, { Titulo: "", Aulas: [{ Titulo: "", Descricao: "" }] }]);

  const removerModulo = (idx) =>
    setModulos(modulos.filter((_, i) => i !== idx));

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

  const atualizarCampoModulo = (modIdx, valor) => {
    const novos = [...modulos];
    novos[modIdx].Titulo = valor;
    setModulos(novos);
  };

  const atualizarCampoAula = (modIdx, aulaIdx, campo, valor) => {
    const novos = [...modulos];
    novos[modIdx].Aulas[aulaIdx][campo] = valor;
    setModulos(novos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://projeto-back-zsio.onrender.com/gestor/cursos/${cursoId}/modulos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Modulos: modulos }),
      });

      if (res.ok) {
        alert("Módulos e aulas criados com sucesso!");
        navigate("/gestor/dashboard");
      } else {
        alert("Erro ao criar módulos e aulas.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao enviar dados. Veja o console para detalhes.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Criar Módulos e Aulas</h2>
      <form onSubmit={handleSubmit}>
        {modulos.map((modulo, mi) => (
          <div
            key={mi}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 15 }}
          >
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Título do Módulo"
              value={modulo.Titulo}
              onChange={e => atualizarCampoModulo(mi, e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-danger btn-sm mb-2"
              onClick={() => removerModulo(mi)}
            >
              Remover Módulo
            </button>

            {modulo.Aulas.map((aula, ai) => (
              <div key={ai} style={{ marginLeft: 20, marginBottom: 10 }}>
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder="Título da Aula"
                  value={aula.Titulo}
                  onChange={e => atualizarCampoAula(mi, ai, "Titulo", e.target.value)}
                  required
                />
                <input
                  type="text"
                  className="form-control mb-1"
                  placeholder="Descrição da Aula"
                  value={aula.Descricao}
                  onChange={e => atualizarCampoAula(mi, ai, "Descricao", e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-warning btn-sm"
                  onClick={() => removerAula(mi, ai)}
                >
                  Remover Aula
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => adicionarAula(mi)}
            >
              Adicionar Aula
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={adicionarModulo}
        >
          Adicionar Módulo
        </button>

        <button type="submit" className="btn btn-success mt-3">
          Salvar Módulos e Aulas
        </button>
      </form>
    </div>
  );
};

export default ModulosAulas;
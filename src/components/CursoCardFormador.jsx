import React from "react";

const CursoCardFormador = ({ curso, onEditar }) => {
  const dataFimFormatada = new Date(curso.Data_Fim).toLocaleDateString("pt-PT");

  const estadoFormatado = (() => {
    switch ((curso.Estado_Curso || "").toLowerCase()) {
      case "ativo":
        return "Ativo";
      case "em curso":
        return "Em curso";
      case "terminado":
        return "Terminado";
      default:
        return curso.Estado_Curso || "Desconhecido";
    }
  })();

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <h5 className="card-title">{curso.Nome_Curso}</h5>
          <p className="card-text mb-1"><strong>Tipo:</strong> {curso.Tipo_Curso}</p>
          <p className="card-text mb-1"><strong>Categoria:</strong> {curso.Categoria || "N/A"}</p>
          <p className="card-text mb-1"><strong>Data fim:</strong> {dataFimFormatada}</p>
          <p className="card-text mb-1"><strong>Estado:</strong> {estadoFormatado}</p>
        </div>
        <div>
          <button
            onClick={() => onEditar(curso)}
            className="btn btn-outline-primary"
          >
            Gerir Conteúdo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CursoCardFormador;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NovoCurso = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("síncrono");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [vagas, setVagas] = useState(0);
  const [imagem, setImagem] = useState("");
  const [objetivos, setObjetivos] = useState([""]);
  const [includes, setIncludes] = useState([""]);
  const [topicoId, setTopicoId] = useState("");

  const [categoriaId, setCategoriaId] = useState("");
  const [areaId, setAreaId] = useState("");

  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [topicos, setTopicos] = useState([]);
  const [formadores, setFormadores] = useState([]);
  const [formadorId, setFormadorId] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data));
  }, []);

  useEffect(() => {
    if (categoriaId) {
      fetch(`http://localhost:3000/areas?categoriaId=${categoriaId}`)
        .then(res => res.json())
        .then(data => setAreas(data));
    }
  }, [categoriaId]);

  useEffect(() => {
    if (areaId) {
      fetch(`http://localhost:3000/topicos?areaId=${areaId}`)
        .then(res => res.json())
        .then(data => setTopicos(data));
    }
  }, [areaId]);

  useEffect(() => {
    if (tipo === "síncrono") {
      fetch("http://localhost:3000/gestor/formadores", {
        credentials: 'include'
      })
        .then(res => {
          if (!res.ok) throw new Error("Acesso negado");
          return res.json();
        })
        .then(data => setFormadores(data))
        .catch((err) => console.error("Erro ao carregar formadores:", err));
    }
  }, [tipo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dadosBase = {
      Nome_Curso: nome,
      Tipo_Curso: tipo,
      Descricao: descricao,
      Data_Inicio: dataInicio,
      Data_Fim: dataFim,
      Imagem: imagem || null,
      ID_Topico: parseInt(topicoId, 10),
    };

    const dadosSincrono = {
      ...dadosBase,
      Vagas: parseInt(vagas, 10),
      ID_Formador: parseInt(formadorId, 10),
    };

    const dadosAssincrono = {
      ...dadosBase,
      Vagas: null,
      ID_Formador: null,
      Objetivos: objetivos.filter(o => o.trim() !== ""),
      Includes: includes.filter(i => i.trim() !== ""),
    };

    const novoCurso = tipo === "síncrono" ? dadosSincrono : dadosAssincrono;

    try {
      const res = await fetch("http://localhost:3000/gestor/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(novoCurso),
      });

      if (res.ok) {
        const data = await res.json();

        alert("Curso criado com sucesso!");

        if (tipo === "assíncrono") {
          // Redireciona para criar módulos e aulas depois do curso assíncrono criado
          navigate(`/gestor/cursos/${data.ID_Curso}/modulos`);
        } else {
          // Para síncrono, volta para dashboard normal
          navigate("/gestor/dashboard");
        }

      } else {
        alert("Erro ao criar curso.");
      }
    } catch (err) {
      console.error("Erro:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Criar Curso</h2>
      <form onSubmit={handleSubmit}>
        {/* MESMOS CAMPOS QUE TU ENVIASTE, IGUAIS */}
        <div className="mb-3">
          <label>Nome do Curso</label>
          <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Descrição</label>
          <textarea className="form-control" rows="4" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Tipo</label>
          <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="síncrono">Síncrono</option>
            <option value="assíncrono">Assíncrono</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Data de Início</label>
          <input type="date" className="form-control" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Data de Fim</label>
          <input type="date" className="form-control" value={dataFim} onChange={(e) => setDataFim(e.target.value)} required />
        </div>

        {tipo === "síncrono" && (
          <>
            <div className="mb-3">
              <label>Vagas</label>
              <input type="number" className="form-control" value={vagas} onChange={(e) => setVagas(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label>Formador</label>
              <select className="form-select" value={formadorId} onChange={(e) => setFormadorId(e.target.value)} required>
                <option value="">Selecione um formador</option>
                {formadores.map(f => (
                  <option key={f.ID_Formador} value={f.ID_Formador}>{f.Nome}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {tipo === "assíncrono" && (
          <>
            <div className="mb-3">
              <label>Objetivos</label>
              {objetivos.map((obj, idx) => (
                <input
                  key={idx}
                  className="form-control mb-1"
                  value={obj}
                  onChange={(e) => {
                    const novos = [...objetivos];
                    novos[idx] = e.target.value;
                    setObjetivos(novos);
                  }}
                  placeholder={`Objetivo ${idx + 1}`}
                />
              ))}
              <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={() => setObjetivos([...objetivos, ""])}>+ Adicionar</button>
            </div>

            <div className="mb-3">
              <label>Includes</label>
              {includes.map((inc, idx) => (
                <input
                  key={idx}
                  className="form-control mb-1"
                  value={inc}
                  onChange={(e) => {
                    const novos = [...includes];
                    novos[idx] = e.target.value;
                    setIncludes(novos);
                  }}
                  placeholder={`Inclui ${idx + 1}`}
                />
              ))}
              <button type="button" className="btn btn-secondary btn-sm mt-1" onClick={() => setIncludes([...includes, ""])}>+ Adicionar</button>
            </div>
          </>
        )}

        <div className="mb-3">
          <label>Imagem (URL)</label>
          <input type="text" className="form-control" value={imagem} onChange={(e) => setImagem(e.target.value)} />
        </div>

        <div className="mb-3">
          <label>Categoria</label>
          <select className="form-select" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
            <option value="">Selecione uma categoria</option>
            {categorias.map((c) => (
              <option key={c.ID_Categoria} value={c.ID_Categoria}>{c.Nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Área</label>
          <select className="form-select" value={areaId} onChange={(e) => setAreaId(e.target.value)} required>
            <option value="">Selecione uma área</option>
            {areas.map((a) => (
              <option key={a.ID_Area} value={a.ID_Area}>{a.Nome}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Tópico</label>
          <select className="form-select" value={topicoId} onChange={(e) => setTopicoId(e.target.value)} required>
            <option value="">Selecione um tópico</option>
            {topicos.map((t) => (
              <option key={t.ID_Topico} value={t.ID_Topico}>{t.Nome}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Criar Curso</button>
      </form>
    </div>
  );
};

export default NovoCurso;
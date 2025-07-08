import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/CursoCard.css';

const CursoCard = ({ curso }) => {
  const image = curso.Imagem || 'default-image-url.jpg';
  const formador = curso.Formador || 'Não especificado';
  const rating = curso.rating || 0;
  const navigate = useNavigate();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} color={i <= rating ? '#FFD700' : '#D3D3D3'} />
      );
    }
    return stars;
  };

  const handleVerDetalhes = () => {
    const rota = curso.inscrito ? `/cursosInscritos/${curso.ID_Curso}` : `/cursos/${curso.ID_Curso}`;
    navigate(rota);
  };

  return (
    <div className="CursoCard-wrapper">
      <Card style={{ width: '18rem' }}>
        <div
          className="card-img-top"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <Card.Body>
          <Card.Title>{curso.Nome_Curso}</Card.Title>
          <Card.Text>
            <strong>Formador:</strong> {formador}
          </Card.Text>
          <Card.Text>
            <strong>Avaliação:</strong> {renderStars()}
          </Card.Text>
          <Button variant="primary" onClick={handleVerDetalhes}>
            Ver Detalhes
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CursoCard;

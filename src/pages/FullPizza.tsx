import axios from 'axios';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FullPizza = () => {
  const [pizza, setPizza] = React.useState<{
    title: string;
    price: number;
    imageUrl: string;
  }>();
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          'https://63e4e80c8e1ed4ccf6e8d272.mockapi.io/rp2/pizzas/' + id,
        );
        setPizza(data);
      } catch (error) {
        alert('Помилка при отриманні піцци :( ');
        navigate('/');
      }
    }
    fetchPizza();
  }, []);

  if (!pizza) {
    return 'Loading...';
  }
  return (
    <div className="container">
      <img className="pizza-block__image" src={pizza.imageUrl} />
      <h2>{pizza.title}</h2>
    </div>
  );
};

export default FullPizza;

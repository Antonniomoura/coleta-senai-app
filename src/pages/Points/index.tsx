import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';
import api from '../../services/api';
import returnServer from '../../services/returnServer';

interface Item {
  _id: string;
  title: string;
  image_url: string;
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const loud = async () => {
      await api.get('/items').then((response) => {
        setItems(response.data);
      });
    };
    loud();
  }, []);

  useEffect(() => {
    api.get('points')
      .then((response) => {
        setPoints(response.data);
      });
  }, []);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form>
        {
          points.map((point: any, key) => <div key={key}>
              {
                key === 0 ? <h1>Lista de Pontos</h1> : null
              }
              <fieldset>
                <legend>
                  <h2>Cod: </h2>
                </legend>

                <div className="field">
                  <label htmlFor="name">Nome da entidade</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    disabled={true}
                    value={point?.name}
                  />
                </div>

                <div className="field-group">
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      disabled={true}
                      name="email"
                      value={point?.email}
                      id="email"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="whatsapp">Whatsapp</label>
                    <input
                      type="text"
                      value={point?.whatsapp}
                      name="whatsapp"
                      disabled={true}
                      id="whatsapp"
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend>
                  <h2>Itens de coleta</h2>
                  <span>Selecione um ou mais itens abaixo</span>
                </legend>

                <ul className="items-grid">
                  {items.map((item, key) => (
                    <li
                      key={key}
                      className={point?.items.includes(item._id) ? 'selected' : ''}
                    >
                      <img src={`${returnServer()}${item.image_url}`} alt={item.title} />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </fieldset>
            </div>
          )
        }
      </form>
    </div>
  );
};

export default Points;

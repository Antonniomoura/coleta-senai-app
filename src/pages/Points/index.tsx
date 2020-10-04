import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.scss';
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

  console.log(points);

  return (
    <div id="page-create-point" className="Points">
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
              <fieldset className="mt-2 main-point">
                <legend>
                  <p>{point?.name}</p>
                  <small>Cod: {point?._id}</small>
                </legend>

                <div className="field-group">
                  <div className="field">
                    <label>Cidade: {point?.city}</label>
                  </div>

                  <div className="field">
                    <label>Estado: {point?.uf}</label>
                  </div>
                </div>
                <div className="field-group">
                  <div className="field-group">
                    <div className="field">
                      <label>E-mail: {point?.email}</label>
                    </div>
                  </div>
                  <div className="field-group">
                    <div className="field">
                      <label>Whatsapp: {point?.whatsapp}</label>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset className="point-border">
                <legend>
                  <h2>Itens da coleta</h2>
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

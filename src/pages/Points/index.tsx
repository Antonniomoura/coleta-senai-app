import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.scss';
import api from '../../services/api';
import returnServer from '../../services/returnServer';
import { Item } from '../../interfaces/item.interface';

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState([]);
  const [pointsToRender, setPointsToRender] = useState([]);
  const [currentItem, setCurrentItem] = useState(3);

  const load = async () => {
    await api.get('items').then((response) => {
      setItems(response.data);
    });

    await api.get('points').then((response) => {
      setPoints(response.data);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    balanceItems();
  }, [points, currentItem]);

  async function changeStatus(_id, item) {
    console.log(item.status);
    if (!item.status) {
      item.byUserId = localStorage.getItem('code');
    } else {
      item.byUserId = null;
    }
    item.status = !item.status;
    await api.put(`points/${_id}`, item);
    await load();
  }

  async function deleteItem(_id) {
    await api.delete(`points/${_id}`);
    await load();
  }

  function balanceItems() {
    const code = localStorage.getItem('code');
    if (currentItem === 1) {
      return setPointsToRender(points.filter((point: any) => {
        return point.userId === code;
      }));
    }

    if (currentItem === 2) {
      return setPointsToRender(points.filter((point: any) => {
        return point.userId !== code && point.byUserId === code && point.status;
      }));
    }

    return setPointsToRender(points.filter((point: any) => {
      return point.userId !== code && !point.status;
    }));
  }

  function returnTitle(quantity) {
    if (currentItem === 1) {
      return `Meus Items (${quantity})`;
    }
    if (currentItem === 2) {
      return `Meus Coletados (${quantity})`;
    }
    return `Items Para Coleta (${quantity})`;
  };

  return (
    <div id="page-create-point" className="Points">
      <header>
        <Link to="/">
          <img src={logo} alt="Ecoleta" />
        </Link>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form>
        <div className="point-border">
          <ul className="items-grid">

            <li
              onClick={() => {
                setCurrentItem(3);
              }}
              className={currentItem === 3 ? 'selected' : ''}
            >
              <span>Para coleta</span>
            </li>
            <li onClick={() => {
              setCurrentItem(1);
            }} className={currentItem === 1 ? 'selected' : ''}
            >
              <span>Meus Itens</span>
            </li>
            <li onClick={() => {
              setCurrentItem(2);
            }}
                className={currentItem === 2 ? 'selected' : ''}
            >
              <span>Coletados</span>
            </li>
          </ul>
        </div>
        {
          pointsToRender && pointsToRender.length > 0 ? pointsToRender.map((point: any, key) => {
              console.log(point.items.includes(2));
              console.log(items);
              return <div key={key}>
                <fieldset className="point-border point-coletados">
                  <legend>
                    <h2>Itens para coleta ({key + 1})</h2>
                  </legend>

                  <ul className="items-grid">
                    {items.map((item, key) => (
                      <li
                        key={key}
                        className={point?.items.includes(item._id) ? 'selected' : ''}
                      >
                        <img src={`${returnServer()}${item.image_url}`} alt={item.title} />
                        <small>{item.title}</small>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <fieldset className="m-0 p-0 mt-2 main-point d-flex">
                  <div className="w-100">
                    <div className="field m-0">
                      <p className="m-0 p-0">{point?.name}</p>
                      <small>Cod: {point?._id}</small>
                    </div>
                    <div className="field m-0">
                      <p className="m-0 p-0">Cidade: {point?.city}</p>
                    </div>
                    <div className="field m-0">
                      <p className="m-0 p-0">Estado: {point?.uf}</p>
                    </div>
                    <div className="field m-0">
                      <p className="m-0 p-0">E-mail: {point?.email}</p>
                    </div>
                    <div className="field m-0">
                      <p className="m-0 p-0">Whatsapp: {point?.whatsapp}</p>
                    </div>
                  </div>
                  {
                    currentItem !== 1 ? <div className="w-100 button-recolher justify-content-end">
                      <button
                        onClick={() => changeStatus(point._id, point)}
                        type="button"
                        className={point.status ? 'success-status m-0' : 'success-error m-0'}
                      >
                        {
                          point.status ? 'Recolhido' : 'Recolher'
                        }
                      </button>
                    </div> : <div className="w-100 button-recolher justify-content-end">
                      <button
                        onClick={() => deleteItem(point._id)}
                        type="button"
                        className={'success-error'}
                      >
                        Remover
                      </button>
                    </div>
                  }
                </fieldset>
              </div>;
            }
          ) : <p className="mt-2">Lista Vazia</p>
        }
      </form>
    </div>
  );
};

export default Points;

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import './styles.css';

import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';
import returnServer from '../../services/returnServer';
import { isEmpty } from 'lodash';

interface Item {
  _id: string;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  });

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    -27.547782, -48.497649
  ]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const [selectedUf, setSelectedUf] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [submit, setSubmit] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    -27.547782, -48.497649
  ]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    const loud = async () => {
      await api.get('/items').then((response) => {
        setItems(response.data);
      });
    };
    loud();
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(_id: string) {
    const alreadySelected = selectedItems.findIndex((item) => item === _id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter((item) => item !== _id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, _id]);
    }
  }

  async function uploadImage() {
    const data = new FormData();
    if (!selectedFile) {
      return null;
    }

    data.append('file', selectedFile);

    const result = await api.post('/uploads', data);
    return result?.data?.filename;

  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    if (
      isEmpty(name) || isEmpty(uf) || isEmpty(email) || isEmpty(whatsapp) || isEmpty(city)
      || isEmpty(items)
    ) {
      return setSubmit(true);
    }

    await api.post('/points', {
      image: await uploadImage(),
      name,
      email,
      uf,
      whatsapp,
      city,
      latitude,
      longitude,
      items
    });

    alert('Ponto de coleta criado');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit} autoComplete="off">
        <h1>
          Cadastro do <br />
          ponto de coleta
        </h1>

        <Dropzone submit={submit} onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              className={submit && isEmpty(formData.name) ? 'error-input' : ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                className={submit && isEmpty(formData.email) ? 'error-input' : ''}
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                className={submit && isEmpty(formData.whatsapp) ? 'error-input' : ''}
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                className={submit && isEmpty(selectedUf) ? 'error-input' : ''}
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>

                {ufs.map((uf, key) => (
                  <option key={key} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                className={submit && isEmpty(selectedCity) ? 'error-input' : ''}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma cidade</option>

                {cities.map((city, key) => (
                  <option key={key} value={city}>
                    {city}
                  </option>
                ))}
              </select>
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
                className={selectedItems.includes(item._id) ? 'selected' : ''}
                onClick={() => handleSelectItem(item._id)}
              >
                <img src={`${returnServer()}${item.image_url}`} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <div>
            {
              isEmpty(selectedItems) && submit ? <button className="button-red" type="button">Selecione um item</button> : null
            }
          </div>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;

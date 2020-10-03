import React, { useState, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import { FiUpload } from 'react-icons/fi';
import './styles.css';
import {isEmpty} from 'lodash'

interface Props {
  onFileUploaded: (file: File) => void;
  submit: boolean;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded, submit }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const fileUrl = URL.createObjectURL(file);

      setSelectedFileUrl(fileUrl);
      onFileUploaded(file);
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} />
      ) : (
        <p
          className={submit && isEmpty(selectedFileUrl) ? 'error-input' : ''}>
          <FiUpload />
          Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;

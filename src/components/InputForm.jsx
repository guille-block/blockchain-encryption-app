// InputForm.js
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { storeEncryptedData } from '../blockchain/blockchain-interaction';
import './styles/InputForm.css';

///const contractAddress = "0xfE51B21B92ee14fc85090eDe6fB3A28881eCd5e6";

function InputForm({ signer, contractAddress, encryptionKey }) {
  // State variables
  const [formData, setFormData] = useState({});
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [jsonObject, setJsonObject] = useState(null);
  const [encryptedData, setEncryptedData] = useState('');
  const [error, setError] = useState('');

  // Function to handle data encryption and storage
  const handleEncrypt = async () => {
    try {
      const encryptedResult = CryptoJS.AES.encrypt(jsonObject, encryptionKey).toString();
      //await storeEncryptedData(signer, contractAddress, encryptedResult);
      setEncryptedData(encryptedResult);
      setError('');
    } catch (error) {
      setError("Error encrypting and storing data. Please check your wallet balance and try again.");
    }
  };

  // Function to add new information
  const handleAddInfo = () => {
    const updatedFormData = { ...formData };
    updatedFormData[newPropertyName] = newValue;
    setFormData(updatedFormData);
    setNewPropertyName('');
    setNewValue('');
    const jsonData = JSON.stringify(updatedFormData, null, 2);
    setJsonObject(jsonData);
  };

  // Function to reset the form
  const handleResetInfo = () => {
    setFormData({});
    setNewPropertyName('');
    setNewValue('');
    setJsonObject('');
    setEncryptedData('');
  }

  return (
    <div>
      <div className="form-structure">
        <label className="inputs">
          <input
            type="text"
            placeholder='Place your property name:'
            value={newPropertyName}
            onChange={(e) => setNewPropertyName(e.target.value)}
          />
        </label>
        <label className="inputs">
          <input
            type="text"
            placeholder='Place its value:'
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
        </label>
        <div className='row-structure'>
          <button className="button-structure pretty-button" onClick={handleAddInfo}>Add Information</button>
          <button className="button-structure pretty-button" onClick={handleResetInfo}>Reset Object</button>
        </div>
      </div>
      {jsonObject && (
        <div className='json-container'> 
          <h3>JSON Object:</h3>
            <pre className="json-text">{jsonObject}</pre>
          <div>
            {encryptionKey !== '' ? (
              <button className="pretty-button" onClick={handleEncrypt}>Encrypt Data</button>
            ) : (
              <p className='error-message'>Generate your encryption key</p>
            )}
            {encryptedData && (
              <div className='json-container'>
                <h2>Encrypted Data:</h2>
                    <pre className='json-text'>{encryptedData}</pre>
                {error && <p className='error-message'>{error}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InputForm;

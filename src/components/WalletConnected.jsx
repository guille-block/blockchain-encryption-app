import React from 'react';
import InputForm from './InputForm';
import Decryption from './Decryption';
import './styles/WalletConnected.css';


function WalletConnected({ signer, encryptionKey, contractAddress, webSocketRPC }) {
  return (
    <div className='core-structure'>
      <div className='title'>
        <h1>Data Encryption & Decryption</h1>
        {encryptionKey && (<p className='font-structure'>Key: <b>{encryptionKey}</b></p>)}
      </div>
      <div className="encryption-container">
        <div className="encryption">
          <h2>Encrypt</h2>
          <InputForm 
            signer = {signer}
            contractAddress = {contractAddress}
            encryptionKey={encryptionKey}
          />
        </div>
        <div className="decryption">
          <h2>Decrypt</h2>
          <Decryption
            contractAddress = {contractAddress}
            webSocketRPC = {webSocketRPC}
          />
        </div>
      </div>
    </div>
  );
}

export default WalletConnected;

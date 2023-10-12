import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { retrieveEncryptedData } from '../blockchain/blockchain-interaction';
import Web3 from 'web3';







function Decryption({ contractAddress,  webSocketRPC}) {
  // State variables
  const [decryptedData, setDecryptedData] = useState('');
  const [newInformationEvents, setNewInformationEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [displayingEncryptedData, setDisplayingEncryptedData] = useState(null);
  const [customDecryptionKey, setCustomDecryptionKey] = useState('');

  // Polygon contract address for data storage
  //const contractAddress = "0xfE51B21B92ee14fc85090eDe6fB3A28881eCd5e6";

  // Alchemy WebSockets endpoint for the Polygon Mainnet
  //const webSocketRPC = "wss://polygon-mainnet.g.alchemy.com/v2/v1yRyN8d5t3pKS7XsnFzWHaPCfxv9MAF";
  // Polygon WebSocket provider
  let provider = new ethers.WebSocketProvider(webSocketRPC);

  // Fetch historical events and setup event listeners
  useEffect(() => {
    // Event interface for NewInformationStored
    const iface = new ethers.Interface([
      "event NewInformationStored(address indexed user, uint256 indexed index)"
    ]);

    // Ethereum contract instance
    const contract = new ethers.Contract(contractAddress, iface, provider);

    // Function to fetch historical events
    const fetchHistoricalEvents = async () => {
      try {
        // Web3 WebSocket provider
        const web3Provider = new Web3(new Web3.providers.WebsocketProvider(webSocketRPC));
        const topic0 = ethers.id("NewInformationStored(address,uint256)");
        const filter = {
          fromBlock: "0x2E5ACA0", // Reference Block to start fetching
          address: "0xfE51B21B92ee14fc85090eDe6fB3A28881eCd5e6",
          topics: [topic0, null, null, null]
        };

        // Fetch historical logs
        const historicalLogs = await web3Provider.eth.getPastLogs(filter);
        const parsedLogs = historicalLogs.map((log) => {
          const decoded = iface.decodeEventLog("NewInformationStored", log.data, log.topics);
          return { user: decoded[0], index: decoded[1].toString() };
        });

        setNewInformationEvents(parsedLogs);
      } catch (error) {
        console.error('Error fetching historical events:', error);
      }
    };

    fetchHistoricalEvents();

    // Subscribe to NewInformationStored events
    contract.on("NewInformationStored", (user, index) => {
      const event = { name: "NewInformationStored", user, index: index.toString() };
      setNewInformationEvents((prevEvents) => {
        // Filter out duplicates
        if (!prevEvents.some((prevEvent) => prevEvent.user === user && prevEvent.index === event.index)) {
          return [...prevEvents, event];
        }
        return prevEvents;
      });
    });

    // Unsubscribe from the events when the component unmounts
    return () => {
      contract.removeAllListeners();
    };
  }, []);

  // Display encrypted data and handle decryption
  const handleDisplayEncryptedData = async (event) => {
    setSelectedEvent(event);
    setCustomDecryptionKey('');
    setDecryptedData('');
    const encryptedData = await retrieveEncryptedData(event.user, event.index, provider, contractAddress);
    setDisplayingEncryptedData(encryptedData);
  };

  const handleDecryptData = (event) => {
    try {
      const bytes = CryptoJS.AES.decrypt(displayingEncryptedData[0], customDecryptionKey);
      const originalData = bytes.toString(CryptoJS.enc.Utf8);
      setDecryptedData(originalData);
      setSelectedEvent(event);
    } catch (error) {
      console.error('Error decrypting data:', error);
    }
  };

  return (
    <div>
      <ul>
        {newInformationEvents.map((event, index) => (
          <li key={index}>
            <p>User: {event.user}</p>
            <p>Id: {event.index}</p>
            {selectedEvent === event ? (
              <div>
                <h3>Encrypted Data:</h3>
                <p className='json-text'>{displayingEncryptedData}</p>
                <input className="inputs"
                  type="text"
                  placeholder="Enter your key"
                  value={customDecryptionKey}
                  onChange={(e) => setCustomDecryptionKey(e.target.value)}
                />
                <button className="pretty-button" onClick={() => handleDecryptData(event)}>Decrypt data</button>
                {decryptedData && (
                  <div>
                    <h3>Decrypted Data:</h3>
                    <pre className='json-text'>{decryptedData}</pre>
                  </div>
                )}
              </div>
            ) : (<button className="pretty-button" onClick={async () => await handleDisplayEncryptedData(event)}>Display Encrypted Data</button>)
          }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Decryption;

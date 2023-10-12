import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import WalletConnected from './components/WalletConnected';

function App() {
  // State variables
  const [signer, setSigner] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showNoWalletMessage, setShowNoWalletMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [account, setAccount] = useState('0x0');
  const [encryptionKey, setEncryptionKey] = useState('');

  const requiredChainId = '0x89'; // Polygon chainId in hexadecimal
  let provider;
  let getSigner;

  // Function to connect to the Polygon network
  const connectToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: requiredChainId }],
      });
    } catch (error) {
      if (error.message === 'Unrecognized chain ID "0x89". Try adding the chain using wallet_addEthereumChain first.') {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: requiredChainId,
                chainName: 'Polygon',
                rpcUrls: ['https://polygon-rpc.com/'],
              },
            ],
          });
        } catch (addChainError) {
          setErrorMessage('Failed to connect to Polygon. Please try again later.');
          console.error('Error adding Polygon chain:', addChainError);
        }
      } else {
        setErrorMessage('Failed to switch to Polygon. Please try again later.');
        console.error('Error switching to Polygon chain:', error);
      }
    }
  };

  // Function to generate an encryption key
  const generateEncryptionKey = async () => {
    try {
      const messageToSign = 'SECURE WEB3 ENCRYPTION KEY GENERATOR';
      const userSignature = await signer.signMessage(messageToSign);
      setEncryptionKey(userSignature);
    } catch (error) {
      console.error('Error generating encryption key:', error);
    }
  }

  useEffect(() => {
    // Function to check wallet connection
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          provider = new ethers.BrowserProvider(window.ethereum);
          getSigner = await provider.getSigner();
          setSigner(getSigner);

          const chainId = (await provider.getNetwork()).chainId;

          if (window.ethereum.isConnected()) {
            setIsWalletConnected(true);
            setShowNoWalletMessage(false);
          } else {
            setIsWalletConnected(false);
            setShowNoWalletMessage(true);
            setErrorMessage('No wallet connected. Please connect your wallet to use this application.');
          }

          if (chainId.toString() !== requiredChainId) {
            // Connected to the wrong network, show an error message
            setErrorMessage('Please switch your wallet to the Polygon network to use this application.');
            await connectToPolygon();
          }

          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          if (accounts.length === 0) {
            // No account is connected, show an error message
            setIsWalletConnected(false);
            setShowNoWalletMessage(true);
            setErrorMessage('Please connect your account to use this application.');
          }

          setAccount(accounts[0]);
        } catch (error) {
          setIsWalletConnected(false);
          setShowNoWalletMessage(false);
          setErrorMessage('Failed to connect to your wallet. Please make sure your wallet is unlocked and try again.');
          console.error('Error connecting to wallet:', error);
        }
      } else {
        setShowNoWalletMessage(true);
      }
    };

    checkWalletConnection();

    // Function to handle changes in the chain and accounts
    const requestPolygonConnection = async (chainId) => {
      if (chainId !== requiredChainId) {
        try {
          setErrorMessage('Please switch your wallet to the Polygon network to use this application.');
          setIsWalletConnected(false);
          await connectToPolygon();
        } catch (error) {
          setErrorMessage('Failed to switch to Polygon. Please try again later.');
          console.error('Error switching to Polygon chain:', error);
        }
      } else {
        setIsWalletConnected(true);
      }
    };

    // Function to check accounts
    const checkAccounts = async (accounts) => {
      if (accounts.length === 0) {
        // No account is connected, show an error message
        setIsWalletConnected(false);
        setErrorMessage('Please connect your account to use this application.');
        getSigner = await provider.getSigner();
        setSigner(getSigner);
      } else {
        getSigner = await provider.getSigner();
        setEncryptionKey('');
        setSigner(getSigner);
        setIsWalletConnected(true);
        setShowNoWalletMessage(false);
      }

      setAccount(accounts[0]);
    }

    if (window.ethereum) {
      window.ethereum.on('chainChanged', requestPolygonConnection);
      window.ethereum.on('accountsChanged', checkAccounts);
    }

    // Cleanup event listeners
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', requestPolygonConnection);
        window.ethereum.removeListener('accountsChanged', checkAccounts);
      }
    };
  }, []);
  
  return (
    <div className="App">
      <header className="App-header">
        {showNoWalletMessage ? (
          <div className="Wallet-Not-Found-Message">
            <p>
              Please install MetaMask or a compatible Ethereum wallet extension to use this application.
            </p>
          </div>
        ) : (
          isWalletConnected ? (
            <div className='core-structure'>
                <p className="Connected-Account">Connected Account: {account}</p>
                  {!encryptionKey && 
                  <button className= "Encryption-key pretty-button" onClick={async () => await generateEncryptionKey()}>Encryption key</button>
                  }
                <div className="Wallet-Connected">
                  <WalletConnected 
                    signer={signer} 
                    encryptionKey={encryptionKey} 
                    contractAddress={process.env.REACT_APP_CONTRACT_ADDRESS}
                    webSocketRPC = {process.env.REACT_APP_WEBSOCKET_RPC}
                  />
                </div>
            </div>
          ) : (
            <div>
              <p>Please connect your wallet</p>
              {errorMessage && <p className="Error-Message">{errorMessage}</p>}
            </div>
          )
        )}
      </header>
    </div>
  );
}

export default App;

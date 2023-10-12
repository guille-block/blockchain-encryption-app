# React Blockchain data encryption and decryption App

This is a React-based web application that allows users to interact with a smart contract on the Polygon blockchain to store and retrieve encrypted data. The app includes encryption and decryption features, as well as the ability to view historical events related to data storage.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)

## Features
- Connect your Wallet to interact with the Polygon blockchain.
- Generate an encryption key for data encryption.
- Store encrypted data on the blockchain.
- Retrieve and decrypt stored data using a custom decryption key.
- View historical events related to data storage.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

## Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/guille-block/blockchain-encryption-app.git
   ````
2. Navigate to the project directory:
   ```bash
   cd blockchain-encryption-app
   ````
3. Install the project dependencies:
   ```bash
   npm install
   ````
## Usage
1. Set *.env* file and its variables, you can Use *.env-example*. Make sure you are pointing to the correct contract address
2. Start developement server:
   ```bash
   npm start
   ````
3. Open your web browser and navigate to **http://localhost:3000** to use the app.
4. You can now start using the app. Connect your web3 wallet and generate your encryption key. Once you have this, you will be allowed to encrypt, decrpyt & store data on Polygon!

## Components
The app consists of the following components:

**App**: The main component that manages wallet connection and rendering other components.
**WalletConnected**: Responsible for displaying connected wallet information and managing data encryption.
**InputForm**: Allows users to input data, add it to a JSON object, and encrypt the data using an encryption key.
**Decryption**: Provides the functionality to retrieve and decrypt encrypted data stored on the blockchain.
   

   

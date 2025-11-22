import React, { useState } from 'react';
import Layout from './components/Layout';
import AddressInput from './components/AddressInput';
import ChainSelector from './components/ChainSelector';
import ABIManager from './components/ABIManager';
import FunctionList from './components/FunctionList';
import BackgroundParticles from './components/BackgroundParticles';
import useContract from './hooks/useContract';

function App() {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('1');
  const [abi, setAbi] = useState(null);
  
  const { callFunction } = useContract(address, abi, chainId);

  return (
    <>
      <BackgroundParticles />
      <Layout>
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
            Interact with any smart contract
          </h1>
          <p className="text-slate-400 text-lg">
            Instantly generate a UI for your smart contracts. Just paste the address and ABI.
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
            <ChainSelector selectedChain={chainId} onSelectChain={setChainId} />
            <AddressInput value={address} onAddressChange={setAddress} />
          </div>

          <ABIManager onAbiChange={setAbi} />
        </div>

        {abi && (
          <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent my-8"></div>
            <FunctionList abi={abi} onCall={callFunction} />
          </div>
        )}
      </div>
    </Layout>
    </>
  );
}

export default App;

/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createWalletClient, custom } from "viem";
import Button from "./components/Button";
import { sepolia } from "viem/chains";
import Header from "./components/Header";


import React, { useState } from "react";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  async function connect() {
    // 2. Check for MetaMask (the window.ethereum provider)
    // @ts-expect-error: window.ethereum is not in the standard window type
    if (typeof window.ethereum !== 'undefined') {
      try {
        console.log('MetaMask found, connecting...');

        const walletClient = createWalletClient({
          chain: sepolia,
          // @ts-expect-error:errr
          transport: custom(window.ethereum),
        });

        // 3. Await the result of the function call
        const addresses = await walletClient.requestAddresses();
        setIsConnected(true);

        // 4. The result is an array, get the first address
        const account = addresses[0];

        console.log(`✅ MetaMask connected at: ${account}`);
        // Now you can set the account in your app's state
        // setAccount(account);

      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    } else {
      // Handle the case where the user doesn't have MetaMask installed
      console.log('MetaMask is not installed. Please install it to continue.');
      alert('MetaMask is not installed!');
    }
  }

  return (
    <div>
      <h2>DEFI dex</h2>
      <header>
        <Button className="buttonConnect" onClick={connect}>
          {isConnected ? "connected" : "connect"}
        </Button>
      </header>
    </div>
  );
}

export default App

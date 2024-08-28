"use client";
import { useState, useEffect } from "react";
import Web3 from "web3";
import { ChainlinkPlugin, MainnetPriceFeeds } from "@chainsafe/web3-plugin-chainlink";
import Link from "next/link";
import Image from "next/image";

interface Asset {
  name: string;
  value: string;
  unit: string;
}

const Home: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [web3, setWeb3] = useState<Web3 | null>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = new Web3("https://ethereum-rpc.publicnode.com");
      await web3Instance.registerPlugin(new ChainlinkPlugin());
      setWeb3(web3Instance);
    };
    initWeb3();
  }, []);

  async function fetchAndConvertAssets() {
    if (!web3) return;
    try {
      const balanceInWei = await web3.eth.getBalance(walletAddress);
      const balanceInEth = parseFloat(web3.utils.fromWei(balanceInWei, 'ether'));

      const btcPriceUSD = await web3.chainlink.getPrice(MainnetPriceFeeds.BtcUsd);
      const ethPriceUSD = await web3.chainlink.getPrice(MainnetPriceFeeds.EthUsd);

      const btcPriceValue = parseFloat(btcPriceUSD.answer.toString()) / 1e8; // Chainlink prices are in 8 decimal places
      const ethPriceValue = parseFloat(ethPriceUSD.answer.toString()) / 1e8;

      const ethInUsd = balanceInEth * ethPriceValue;
      const ethInBtc = balanceInEth * (ethPriceValue / btcPriceValue);

      setAssets([
        { name: "ETH Balance", value: balanceInEth.toFixed(8), unit: "ETH" },
        { name: "USD Value", value: ethInUsd.toFixed(2), unit: "USD" },
        { name: "BTC Value", value: ethInBtc.toFixed(8), unit: "BTC" },
      ]);
    } catch (error) {
      console.error("Error fetching or converting assets:", error);
    }
  }

  return (
    <div className="bg-gradient-to-br from-lavender-400 via-white to-lavender-600 min-h-screen flex flex-col items-center justify-between">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 shadow-md">
        <h1 className="text-2xl font-semibold">Crypto Converter</h1>
      </header>

      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-full max-w-md text-center mt-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">Wallet Asset Converter</h1>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className={`w-full p-4 mb-4 border-2 rounded-lg focus:outline-none 
            ${walletAddress ? 'bg-lavender-100 border-pink-500' : 'bg-white border-lavender-200'}
            focus:bg-lavender-200 focus:border-pink-500 transition-colors duration-300`}
        />
        <button
          onClick={fetchAndConvertAssets}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg mb-4 hover:bg-pink-600 active:bg-purple-700 transition duration-300"
        >
          Fetch and Convert Assets
        </button>
        <div className="mt-8">
          {assets.map((asset, index) => (
            <div key={index} className="bg-gradient-to-r from-lavender-300 to-lavender-100 p-4 mb-4 rounded-lg shadow-sm">
              <p className="text-purple-800">{asset.name}: {asset.value} {asset.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-lavender-600 text-white p-4 text-center shadow-md mt-8">
        <p>&copy; 2024 Crypto Converter. All rights reserved.</p>
        <p> Made by Adama</p>
        <Link href="https://github.com/Adama00/MyDapp">
          <Image src="/github.jpeg" alt="Github" width={29} height={29} className="inline-block" />
        </Link>
      </footer>
    </div>
  );
};

export default Home;
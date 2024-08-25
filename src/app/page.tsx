"use client";
import { useState } from "react";
import Web3 from "web3";
import { ChainlinkPlugin, MainnetPriceFeeds } from "@chainsafe/web3-plugin-chainlink";
import Link from "next/link";
import Image from "next/image";

interface Asset {
  name: string;
  value?: string; 
  valueInBTC: string; 
}

const Home: React.FC = () => {
  const [btcPrice, setBtcPrice] = useState("000");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [btcAssets, setbtcAssets] = useState<Asset[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Initialize RPC/injected provider
  const web3 = new Web3("https://mainnet.infura.io/v3/569d330257ac45a3b6ad24f3aff543ff");

  // Register the plugin
  web3.registerPlugin(new ChainlinkPlugin());

  async function fetchAssetsAndConvertToBTC() {
    const balanceInWei = await web3.eth.getBalance(walletAddress);
    const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

    const btcprice = await web3.chainlink.getPrice(MainnetPriceFeeds.BtcUsd);
    const btcPriceValue = btcprice.answer.toString();

    const ethInBtc = parseFloat(balanceInEth) / parseFloat(btcPriceValue);

    setAssets([{ name: "ETH", valueInBTC: ethInBtc.toFixed(4) }]);
  }

  async function fetchAssetsAndConvertToETH() {
    try {
      const balanceInWei = await web3.eth.getBalance(walletAddress);
      const balanceInEth = web3.utils.fromWei(balanceInWei, 'ether');

      const btcPriceUSD = await web3.chainlink.getPrice(MainnetPriceFeeds.BtcUsd);
      const btcPriceValue = parseFloat(btcPriceUSD.answer.toString());

      const ethPriceUSD = await web3.chainlink.getPrice(MainnetPriceFeeds.EthUsd);
      const ethPriceValue = parseFloat(ethPriceUSD.answer.toString());

      const btcToEth = parseFloat(balanceInEth) * (btcPriceValue / ethPriceValue);

      setbtcAssets([{ name: "BTC", valueInBTC: btcToEth.toFixed(4) }]);

    } catch (error) {
      console.log("Error Fetching or converting prices", error);
    }
  }

  return (
    <div className="bg-gradient-to-br from-lavender via-white to-lavender min-h-screen flex flex-col items-center justify-between">
      {/* Header */}
      <header className="w-full bg-purple text-white p-4  shadow-md">
        <h1 className="text-2xl font-semibold">Crypto Converter</h1>
      </header>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-purple mb-8">Wallet Asset Converter</h1>
        <input
          type="text"
          placeholder="Enter wallet address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full p-4 mb-4 border-2 border-purple rounded-lg focus:outline-none focus:border-pink"
        />
        <button
          onClick={() => {
            fetchAssetsAndConvertToBTC();
            fetchAssetsAndConvertToETH();
          }}
          className="bg-purple text-white p-4 rounded-lg mb-4 hover:bg-pink transition duration-300"
        >
          Fetch and Convert Assets to BTC
        </button>
        <div className="mt-8">
          {assets.map((asset, index) => (
            <div key={index} className="bg-gradient-to-r from-lavender to-white p-4 mb-4 rounded-lg shadow-sm">
              <p className="text-purple">{asset.name}: {asset.valueInBTC} BTC</p>
            </div>
          ))}
        </div>

        <button
          onClick={fetchAssetsAndConvertToETH}
          className="bg-purple text-white p-4 rounded-lg mb-4 hover:bg-pink transition duration-300"
        >
          Fetch and Convert BTC to ETH
        </button>
        <div className="mt-8">
          {btcAssets.map((asset, index) => (
            <div key={index} className="bg-gradient-to-r from-lavender to-white p-4 mb-4 rounded-lg shadow-sm">
              <p className="text-purple">{asset.name}: {asset.valueInBTC} ETH</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-purple text-white p-4 text-center shadow-md mt-8">
        <p>&copy; 2024 Crypto Converter. All rights reserved.</p>
        <p className="ml-1"> Made by Adama</p>
        <Link href={"https://github.com/Adama00/MyDapp"}><Image src="" alt="Github"/></Link>
      </footer>
    </div>
  );
};

export default Home;

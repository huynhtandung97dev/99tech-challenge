import React, { useState, useEffect } from "react";
import pricesRaw from "./assets/prices.json";
import "./App.css";
import { TokenSelect } from "./components/TokenSelect";

type PriceEntry = {
  currency: string;
  date: string;
  price: number;
};

const getLatestPrice = (prices: PriceEntry[], currency: string) => {
  const matched = prices.filter(p => p.currency === currency);
  return matched.length ? matched[matched.length - 1].price : null;
};

export default function App() {
  const [tokens, setTokens] = useState<string[]>([]);
  const [fromToken, setFromToken] = useState("USD");
  const [toToken, setToToken] = useState("USDC");
  const [inputAmount, setInputAmount] = useState<number>(1);
  const [outputAmount, setOutputAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const uniqueTokens = Array.from(new Set(pricesRaw.map(p => p.currency)));
    setTokens(uniqueTokens);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const fromPrice = getLatestPrice(pricesRaw, fromToken);
    const toPrice = getLatestPrice(pricesRaw, toToken);

    if (!fromPrice || !toPrice || fromToken === toToken || inputAmount <= 0) {
      alert("Invalid swap");
      return;
    }

    const converted = (inputAmount * fromPrice) / toPrice;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOutputAmount(Number(converted.toFixed(6)));
      setSuccess(true);
    }, 800);
  };

  return (
    <form id="swap-form" onSubmit={handleSubmit}>
      <h2>Token Swap</h2>

      <TokenSelect tokens={tokens} value={fromToken} onChange={setFromToken} label="From" />
      <TokenSelect tokens={tokens} value={toToken} onChange={setToToken} label="To" />

      <label>Amount</label>
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(Number(e.target.value))}
        placeholder="0.0"
      />

      <label>You will receive</label>
      <input disabled value={outputAmount || ""} placeholder="0.0" />

      <button type="submit" disabled={loading}>
        {loading ? "Swapping..." : "CONFIRM SWAP"}
      </button>

      {loading && <div id="loading">⏳ Swapping...</div>}
      {success && <div id="success">✅ Swap Successful!</div>}
    </form>
  );
}

import { useEffect, useState } from "react";
import "./App.css";
const API_URL ="https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
function App() {
  const [coins, setCoins]=useState([]); // all data from API
  const [search, setSearch]=useState(""); // text typed in search box
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState("");
  const fetchWithThen=()=>{
    setLoading(true);
    setError("");
    fetch(API_URL)
      .then((response)=>{
        if (!response.ok){
          throw new Error("Request failed with status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        setCoins(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  const fetchWithAsync = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWithThen();
  }, []);
  const sortByMarketCap = () => {
    const sorted = [...coins].sort((a, b) => b.market_cap - a.market_cap);
    setCoins(sorted);
  };
  const sortByPercentage = () => {
    const sorted = [...coins].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    setCoins(sorted);
  };
  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="container">
      <h1>Crypto Market</h1>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or symbol"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={sortByMarketCap}>Sort by Mkt Cap</button>
        <button onClick={sortByPercentage}>Sort by percentage</button>
        <button onClick={fetchWithThen}>Reload (.then)</button>
        <button onClick={fetchWithAsync}>Reload (async/await)</button>
      </div>
      {loading && <p className="message">Loading...</p>}
      {error && <p className="message error">Error: {error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Id</th>
              <th>Current Price</th>
              <th>Total Volume</th>
              <th>Market Cap</th>
              <th>24h Change</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr key={coin.id}>
                <td>
                  <img src={coin.image} alt={coin.name} width="28" height="28" />
                </td>
                <td>{coin.name}</td>
                <td>{coin.symbol.toUpperCase()}</td>
                <td>{coin.id}</td>
                <td>${coin.current_price.toLocaleString()}</td>
                <td>${coin.total_volume.toLocaleString()}</td>
                <td>${coin.market_cap.toLocaleString()}</td>
                <td
                  className={
                    coin.price_change_percentage_24h >= 0 ? "green" : "red"
                  }
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
              </tr>
            ))}
            {filteredCoins.length === 0 && (
              <tr>
                <td colSpan="8">No coins found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default App;

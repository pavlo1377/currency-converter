// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [input, setInput] = useState("");
  const [currency1, setCurrency1] = useState("EUR");
  const [currency2, setCurrency2] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const outputIfNum = (
    <>
      <strong>{input}</strong> <strong>{currency1}</strong> is equal to{" "}
      <strong>{output}</strong> <strong>{currency2}</strong>
    </>
  );

  function handleOnReset() {
    setInput("");
    setCurrency1("EUR");
    setCurrency2("USD");
  }

  useEffect(
    function () {
      async function fetchCurrency() {
        setError("");
        if (input <= 0) {
          setOutput("");
          return;
        }
        if (currency1 === currency2) {
          setOutput(input);
          return;
        }

        try {
          setIsLoading(true);
          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${input}&from=${currency1}&to=${currency2}`
          );
          if (!res.ok) {
            throw new Error("Failed to fetch data from the server.");
          }
          const { rates } = await res.json();
          const result = rates[currency2];
          setOutput(result);
          setIsLoading(false);
        } catch (err) {
          setError(err.message || "Something went wrong. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
      fetchCurrency();
    },
    [input, currency1, currency2]
  );

  return (
    <div className="container">
      <h1>Currency Converter</h1>
      <input
        placeholder="Please enter a value..."
        type="number"
        min={1}
        max={1000000}
        value={input}
        onChange={(e) => {
          const value = e.target.value;
          setInput(value === "" ? "" : Number(value));
        }}
      />
      <select
        disabled={isLoading}
        value={currency1}
        onChange={(e) => setCurrency1(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        disabled={isLoading}
        value={currency2}
        onChange={(e) => setCurrency2(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>{typeof output === "number" ? outputIfNum : output}</p>
      )}
      <button onClick={handleOnReset}>Reset</button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface SearchResult {
    senderName: string;
    senderPhone: string;
    receiverName: string;
    receiverPhone: string;
    transactionId: string;
    transactionDate: string;
    amount: string;
    status: string;

}

export default function CBEVeification() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code.length < 10 || phone.length <10) {
      setResults(null);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      searchCode(code,phone);
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [code,phone]);

  const searchCode = async (code:string,phone:string) => {
    try {
      setLoading(true);
      setError("");

      // 🔌 Replace this with your real API call
      // const res = await fetch(`/api/search?code=${searchValue}`);
      // const data = await res.json();
      const res = await fetch("http://localhost:3001/verify/cbe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: code, phone: phone }),
        }
      )
      const datta = await res.json();
      console.log(JSON.stringify(datta));


      // Mock response
      setResults(datta);

      // setResults(data);
    } catch (err) {
      setError("Unable to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          CBE Verification
        </h1>
        <p className="text-gray-500 mb-6">
          Enter a valid code to retrieve details
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code to search..."
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
        />
        <p className="text-gray-500 mt-6 mb-3">
          Enter a valid Phone associated with transaction
        </p>

        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone to search..."
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-400"
        />

<div className="mt-6">
          {loading && (
            <p className="text-blue-600 animate-pulse">Searching...</p>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          {!loading && results &&  (
            <div className="mt-6 bg-white rounded-xl shadow-sm border p-6 text-left">
              {
                results.receiverName ? (
                  <>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                Search Result
              </h2>

              <div className="space-y-2 text-gray-600">
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Transaction To:</span>{" "}
                  {results.receiverName}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Receiver Phone:</span>{" "}
                  {results.receiverPhone}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Transaction From:</span>{" "}
                  {results.senderName}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Sender Phone:</span>{" "}
                  {results.senderPhone}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Created At:
                  </span>{" "}
                  {results.transactionDate}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Transaction Amount:
                  </span>{" "}
                  {results.amount}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Transaction ID:
                  </span>{" "}
                  {results.transactionId}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Transaction Status:
                  </span>{" "}
                  {results.status}
                </p>
              </div>
                  </>
                ):(
                  <>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                Search Result
              </h2>

              <div className="space-y-2 text-gray-600">
                <p className="text-red-500">
                  Transaction Verification failed. Please check the code and try again.
                </p>
               
               
              </div>
                  </>
                )
              }
            </div>
          )}

          {!loading && code.length >= 10 && !results && !error && (
            <p className="text-gray-500 mt-4">No results found.</p>
          )}
        </div>

      </div>
    </div>
  );
}

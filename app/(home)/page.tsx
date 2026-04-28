"use client";

import { useEffect, useState } from "react";

interface SearchResult {
  success: boolean;
  data: {
    payer_name: string;
    payer_phone: string;
    credited_party_name: string;
    credited_party_acc_no: string;
    date: string;
    settled_amount: number;
  }
}

export default function Home() {
  const [code, setCode] = useState("");
  
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code.length < 10) {
      setResults(null);
      setError("");
      return;
    }

    const timeout = setTimeout(() => {
      searchCode(code);
    }, 400); // debounce

    return () => clearTimeout(timeout);
  }, [code]);

  const searchCode = async (searchValue:string) => {
    try {
      setLoading(true);
      setError("");

   
      const res = await fetch("https://marlin-enjoyable-yodel.ngrok-free.dev/verify/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiptNo: searchValue }),
        }
      )
      const datta = await res.json();
      console.log(JSON.stringify(datta));
      if(!datta.data){
        setError(datta.error || "No results found for the provided code.");
        setResults(null);
        return;
      }


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
          TELEBIRR Verification
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
                results.data.credited_party_acc_no ? (
                  <>
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                Search Result
              </h2>

              <div className="space-y-2 text-gray-600">
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Transaction To:</span>{" "}
                  {results.data.credited_party_name}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Receiver Phone:</span>{" "}
                  {results.data.credited_party_acc_no}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Transaction From:</span>{" "}
                  {results.data.payer_name}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">Sender Phone:</span>{" "}
                  {results.data.payer_phone}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Created At:
                  </span>{" "}
                  {results.data.date}
                </p>
                <p className="text-blue-800">
                  <span className="font-medium text-gray-800">
                    Transaction Amount:
                  </span>{" "}
                  {results.data.settled_amount}
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

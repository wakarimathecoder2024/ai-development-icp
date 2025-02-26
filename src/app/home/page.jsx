"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../_components/authcontext";
import { useRouter } from "next/navigation";
import { NFIDProvider, deleteFilteredDocs, initSatellite, listDocs, setDoc, signIn,signOut } from "@junobuild/core";
import { nanoid } from "nanoid";
import Link from "next/link";
const HomePage = () => {
  const { user } = useAuthContext();
  const router = useRouter();
  const searchHistory = [
    { id: 1, query: "What is ICP?", timestamp: "2023-10-01 10:30" },
    { id: 2, query: "How does AI work on ICP?", timestamp: "2023-10-02 14:45" },
    { id: 3, query: "Benefits of decentralized AI", timestamp: "2023-10-03 09:15" },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);
  const [search, setSearch] = useState("");

  const [response, setResponse] = useState("");
  const [usersHistory, setHistory] = useState([]);
  const myId = nanoid();
  useEffect(() => {
    (async () =>
      await initSatellite({
        satelliteId: "644bf-biaaa-aaaal-ar7fq-cai",
      }))();
  }, []);

  useEffect(() => {
    (async () => {
      const { items } = await listDocs({
        collection: "ai",
        filter: {
          order: {
            desc: true,
            field: "updated_at",
          },
        },
      });
console.log("users history",usersHistory)
      setHistory(items);
    })();
  }, []);

 
  const handleHistory = async () => {
    await deleteFilteredDocs({
      collection: "ai",
      filter: {
        // Same options as filter of listDocs
      },
    });
    const { items } = await listDocs({
      collection: "ai",
      filter: {
        order: {
          desc: true,
          field: "updated_at",
        },
      },
    });
    setHistory(items);
    setResponse("")
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify({
        message: search,
      }),
    });
    const Data = await response.text();
    setResponse(Data);
    await setDoc({
      collection: "ai",
      doc: {
        key: myId,
        data: {
          message: search,
          response: Data,
        },
      },
    });
    const { items } = await listDocs({
      collection: "ai",
      filter: {
        order: {
          desc: true,
          field: "updated_at",
        },
      },
    });
    setHistory(items);
    console.log(items, "histor8989898989y");
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-lg p-4">
      <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-blue-600">AI in ICP</h1>
        <button className="text-red-700"  onClick={signOut}>sign out</button>
      </div>
      <h2 className="text-xl font-bold text-blue-800 mb-4">Search History</h2>
      <ul className="space-y-2">
        {usersHistory.map((value,_index) => (
          <li key={_index} className="text-gray-700 hover:text-blue-600">
            
              <div className="cursor-pointer">
                <p className="font-semibold"  onClick={() => setResponse(value.data.response)}>{value.data.message}</p>
               
              </div>
          
          </li>
        ))}
      </ul>
      {
          usersHistory.length>0 &&(
          <button className="text-red-700 border p-2  rounded-md"  onClick={handleHistory}>clear history</button>
          )
      }
    </aside>

    {/* Main Content */}
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">AI Search</h1>
      {/* Search Bar */}
      <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="cursor-pointer p-2 ">ask</button>
      </div>
      </form>

      {/* Search Results */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Search Results</h2>
        <p className="text-gray-700">
         {response}
        </p>
      </div>
    </main>
  </div>
  );
};

export default HomePage;

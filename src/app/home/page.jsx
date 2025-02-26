"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "../_components/authcontext";
import { useRouter } from "next/navigation";
import { NFIDProvider, deleteFilteredDocs, initSatellite, listDocs, setDoc, signIn } from "@junobuild/core";
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
  const [his, setHis] = useState([]);
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

      setHis(items);
    })();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDeafult();
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
      collection: "history",
      doc: {
        key: myId,
        data: {
          message: search,
          response: Data,
        },
      },
    });
    const { items } = await listDocs({
      collection: "history",
      filter: {
        order: {
          desc: true,
          field: "updated_at",
        },
      },
    });
    setHis(items);
    console.log(items, "history");
  };
  const handleClearHistory = async () => {
    await deleteFilteredDocs({
      collection: "history",
      filter: {
        // Same options as filter of listDocs
      },
    });
    const { items } = await listDocs({
      collection: "history",
      filter: {
        order: {
          desc: true,
          field: "updated_at",
        },
      },
    });
    setHis(items);
    setResponse("")
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
    {/* Sidebar */}
    <aside className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Search History</h2>
      <ul className="space-y-2">
        {searchHistory.map((item) => (
          <li key={item.id} className="text-gray-700 hover:text-blue-600">
            <Link href={`/search?q=${item.query}`}>
              <div className="cursor-pointer">
                <p className="font-semibold">{item.query}</p>
                <p className="text-sm text-gray-500">{item.timestamp}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>

    {/* Main Content */}
    <main className="flex-grow p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">AI Search</h1>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Ask me anything..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Search Results */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Search Results</h2>
        <p className="text-gray-700">
          Your search results will appear here. Try asking a question about ICP or AI!
        </p>
      </div>
    </main>
  </div>
  );
};

export default HomePage;

"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./_components/authcontext";
import { useEffect } from "react";
import { NFIDProvider, initSatellite, signIn } from "@junobuild/core";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
 
  useEffect(() => {
    (async () =>
      await initSatellite({
        satelliteId: "644bf-biaaa-aaaal-ar7fq-cai",
      }))();
  }, []);

  const handleRoute = async () => {
    if (!user) {
      await signIn({
        provider: new NFIDProvider({
          appName: "AI",
          logoUrl: "",
        }),
      });
      router.push("/home");
    }
    router.push("/home");
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Navbar */}
      <nav className="w-full p-4 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">AI in ICP</h1>
         
          {user ? (
          <>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300" onClick={() => router.push("/home")}>
              Get Started
            </button>
          </>
        ) : (
          <>
            <button className="bg-red-600 p-2 rounded-md" onClick={handleRoute}>
              Login
            </button>
          </>
        )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-8">
        {/* Welcome Section */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Welcome to AI in ICP</h2>
          <p className="text-lg text-gray-700 max-w-2xl">
            Our AI-powered platform is here to answer your questions and provide you with the best solutions on the Internet Computer Protocol.
          </p>
        </section>

        {/* ICP Security Section */}
        <section className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Why ICP is Secure and Decentralized</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              The Internet Computer Protocol (ICP) is designed to provide a secure and decentralized environment for building and running applications. Unlike traditional cloud services, ICP leverages blockchain technology to ensure data integrity and transparency.
            </p>
            <p>
              With ICP, your data is stored across multiple nodes, making it highly resistant to censorship and single points of failure. This decentralized approach ensures that your information remains secure and accessible at all times.
            </p>
            <p>
              Additionally, ICP uses advanced cryptographic techniques to protect your data and transactions, ensuring that only authorized users can access sensitive information.
            </p>
          </div>
        </section>

        {/* Benefits Section */}
       
      </main>

      {/* Footer */}
      <footer className="w-full p-4 bg-white shadow-inner">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} AI in ICP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

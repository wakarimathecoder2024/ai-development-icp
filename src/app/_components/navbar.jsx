"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "./authcontext";
import { useEffect } from "react";
import { NFIDProvider, initSatellite, signIn } from "@junobuild/core";

const NavBar = () => {
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    (async () =>
      await initSatellite({
        satelliteId: "tcalk-7iaaa-aaaal-arsaq-cai",
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
    <div className="flex justify-between py-5">
      <h1 className="font-bold t cursor-pointer">PgAi</h1>

      <div className="flex items-center space-x-7">
        {user ? (
          <>
            <button
              className="bg-blue-700 p-2 rounded-md"
              onClick={() => router.push("/home")}
            >
              Get Started
            </button>
            <button className="bg-red-600 p-2 rounded-md" onClick={handleRoute}>
              Log-out
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
    </div>
  );
};

export default NavBar;

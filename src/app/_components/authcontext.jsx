"use client"
import { authSubscribe } from "@junobuild/core"
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext=createContext({
    user:""
})

export const AuthContextProvider=({children})=>{
    const [user,setUser]=useState("");
    useEffect(()=>{
        const sub=authSubscribe((user)=>setUser(user?user.toString():""));
        return ()=>sub();
    },[]);
    return(
        <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>
    )
}
export const useAuthContext=()=>useContext(AuthContext)
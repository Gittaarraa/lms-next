import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const SidebarMenu = (props:any) => {
  const hoverBtn = "hover:bg-slate-600 hover:text-white duration-300 text-slate-600 py-2 px-6 rounded-r-full mt-2";
  const router = useRouter()

  const Logout = async () => {
    try {
      await axios.delete('/api/auth/logout');
      router.push(String(router.query.to||"/"))
    } catch (error) {
      console.log(error);
    }
  };
  return (
    
    <div className={`${props.isOpen ? "translate-x-0 duration-300" : "-translate-x-96 duration-500"} bg-white w-full sm:w-3/12 h-full fixed z-50 top-0 shadow-lg`}>
      <div className="flex flex-col font-semibold pr-4 py-4">
        <span className={`cursor-pointer ${hoverBtn}`}>
          <Link href="/">Home</Link>
        </span>
        <span className={`cursor-pointer ${hoverBtn}`}>
          <Link href="/users">Users</Link>
        </span>
        <span className={`cursor-pointer ${hoverBtn}`}>
          <Link href="/classes">Class</Link>
        </span>
        <span className={`cursor-pointer ${hoverBtn}`} onClick={Logout}>
          Logout
        </span>
      </div>
    </div>
  );
};

export const Navbar = () =>{
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="w-full shadow z-50">
        <div className="flex flex-row w-full p-4 bg-white">
          <span className="text-xl font-bold tracking-wide ml-8" onClick={() => setIsOpen(!isOpen)}>
            <button>IDN Boarding School</button>
          </span>
        </div>
        <SidebarMenu isOpen={isOpen} />
        {isOpen && <div className="w-full h-full opacity-40 z-40 fixed duration-300 top-0" onClick={() => setIsOpen(!isOpen)} />}
      </div>
  )
}
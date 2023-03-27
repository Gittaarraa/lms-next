import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const SidebarMenu = (props:any) => {
  const hoverBtn = "hover:bg-slate-600 hover:text-white duration-300 text-slate-600 py-1 px-4 rounded-r-md mt-2";
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
    <div className={`${props.isOpen ? "translate-x-0 duration-300" : "-translate-x-96 duration-500"} bg-white w-full sm:w-2/12 h-full fixed z-50`}>
      <div className="flex flex-col font-semibold pr-4 py-4">
        <span className={`cursor-pointer ${hoverBtn}`}>
          <Link href="/">Home</Link>
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

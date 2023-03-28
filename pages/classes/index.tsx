import React from "react";
import { Navbar } from "../components/navbar";

export default function Classes() {
  return (
    <div className="w-full h-full bg-gray-200">
      <Navbar />
      <div className="mx-14 mt-5 pb-10">
        <div className="flex space-between font-bold">
          <button className="flex hover:bg-white bg-white hover:shadow-md px-4 py-2 rounded mr-4 mb-4">
            <img src="/icons/audit.png" className="w-5 mr-2" />
            <p>Daftar Tugas</p>
          </button>
          <button className="flex hover:bg-white bg-white hover:shadow-md px-4 py-2 rounded mr-4 mb-4">
            <img src="/icons/plus.svg" className="w-5 mr-2" />
            <p>Add Class</p>
          </button>
        </div>
        <div className=" grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="bg-white rounded-lg p-4 w-72 h-72 relative hover:shadow-md">
            <div>
              <p className="text-medium font-semibold">RPL Bimbel 1</p>
              <p className="text-sm">SMK idn boarding school</p>
              <p className="text-sm">daffa</p>
            </div>
            <div className="bottom-4 right-4 absolute  flex ">
              <button>
                <img src="/icons/form.png" alt="" className="w-5" />
              </button>
              <img src="/icons/file.png" alt="" className="w-5 ml-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

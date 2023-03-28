import React from "react";
import { Navbar } from "../components/navbar";

export default function Users() {
  return (
    <div className="w-full bg-gray-200">
      <Navbar />
      <div className="py-10 px-20 h-screen">
        <button className="px-3 rounded-md mb-3 hover:bg-white duration-200 font-bold">New Users</button>
        <div className=" border rounded-3xl bg-white h-4/6 py-4">
          <table className="table-auto w-full ">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td>Sugiono</td>
                <td>Sugiono anjing memek asu</td>
                <td>Sugiono</td>
                <td>
                  <button className="bg-green-400 px-2 rounded-md text-bold">Edit</button>
                  <button className="bg-red-400 px-2 rounded-md text-bold">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

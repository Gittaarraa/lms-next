import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import axios from "axios";
import { User } from "@prisma/client";
import { prisma } from "@/utils/prismaConnect";

export default function Users({ users }: { users: User[] }) {
  const [usernames, setUsernames] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(2);

  const handleChange = async () => {
    await axios
      .put(`/api/users/2`, {
        username: usernames,
        name: name,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const handleDelete = async () => {
    await axios
      .delete(`/api/users/${users}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full bg-gray-200">
      <Navbar />
      <div className="py-10 px-20 h-screen">
        <button className="flex hover:bg-white bg-white hover:shadow-md px-4 py-2 rounded mr-4 mb-4">
          <img src="/icons/plus.svg" className="w-5 mr-2" />
          <p>Add Users</p>
        </button>
        <div className=" border rounded-3xl bg-white h-4/6 py-4">
          <table className="table-auto w-full ">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>users</th>
              </tr>
            </thead>
            <tbody>
              {users.map((e) => {
                return (
                  <tr className="text-center" key={e.id}>
                    <td>{e.username}</td>
                    <td>{e.name}</td>
                    <td>{e.level}</td>
                    <td>
                      <button className="bg-green-400 px-2 rounded-md text-bold mt-2 mr-2" onClick={() => setShowModal(true)}>
                        Edit
                      </button>
                      <button className="bg-red-400 px-2 rounded-md text-bold mr-2" onClick={handleDelete}>Remove</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*body*/}
                <form onSubmit={handleChange}>
                  <div className="relative p-6 flex-auto">
                    <div className="flex flex-col">
                      <label>Username</label>
                      <input type="text" className="rounded-xl px-4 py-2 w-72 mt-2 border-2 bg-white" value={usernames} onChange={(e) => setUsernames(e.target.value)} />
                    </div>
                    <div className="mt-5 flex flex-col">
                      <label>Name</label>
                      <input type="text" className="rounded-xl px-4 p-2 mt-2 border-2 bg-white" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      onClick={() => setShowModal(false)}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      
    </div>
  );
}

export async function getServerSideProps() {
  const users = await prisma.user.findMany();
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    }, // will be passed to the page component as props
  };
}

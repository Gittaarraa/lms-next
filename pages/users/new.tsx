import React, { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import axios from "axios";

function New() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");

  const handleNewUser = async () => {
    await axios
      .post("/api/users/", {
        username: username,
        password: password,
        level: level,
        name: name,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <Navbar />
      <form className="p-20" onSubmit={handleNewUser}>
        <div className="flex flex-col">
          <label>Username</label>
          <input type="text" className="rounded-xl px-4 py-2 mt-2 border-2 bg-white" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mt-5 flex flex-col">
          <label>Password</label>
          <input type="password" className="rounded-xl px-4 p-2 mt-2 border-2 bg-white" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mt-5 flex flex-col">
          <label>Name</label>
          <input type="text" className="rounded-xl px-4 p-2 mt-2 border-2 bg-white" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mt-5 flex flex-col">
          <label>Level</label>
          

          <div className="relative">
          
            <select className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state" onChange={(e) => setLevel(e.target.value)} defaultValue={'STUDENT'}>
              <option value={'ADMIN'}>Admin</option>
              <option value={'TEACHER'}>Teacher</option>
              <option value={'STUDENT'}>Student</option>
            </select>
          
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
        <button className="w-full mt-5 bg-blue-400 py-2 rounded-xl text-white font-medium" type="submit">
          Add Users
        </button>
      </form>
    </div>
  );
}

export default New;

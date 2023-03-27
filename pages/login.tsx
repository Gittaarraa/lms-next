import React from 'react'

export default function Login() {
  return (
    <div className="w-screen h-screen ">
      <div className=" flex flex-col justify-center w-screen sm:w-96 mx-auto h-full">
        <div className="bg-white p-4 rounded-xl">
          <p className="text-center mb-10 font-bold">LMS IDN BOARDING SCHOOL</p>
          <form>
            <div className="flex flex-col">
              <label>Username</label>
              <input type="text" className="rounded-xl px-4 py-2 mt-2 border-2 bg-white"/>
            </div>
            <div className="mt-5 flex flex-col">
              <label>Password</label>
              <input type="password" className="rounded-xl px-4 p-2 mt-2 border-2 bg-white"/>
            </div>
            <button className="w-full mt-5 bg-blue-400 py-2 rounded-xl text-white font-medium">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import {SidebarMenu} from './components/navbar'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="w-full shadow z-50">
        <div className="flex flex-row w-full p-4">
          <span className="text-xl font-bold tracking-wide ml-8" onClick={() => setIsOpen(!isOpen)}>
            <button>IDN Boarding School</button>
          </span>
        </div>
        <SidebarMenu isOpen={isOpen} />
      </div>
  )
}


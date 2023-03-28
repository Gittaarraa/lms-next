import React, { useState } from 'react'
import {Navbar, SidebarMenu} from './components/navbar'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="w-full bg-gray-200">
      <Navbar />
    </div>
  )
}


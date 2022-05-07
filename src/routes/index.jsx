import React from 'react'
import { Routes, Route } from "react-router-dom"
import Home from '../Pages/Home'
import Calendar from '../Pages/Calendar'
import Chat from '../Pages/Chat'
import Teams from '../Pages/Teams'
import Signup from '../Pages/Sigup'
import DetailTeam from '../Pages/DetailTeam'
import JoinTeam from '../Pages/JoinTeam'
import ManagementUser from '../Pages/ManagementUser'

const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Calendar" element={<Calendar />} />
      <Route path="/Chat" element={<Chat />} />
      <Route path="/Teams" element={<Teams />} />      
      <Route path="/signup" element={<Signup />} />
      <Route path="/Teams/:id" element={<DetailTeam />} />    
      <Route path="/JoinTeam" element={<JoinTeam/>} />          
      <Route path="/ManagementUser" element={<ManagementUser/>} />          
    </Routes>
  )
}

export default RoutesMain
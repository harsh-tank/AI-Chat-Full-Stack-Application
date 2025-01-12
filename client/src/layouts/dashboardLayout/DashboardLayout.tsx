import { useAuth } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { Link, Outlet, useNavigate} from "react-router";
import ChatList from '../../components/chatList/ChatList';

const DashboardLayout = () => {

  const {userId, isLoaded} = useAuth()
  const navigate = useNavigate();

  useEffect(()=>{
    if(isLoaded && !userId){
      navigate('/sign-in');
    }
  },[isLoaded, userId, navigate])
  if(!isLoaded)return "Loading ..."
  return (
    <div className='flex gap-[20px] pt-5 h-full '>
        <div className='flex-[1]'>
            <ChatList/>
        </div>
        <div className='flex-[4] bg-[#25252e]'>
            <Outlet/>
        </div>
    </div>
  )
}

export default DashboardLayout
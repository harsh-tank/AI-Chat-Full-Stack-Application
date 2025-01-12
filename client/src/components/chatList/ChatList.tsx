import { NavLink, Link } from 'react-router'
import { useQuery } from "@tanstack/react-query";

const ChatList = () => {

    const { isPending, error, data } = useQuery({
        queryKey: ["userChats"],
        queryFn: () =>
          fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
            credentials: "include",
          }).then((res) => res.json()),
      });

  return (
    <div className='flex flex-col h-full'>
        <span className='font-bold text-[10px] mb-[10px]'>
            DASHBOARD
        </span>
        <Link to="/dashboard" className='p-[10px] rounded-[10px] hover:bg-[#2c2937]'>Create a new Chat</Link>
        <Link to="/dashboard" className='p-[10px] rounded-[10px] hover:bg-[#2c2937]'>Explore Cool AI</Link>
        <Link to="/dashboard" className='p-[10px] rounded-[10px] hover:bg-[#2c2937]'>Contact</Link>
        <hr className='border-0 h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-5'/>
        <span className='font-bold text-[10px] mb-[10px]'>
            RECENT CHATS
        </span>
        <div className='flex flex-col overflow-scroll w-full'>
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat:any) => (
              <div className='p-[6px] overflow-clip rounded-[10px] hover:bg-[#2c2937]'>
                  <NavLink className={({isActive})=>{
                    return isActive ? 'text-amber-700' : ''
                  }} to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </NavLink>
              </div>
            ))}
        </div>
        <hr className='border-0 h-[2px] bg-[#ddd] opacity-10 rounded-[5px] my-5'/>
        <div className='mt-auto flex items-center gap-[10px] text-sm'>
            <img src="/logo.png" className='w-6 h-6'></img>
            <div className='flex flex-col'>
                <span className='font-semibold'>Upgrade to Cool AI pro</span>
                <span className='text-[#888]'>Get unlimited access to all features</span>
            </div>
        </div>
    </div>
  )
}

export default ChatList
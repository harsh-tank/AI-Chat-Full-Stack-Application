import React, { useState } from 'react'
import { Link } from 'react-router'
import { TypeAnimation } from 'react-type-animation'

const HomePage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");
  return (
    <div className='flex-col gap-0 lg:flex lg:flex-row lg:items-center lg:gap-[100px] lg:h-full'>
      <img src="/orbital.png" className='absolute bottom-0 left-0 opacity-[0.25] animate-rotateOrbital z-[-1]' alt="bg"></img>
      <div className='flex flex-1 flex-col items-center justify-center gap-4 text-center'>
        <h1 className='text-6xl xl:text-9xl bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent'>Cool AI</h1>
        <h2 className='font-bold'>An AI Integrated chat application to inhance your productivity</h2>
        <h3 className='max-w-[100%] font-normal lg:max-w-[70%] text-amber-600'>Ask Anything: Whether it’s tech, design, business, or everyday curiosities</h3>
        <h3 className='max-w-[100%] font-normal lg:max-w-[70%] text-amber-600'>Stay in Context: Each question opens a new chat tailored to your topic, ensuring context-aware responses.</h3>
        <h2 className='max-w-[100%] font-normal lg:max-w-[70%]'>🎯 Ready? Let's Chat Now!</h2>
        <Link to="/dashboard" className='py-4 px-6 bg-blue-500 text-white rounded-[20px] text-[14px] hover:bg-white hover:text-blue-500 mt-2'>Get Started</Link>
      </div>

      <div className='flex-1 flex items-center justify-center h-full'>
        <div className='flex items-center justify-center bg-[#23175a] rounded-[50px] w-[80%] h-[50%] relative'>
          <div className='w-full h-full overflow-hidden absolute top-0 left-0 rounded-[50px]'>
            <div className='bg-[url("/bg.png")] opacity-20 w-[200%] h-[100%] bg-[auto_100%] animate-slideBg'></div>
          </div>
          <img src="/bot.png" alt=""  className='w-full h-full object-contain animate-botAnimate'/>
          <div className='hidden absolute bottom-[-30px] right-[-50px] lg:flex items-center gap-2 p-5 bg-[#2c2937] rounded-[10px] xl:right-0'>
            <img src={typingStatus==='human1'? "/human1.jpeg": typingStatus==="human2"?"/human2.jpeg":"/bot.png"}  alt=""  className='w-8 h-8 rounded-[50%] object-cover'/>
            <TypeAnimation
              sequence={[
                "Human1: How to centre a div ??",
                2000, ()=>{
                  setTypingStatus("bot")
                },
                "Bot: className= 'flex items-center justify-center' !!",
                2000, ()=>{
                  setTypingStatus("human2")
                },
                "Human2: What's the weather like ??",
                2000, ()=>{
                  setTypingStatus("bot")
                },
                "Bot: It's Freaking Cold out here in Montreal !!",
                2000, ()=>{
                  setTypingStatus("human1")
                },
              ]}
              wrapper='span'
              speed={40}
              cursor={true}
              omitDeletionAnimation={true}
              style={{fontSize: "1.5em", display: "inline-block"}}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className='absolute bottom-5 left-[50%] translate-x-[-50%] flex flex-col items-center gap-5'>
        <img src="/logo.png" alt="" className='w-5 h-5'/>
        <div className='flex gap-2 text-[#868080] text-sm'>
          <Link to="/">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
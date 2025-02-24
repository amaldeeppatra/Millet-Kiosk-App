import React from 'react'
import logo from '../resources/logos/ShaktiSaathi.png'
import bgPattern from '../resources/login/Landing Page Pattern.png'

const LandingPage = () => {
  return (
    <>
    <div className='h-[100dvh]'>
      <div className='bg-[#123B33] h-[66vh] w-screen rounded-b-[px] absolute z-10' style={{ backgroundColor: "#143826", clipPath: "ellipse(100% 90% at 50% 0%)" }}>
      </div>
      <img src={logo} alt="" className='absolute top-[48%] left-[4.5rem] size-64 z-10'/>
      <img src={bgPattern} alt="" className='absolute top-0 z-0 h-screen'/>
      <button className='absolute z-20 top-[91%] left-[22%] text-[1.2rem] bg-[#123B33] border-2 border-[#123B33] font-semibold py-5 px-[4.5rem] rounded-[67px] text-white'><a href="/login">Continue</a></button>
    </div>
    </>
  )
}

export default LandingPage

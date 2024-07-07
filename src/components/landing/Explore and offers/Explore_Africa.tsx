import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import one from "./Images/one.svg"
import two from "./Images/two.svg"
import three from "./Images/three.svg"
import four from "./Images/four.svg"
import five from "./Images/five.svg"
import six from "./Images/six.svg"
import Image from 'next/image'

function Explore_Africa() {
  return (
    <div className='flex justify-center items-center text-[#0F172A]'>
      <MaxWidthWrapper className='px-14'>
        <div className=" gap-2">
        <p className=" text-3xl font-semibold tracking-tight leading-10 mb-1">Explore East Africa</p>
        <p className="leading-7 tracking-tight ">These popular destinations have a lot to offer</p>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-7 ">
            <div className="relative overflow-hidden rounded-lg">
            <Image src={one} alt="one" className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/></div>
            <div className="relative overflow-hidden rounded-lg">
            <Image src={two} alt="one"  className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/></div>
            <div className="relative overflow-hidden rounded-lg">
            <Image src={three} alt="one"  className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/></div>
            <div className="relative overflow-hidden rounded-lg">
            <Image src={four} alt="one"  className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/>
            </div> <div className="relative overflow-hidden rounded-lg">
            <Image src={five} alt="one"  className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/>
            </div>
            <div className="relative overflow-hidden rounded-lg">
            <Image src={six} alt="one"  className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75'/>
            </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default Explore_Africa

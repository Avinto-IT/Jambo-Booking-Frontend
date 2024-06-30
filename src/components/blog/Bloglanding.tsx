import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import blogsdata from "../../../data/blog.json";
import arrow from "./head/arrow-up-right.svg"
import Image from 'next/image';

function Bloglanding() {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
      };
const substring=(content:string)=>{
    const lines = content.split("\r\n|\r|\n");
    return lines.length<1? content : content.substring(0,80)+"...";
   
}

   const sortedData = blogsdata.blogs.sort((a, b) =>
    {
        const dateA = new Date(a.created_date).getTime();
        const dateB = new Date(b.created_date).getTime();
        return dateB - dateA;
      });
      const limitedData = sortedData.slice(0, 3);
     

  return (
    
    <div className='flex flex-col justify-center items-center mt-20'>
        <MaxWidthWrapper className=' '>
          
      <div className="title flex justify-between ">
        <div className="">
        <p className=" font-semibold text-2xl mb-1.5">Travel Destinations for you</p>
        <p className=" text-sm">Read out what destinations people are loving to go</p></div>
        <div className=" flex items-end text-[0.75rem] font-semibold text-blue-600"><u>View More</u></div>
        </div>

        <br/>
      
      <div className="mainbody flex  ">
        
      
        <div className="left w-1/2   mr-3 ">
      
        <img src={limitedData[0].hero_img} alt="hotelphoto" className="rounded-md object-cover" />
        <p className=" text-[0.85rem] font-semibold text-blue-600 mb-2 mt-5">{formatDate(limitedData[0].created_date)}</p>
        <div className="flex justify-between"><p className=" font-semibold mb-2">{limitedData[0].blogTitle}</p>
        <Image src={arrow} alt="user" className="" />
      
        </div>
     
        <p className=" text-gray-800 text-sm">{substring(limitedData[0].content)}</p>

        </div>
      
        <div className="right w-1/2   ml-3">
            <div className="one h-1/2 flex pb-3 ">
            <img src={limitedData[1].hero_img} alt="hotelphoto" className="rounded-md object-cover  w-1/2 mr-5 " />
            <div className="">
        <p className=" text-[0.85rem]  font-semibold text-blue-600 mb-2">{formatDate(limitedData[1].created_date)}</p>
        <p className=" font-semibold  mb-2">{limitedData[1].blogTitle}</p>
        <p className=" text-gray-800 text-sm">{substring(limitedData[1].content)}</p>
        </div>

            </div>
            <div className="two h-1/2 flex pt-3">
            <img src={limitedData[2].hero_img} alt="hotelphoto" className="rounded-md object-cover w-1/2 mr-5" />
            <div className="">
        <p className=" text-[0.85rem]  font-semibold text-blue-600 mb-2">{formatDate(limitedData[2].created_date)}</p>
        <p className=" font-semibold  mb-2">{limitedData[2].blogTitle}</p>

        <p className=" text-gray-800 text-sm">{substring(limitedData[2].content)}</p>
        </div>

            </div>
        </div>
      </div>

      </MaxWidthWrapper>
    </div>
  )
}

export default Bloglanding



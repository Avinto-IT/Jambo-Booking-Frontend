import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import blogsdata from "../../../data/blog.json";
function page() {

    let  data=blogsdata.blogs;
    data=data.slice(0,6);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
      };

  return (
    <div className='flex flex-col justify-center items-center mt-10'>
      <MaxWidthWrapper>
        <div className="breadcrumb"></div>
        <div className="title mt-5 mb-5">
        
        <p className=" font-semibold text-2xl mb-1.5">All Destinations</p>
        <p className=" text-sm">Read out what destinations people are loving to go</p>
        </div>

        <div className="main">
        <div className="grid gap-6 grid-cols-3 grid-rows-2 outline outline-black" >
            {data.map((index)=>
        
            <div className='flex flex-col'>
                <img src={index.hero_img} alt="index" className="h-52 w-full" key={index.POST_ID} />
                <p className=" text-[0.85rem] font-semibold text-blue-700 mb-2 mt-5">{formatDate(index.created_date)}</p>
                </div>
            
            
        
          
            )}
        </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}

export default page

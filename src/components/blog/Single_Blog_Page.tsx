"use client";
import React from 'react';
import MaxWidthWrapper from '../MaxWidthWrapper';
import blogsdata from "../../../data/blog.json";
import Image from 'next/image';
import Blog_Client_Header from './Blog_Client_Header';
import arrow from "./head/arrow-up-right.svg";
import { usePathname } from 'next/navigation';
import TagRemover from './TagRemover';

function Single_Blog_Page() {
    const pathname = usePathname();
    const ind = ((pathname?.split("/").pop() || ""));

    const blogId = decodeURIComponent(ind);
    const data = blogsdata.blogs.find(b => b.ID === blogId);
   
    const datam = blogsdata.blogs.filter(b => b.ID !== ind); 
    const last=datam.sort((a,b)=>{
        const dateA = new Date(a.created_date).getTime();
        const dateB = new Date(b.created_date).getTime();
        return dateB- dateA;
    })   
   
    const datum=last.slice(0,3);
   

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString("en-US", options);
    };

  

    return (
        <div className='flex flex-col items-center mt-10 mb-10'>
     
            <MaxWidthWrapper className='text-[0.9rem]'>
                <div className="breadcrumb mb-7">
                    <Blog_Client_Header index={ind}/>
                </div>
            {data &&
                <div className="all flex justify-between " style={{ whiteSpace: 'pre-line' }}>
                    <div className="main w-4/6 pr-16">
                        <p className=" font-bold  text-2xl">{data.blogTitle}</p>
                        <p className=" text-[0.85rem] font-bold text-[#2563EB] mb-5 mt-4">{formatDate(data.created_date)}</p>

                        <div className="imgone">
                            <img src={data.hero_img} alt="index" className="w-full rounded-md mb-6"/>
                            <p className=" text-[#334155] leading-7">{data.titlecontent}</p>
                        </div>
                        <br/>
                        <div className="texts">
                            <p className=" font-bold  text-xl mb-3">{data.subtitleone}</p>
                            <p className=" text-[#334155] leading-7">{data.contentone}</p>
                        </div>
                        <br/>
                        <div className="texts mb-7">
                            <p className=" font-bold  text-xl mb-3">{data.subtitletwo}</p>
                            <p className=" text-[#334155] leading-7">{data.contenttwo}</p>
                            <img src={data.contentimg} alt="image" className="w-full rounded-md mt-6 " />
                        </div>

                        <div className="texts">
                            <p className=" font-bold  text-xl mb-3 ">{data.subtitlethree}</p>
                            <p className=" text-[#334155] leading-7">{data.contentthree}</p>
                        </div>
                        <br/>
                        <div className="texts">
                            <p className=" font-bold  text-xl mb-3">{data.subtitlefour}</p>
                            <p className=" text-[#334155] leading-7">{data.contentfour}</p>
                        </div>
                        <br/>
                        <div className="texts">
                            <p className=" font-bold  text-xl mb-3">{data.Conclusion}</p>
                            <p className=" text-[#334155] leading-7"><TagRemover content={data.content}/></p>
                        </div>
                    </div>

                    <div className="secondary w-2/6 ">
                        <div className="title">
                            <p className=" font-bold  text-2xl mb-1.5">Destinations you may like</p>
                            <p className="">Read out what destinations people are loving to go</p>
                        </div><br/>
                        {datum.map((index) =>
                            <div className=" mt-2.5  mb-7    " key={index.ID} onClick={()=>{
                                window.location.href = `http://localhost:3000/blogs/${(index.ID)}`;
                    
                            }}>
                                <div className="relative overflow-hidden rounded-md">
                                    <img src={index.hero_img} alt="heroimage" className=' transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75' />
                                </div>
                                <div className="flex justify-start text-[0.85rem] font-bold text-[#2563EB] mb-2 mt-5">
                                    <p className="">{formatDate(index.created_date)}</p>
                                </div>
                                <div className="">
                                    <div className="flex justify-between">
                                        <p className="font-bold  text-xl mb-2 ">{index.blogTitle}</p>
                                        <div className="w-6">
                                            <Image src={arrow} alt="user" className="h-5 w-5 ml-6" />
                                        </div>
                                    </div>
                                    <p className=" text-[#334155] leading-6"><TagRemover content={index.content.length < 70 ? index.content : (index.content.substring(0, 70) + "...")}/></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
}
            </MaxWidthWrapper>
        </div>
    );
}

export default Single_Blog_Page;

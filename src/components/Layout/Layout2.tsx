"use client";
import React, { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../Navbar";
import insta from "../../app/Registration_Successful/Instagram.svg"
import twitter from "../../app/Registration_Successful/Twitter.svg"
import facebook from "../../app/Registration_Successful/Facebook.svg"
import Jambologo from "../../app/Registration_Successful/Vector (2).svg"
import { ChevronDown, CircleUserRound } from "lucide-react";
import topimg from "../blog/head/Header Image.svg";
import Topimg from "../Topimg";


interface Layout2Props {
  children: ReactNode;
  title?: string;
  imgtitle:string;
}

const Layout2: React.FC<Layout2Props> = ({ children, title = "My App",imgtitle }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
       <header className="p-y-4">
        <nav className="px-16 py-6 flex justify-between items-center h-[88px]">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Jambo Hotel Logo"
              width={256}
              height={40}
            />
          </Link>
          <Navbar />
         
          <div className="flex space-x-4">
            <Link
              href="/signup-agent"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
            >
              Signup as Agent
            </Link>
            <Link
              href="/signup-hotel"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
            >
              Signup as Hotel
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Login
            </Link>
          </div>
        </nav>
        <Topimg title={imgtitle}/>
  
      </header>
  
      <main className="flex-grow max-w-[1920px]">
        {children}</main>
      <footer className='bg-[#1E3A8A] text-white pb-16'>
        <div className="h-full flex flex-col justify-center items-center">
        <div className=" h-11/12 flex justify-between  items-center w-full px-16 mt-6">


        <Link href="/" className='w-1/3'>
          <Image
            src={Jambologo}
            alt="Jambo Hotel Logo"
            width={256}
            height={40}
        
          />
        </Link>
        <div className="flex justify-between w-2/3 pr-20 mt-16 font-extralight ">
        <div className="flex flex-col gap-y-4 items-center "><p className="mb-1 font-semibold">QUICK LINKS</p>
        <Link href="/" className="">Home</Link>
        <Link href="/about_us" className="">About</Link>
        <Link href="" className="">Hotels</Link>
        <Link href="/blogs/blog-list" className="">Popular</Link>
        </div>
        <div className="flex flex-col gap-y-4 items-center"><p className="mb-1 font-semibold">CONTACT</p>
        <Link href="/contact" className="">Contact</Link>
        <Link href="/blogs/blog-list" className="">Blogs</Link>
        </div>
        <div className="flex flex-col gap-y-4 items-center"><p className="mb-1 font-semibold">LEGAL INFO</p>
        <Link href="/Privacy_Policy" className="">Privacy Policy</Link>
        <Link href="/" className="">Terms and Conditions</Link>
        <Link href="/" className="">Cookie Policy</Link>
        </div>

        <div className="w-1/6 leading-7"><p className=" tracking-tighter">Lorem ipsum dolor sitamet, consectetur adipiscing elit.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className="flex mt-5   gap-x-2">
        <Image src={insta} alt='insta'/>
        <Image src={facebook} alt='facebook'/>
        <Image src={twitter} alt='twitter'/></div>
        </div>

        </div>
      
     
        </div>
        <br/>
        <div className="h-1/12 w-11/12 border-t border-white mt-4  flex justify-center">
       <p className=" text-xs mt-7 font-light">©  All Rights Reserved</p>
        </div>
        </div>
    </footer>
    </div>
  );
};

export default Layout2;

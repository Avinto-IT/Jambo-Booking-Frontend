"use client";
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";


interface ForgotPasswordProps {
    onButtonClick: () => void;
  }

  const Forgot_Password: React.FC<ForgotPasswordProps> = ({ onButtonClick }) => {
    const[email,setEmail]=useState("");
    const[message,setMessage]=useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
    const handleResetClick = async () => {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          try {
            const data = await response.json();
            if (response.status === 200 || emailRegex.test(email) || email==="admin") {
                
                const userDetails = data.user;
                if(userDetails===email || email==="admin"){
                setMessage(data.message);
        onButtonClick();
    }
    else{
        setMessage("Not found")
    }
          
       } else {
        if(email===""){
setMessage("Missing email")
        }
        else{
            // else if( !emailRegex.test(email)){
        setMessage("Invalid Email");
      }}
    } catch {
      setMessage("Internal Server Error");
    }
}

setTimeout(() => {
    setMessage("");
  }, 5000);

;
  return (
    // <div className="w-full grid grid-cols-2">
      <>
    <div className="flex items-center justify-center  ">
      <div className="mx-auto grid ">

    <div className="w-full flex place-content-center place-items-center">
      <div className="w-full max-w-sm  ">
        <CardHeader>
          <CardTitle className="text-3xl leading-10">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
        </CardContent>
        <CardFooter className='-mt-3'>
          <Button className="w-full bg-blue-600 hover:bg-blue-800" onClick={handleResetClick} >
            Reset Password
          </Button>

        </CardFooter>
     
    
     {message && <div className=" flex justify-center"> <p className=' fixed w-fit px-2 shadow-xl  rounded-xl text-red-700 '>{message}</p> </div>}
    
      </div>
     
      {/* {message && <p>{message}</p>} */}
    </div>
    </div>
   
    </div>
   
</>
  
  )
}

export default Forgot_Password

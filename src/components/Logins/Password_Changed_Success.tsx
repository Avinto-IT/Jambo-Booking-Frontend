import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import eclipse from "./Ellipse 1.svg"
import Image from 'next/image';
import Lottie from 'lottie-react';
import animationdata from "../../../animation/Success.json";


interface PasswordChangedSuccessprop {
    onButtonClick: () => void;
  }
const Password_Changed_Success= ({  }) => {

  return (
    <div className="flex items-center justify-center  ">
      <div className="mx-auto grid ">
      
    <div className="w-full flex place-content-center place-items-center ">
       
      <div className="w-full max-w-sm  ">
        <div className="w-full  flex justify-center h-28">
      {/* <Image src={eclipse} alt="eclipse" className=''/> */}
      <Lottie animationData={animationdata} loop={true} />
      </div>
   {/* <div className="outline outline-black"> */}
        <CardHeader className='gap-2  text-center'>
          <CardTitle className="text-3xl leading-9  ">Password Changed Successfully</CardTitle>
          <CardDescription>
          Create a new password. Ensure it differs from previous ones for security.
          </CardDescription>
        </CardHeader>
        {/* </div> */}
        <CardFooter className=''>
          <Button className="w-full bg-blue-600 hover:bg-blue-800" onClick={()=>( window.location.href = "http://localhost:3000/login")}>
            Back to Login
          </Button>

        </CardFooter>
     

      </div>

      {/* {message && <p>{message}</p>} */}
    </div>
    </div>
    </div>
  )
}

export default Password_Changed_Success

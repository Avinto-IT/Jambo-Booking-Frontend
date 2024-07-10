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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

  interface CheckEmailProps {
    onButtonClick: () => void;
  }
const Check_Email: React.FC<CheckEmailProps> = ({ onButtonClick }) => {
  return (
   // <div className="w-full grid grid-cols-2">
      
   <div className="flex items-center justify-center  ">
   <div className="mx-auto grid   ">

 <div className="w-full flex place-content-center place-items-center">
   <div className="w-full max-w-sm  ">
     <CardHeader>
       <CardTitle className="text-3xl leading-10">Check your email</CardTitle>
       <CardDescription className='w-11/12'>
       We sent a reset link to alpha...@gmail.com 
       Enter 6 digit code that mentioned in the email
       </CardDescription>
     </CardHeader>
     <CardContent className="grid gap-2">
       <div className="grid gap-2">
         <Label htmlFor="email" className="font-semibold">Verification Code</Label>
         <InputOTP maxLength={6} className="">
         <div className=" flex justify-between w-full">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    
    </InputOTPGroup> 
  <InputOTPGroup>
    <InputOTPSlot index={1} />
    
    </InputOTPGroup> 
  <InputOTPGroup>
    <InputOTPSlot index={2} />
    
    </InputOTPGroup> 
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    
    </InputOTPGroup> 
  <InputOTPGroup>
    <InputOTPSlot index={4} />
    
    </InputOTPGroup> 
  <InputOTPGroup>
    <InputOTPSlot index={5} />
    
    </InputOTPGroup> 

    </div>

</InputOTP>
       </div>
       
     
     
       <Button className="w-full bg-blue-600 hover:bg-blue-800" onClick={onButtonClick}>
        Verify Email
       </Button>
       </CardContent>
       <CardFooter >
       <div className="text-xs text-[#64748B] w-full flex justify-center">Haven't got the email yet? <Link href="/" className="text-blue-600">Resend email</Link> </div>
     </CardFooter>
  

   </div>

   {/* {message && <p>{message}</p>} */}
 </div>
 </div>
 </div>
  )
}

export default Check_Email

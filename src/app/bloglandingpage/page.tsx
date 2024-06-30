import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import blogsdata from "../../../data/blog.json";
// import arrow from "./arrow-up-right.svg"
import Image from 'next/image';
import { Badge } from "@/components/ui/badge"
import Bloglanding from '@/components/blog/Bloglanding';

function page() {

     

  return (
    
    
          <>     <Bloglanding/>
{/* <Badge variant="default">Badge</Badge>
<Badge variant="destructive">Badge</Badge>
<Badge variant="secondary">Badge</Badge>
<Badge variant="outline">Badge</Badge>
<Badge variant="Requested">Badge</Badge>
<Badge variant="Pending">Badge</Badge>
<Badge variant="Rejected">Badge</Badge>
<Badge variant="Approved">Badge</Badge>  */}
     </>

  )
}

export default page



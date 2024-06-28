"use client";

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import BlogHeader from '@/components/blog/BlogHeader'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import React from 'react'


export default  function page() {
  return (
    <div className='bg-slate-50 flex justify-center items-center'>
<MaxWidthWrapper>
<div className="py-6 px-4 gap-4  flex flex-col bg-slate-50  ">
<BlogHeader/>
    
    <div className="flex justify-center items-center">
   
      


        

      <div className="rounded-md  gap-4 pr-6 pb-6 pl-[24px]">

        
<div className="rounded-lg  bg-white">


<div className="flex flex-col">
<div className="flex flex-col    p-6 ">
        <p className=" font-bold text-xl">Add Blog</p>
        <p className=" text-gray-600 mt-2 text-sm">Create a new blog post to share the latest travel tips, destinations, and stories.</p>
    
    </div>

    <div className="flex flex-col    p-6 -mt-7">
        <p className=" font-semibold ">Blog Title</p>
     <Input type="search" className='text-gray-600 mt-2 text-sm ' placeholder="Enter Blog Title"/>
    </div>

    <div className="flex flex-col    p-6 -mt-7">
        <p className=" font-semibold ">Blog Caption</p>
     <Input type="search" className='text-gray-600 mt-2 text-sm ' placeholder="Enter caption"/>
    </div>
        </div>
        

        <div className="flex flex-col    p-6 -mt-7">
<p className=" font-semibold ">Description</p>
<div className=" mt-2 text-sm">
        <TinyMCEEditor
          apiKey='ps3d3lrp2sjexf4jwtq8g7xcvrbcowhds840vpuyhciky6fi'
       
          init={{
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            ai_request: (_request:any, respondWith:any) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
          }}
             initialValue=""
        />
        </div>
        </div>
        <div className="flex justify-end items-end h-10 mr-5 ">
          <Button className='bg-blue-600 text-white  hover:bg-blue-800 hover:text-white ml-3' >Save Changes</Button>
          
       </div>
        </div>
        </div>
     
      </div>
      </div>
      </MaxWidthWrapper>
      
    </div>
  )
}


"use client";

import React, { Suspense, useRef, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import blogsData from "../../../data/blog.json";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Editor as TinyMCEEditorInstance } from "tinymce";
import BlogHeader from "@/components/blog/BlogHeader";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";

const BlogEditor = () => {
  const editorRef = useRef<TinyMCEEditorInstance | null>(null);

  const searchParams = useSearchParams();
  let indexParam = searchParams ? searchParams.get("user") : null;

  let index = parseInt(indexParam || "0", 10);
  if (isNaN(index) || index < 0 || index >= blogsData.blogs.length) {
    index = 0;
  }

  const first = blogsData.blogs[index];

  const [text, setText] = useState(first.content);

  const handleOnsave = async () => {
    if (editorRef.current) {
      let updatedContent = editorRef.current.getContent();
      updatedContent = updatedContent.replace(/<\/?p>/g, "");
      updatedContent = updatedContent.replace(/(&nbsp;|\s)+/g, " ");

      setText(updatedContent);
      console.log(updatedContent);
      try {
        const response = await fetch("/api/updateBlog", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            index,
            content: updatedContent,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          // router.push('/');

          toast("Success", {
            description: "Content edited successfully",
            action: {
              label: "close",
              onClick: () => console.log("closed"),
            },
          });
        } else {
          console.error("Failed to update blog content");
        }
      } catch (error) {
        console.error("Failed to update blog content", error);
      }
    }
  };

  const handleOnclear = () => {
    if (editorRef.current) {
      editorRef.current.setContent(""); // Clear the editor's content
    }
    setText("");
  };

  return (
    <div className="bg-slate-50 flex justify-center items-center">
      <MaxWidthWrapper>
        <div className="py-6 px-4 gap-4  flex flex-col   ">
          <BlogHeader />

          <div className="flex justify-center items-center">
            {/* <div className="rounded-md w-[91rem] gap-4 h-[44rem] pr-6 pb-6 pl-[24px]"> */}
            <div className="rounded-md          gap-4 h- full pr-6 pb-6 pl-[24px]">
              {/* <div className="rounded-lg w-[88rem]  bg-white"> */}
              <div className="rounded-lg  bg-white">
                <div className="flex flex-col">
                  <div className="flex flex-col    p-6 ">
                    <p className=" font-bold text-xl">Edit Blog</p>
                    <p className=" text-gray-600 mt-2 text-sm">
                      Edit the blog post.
                    </p>
                  </div>

                  <div className="flex flex-col    p-6 -mt-7">
                    <p className=" font-semibold ">Blog Title</p>
                    {/* <Input type="search" className='text-gray-600 mt-2 text-sm w-[85rem] ' placeholder={first.blogTitle}/> */}
                    <Input
                      type="search"
                      className="text-gray-600 mt-2 text-sm "
                      placeholder={first.blogTitle}
                    />
                  </div>

                  <div className="flex flex-col    p-6 -mt-7">
                    <p className=" font-semibold ">Blog Caption</p>
                    {/* <Input type="search" className='text-gray-600 mt-2 text-sm w-[85rem] ' placeholder={first.caption}/> */}
                    <Input
                      type="search"
                      className="text-gray-600 mt-2 text-sm  "
                      placeholder={first.caption}
                    />
                  </div>

                  {/* <div className="ml-3 h-10 w-[40rem] flex justify-start items-center rounded-lg">
          <div className="text-lg mb-2.5">{first.blogTitle}</div>
        </div> */}
                </div>
                <div className="flex flex-col    p-6 -mt-7">
                  <p className=" font-semibold ">Description</p>
                  {/* <div className=" mt-2 text-sm w-[85rem] "> */}
                  <div className=" mt-2 text-sm          ">
                    <TinyMCEEditor
                      apiKey="ps3d3lrp2sjexf4jwtq8g7xcvrbcowhds840vpuyhciky6fi"
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      initialValue={text}
                      init={{
                        plugins:
                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                        tinycomments_mode: "embedded",
                        tinycomments_author: "Author name",
                        mergetags_list: [
                          { value: "First.Name", title: "First Name" },
                          { value: "Email", title: "Email" },
                        ],
                        ai_request: (_request: any, respondWith: any) =>
                          respondWith.string(() =>
                            Promise.reject("See docs to implement AI Assistant")
                          ),
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end items-end h-10 mr-5 ">
                  <Button
                    className="bg-blue-600 text-white  hover:bg-blue-800 hover:text-white ml-3"
                    onClick={handleOnsave}
                  >
                    Save Changes
                  </Button>
                  <Button
                    className="ml-12 bg-blue-600 text-white  hover:bg-blue-800 hover:text-white"
                    onClick={handleOnclear}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogEditor />
    </Suspense>
  );
}

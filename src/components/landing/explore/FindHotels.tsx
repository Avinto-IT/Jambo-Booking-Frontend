import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import blogsData from "../../../../data/blog.json";

function FindHotels() {
  const data = blogsData.blogs.slice(0, 6);
  return (
    <div className="py-10">
      <div className="h-20 gap-2 mb-4">
        <p className=" text-3xl font-semibold tracking-tight leading-10">
          Find Your Hotels
        </p>
        <p className=" leading-7 mt-1 tracking-tight ">
          Find your desired hotel near your desired trip location
        </p>
      </div>
      <div className="grid grid-cols-3 grid-rows-2   gap-x-5 gap-y-4  ">
        {data.map((index, id) => (
          <div
            className="flex flex-col mb-2 border pb-5 border-gray-200 rounded-lg "
            onClick={() => {
              console.log({ id });

              window.location.href = `http://localhost:3000/blogs/${index.ID}`;
            }}
          >
            <div className="relative overflow-hidden rounded-md">
              <img
                src={index.hero_img}
                alt="index"
                className="h-72 w-full rounded-md transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75 hover:rounded-lg"
                key={index.POST_ID}
              />
            </div>

            <div className="flex justify-between">
              <p className=" font-bold my-2  px-4">{index.blogTitle}</p>
            </div>
            <div className="px-4 text-[#64748B] text-sm">
              <div className="mb-2">Kenyatta Avenue, Nairobi, Kenya</div>
              <div className="flex">
                <div className="flex">
                  Starting from
                  <div className="text-black flex">
                    <div className=" font-semibold text-md"> $75</div> /night{" "}
                  </div>
                </div>
              </div>
            </div>
            {/* <p className=" text-gray-800 text-sm">{index.content.length > 80 ?index.content.substring(0, 80) + "..." : index.content}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindHotels;

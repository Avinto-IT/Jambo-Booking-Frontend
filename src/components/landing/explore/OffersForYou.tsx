import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";
import photo1 from "../../../../public/images/explore-east-africa/Photo1.svg";
import photo2 from "../../../../public/images/explore-east-africa/Photo2.svg";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import arrowright from "../../../../public/images/explore-east-africa/ArrowRight.svg";

function OffersForYou() {
  return (
    <div>
      <div className="gap-2 mb-9">
        <p className=" font-semibold tracking-tight leading-10 text-3xl">
          Offers For You
        </p>
        <p className="leading-7">
          Promotions, deals, and special offers for you
        </p>
      </div>

      <div className="  ">
        <Carousel className="">
          <CarouselContent>
            {/* <div className=" flex justify-between relative mt-7 "> */}

            {/* <div className="w-1/2 "> */}
            <CarouselItem className="basis-1/2  h-60">
              <>
                <div className="relative ">
                  <Image
                    src={photo1}
                    alt="photo1"
                    className=" object-cover rounded-lg "
                  />
                  <div className="absolute inset-0  bg-gradient-to-t from-black opacity-90 rounded-lg "></div>
                </div>
                <div className="relative bottom-40    p-6 ">
                  <Badge variant="secondary" className="h-8 mb-1">
                    15% OFF
                  </Badge>
                  <p className="leading-6 w-80  text-white">
                    Save 15% or more when you book and stay before October 1,
                    2024
                  </p>
                  <div className="flex ">
                    <Link href="/" className="text-white  py-1.5 mr-2">
                      View More
                    </Link>
                    <Image src={arrowright} alt="arrowright" />
                  </div>
                </div>
              </>
            </CarouselItem>
            {/* </div> */}

            {/* <div className=" w-1/2"> */}
            <CarouselItem className="basis-1/2  h-60">
              <>
                <div className="relative ">
                  <Image
                    src={photo2}
                    alt="photo1"
                    className=" object-cover rounded-lg"
                  />
                  <div className="absolute inset-0  bg-gradient-to-t from-black opacity-90 rounded-lg"></div>
                </div>
                <div className="relative bottom-40   p-6  ">
                  <Badge variant="secondary" className="h-8 mb-1">
                    15% OFF
                  </Badge>

                  <p className="leading-6 w-80 text-white">
                    Save 15% or more when you book and stay before October 1,
                    2024
                  </p>
                  <div className="flex">
                    <Link href="/" className="text-white  py-1.5 mr-2">
                      View More
                    </Link>
                    <Image src={arrowright} alt="arrowright" />
                  </div>
                </div>
              </>
            </CarouselItem>
            <CarouselItem className="basis-1/2  h-60">
              <>
                {" "}
                <div className="relative ">
                  <Image
                    src={photo2}
                    alt="photo1"
                    className=" object-cover rounded-lg"
                  />
                  <div className="absolute inset-0  bg-gradient-to-t from-black opacity-90 rounded-lg"></div>
                </div>
                <div className="relative bottom-40   p-6  ">
                  <Badge variant="secondary" className="h-8 mb-1">
                    15% OFF
                  </Badge>
                  <p className="leading-6 w-80 text-white">
                    Save 15% or more when you book and stay before October 1,
                    2024
                  </p>
                  <div className="flex">
                    <Link href="/" className="text-white  py-1.5 mr-2">
                      View More
                    </Link>
                    <Image src={arrowright} alt="arrowright" />
                  </div>
                </div>
              </>
            </CarouselItem>
            <CarouselItem className="basis-1/2  h-60">
              <>
                {" "}
                <div className="relative ">
                  <Image
                    src={photo2}
                    alt="photo1"
                    className=" object-cover rounded-lg"
                  />
                  <div className="absolute inset-0  bg-gradient-to-t from-black opacity-90 rounded-lg"></div>
                </div>
                <div className="relative bottom-40   p-6  ">
                  <Badge variant="secondary" className="h-8 mb-1">
                    15% OFF
                  </Badge>
                  <p className="leading-6 w-80 text-white">
                    Save 15% or more when you book and stay before October 1,
                    2024
                  </p>
                  <div className="flex">
                    <Link href="/" className="text-white  py-1.5 mr-2">
                      View More
                    </Link>
                    <Image src={arrowright} alt="arrowright" />
                  </div>
                </div>
              </>
            </CarouselItem>

            {/* </div> */}

            {/* </div> */}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </div>
  );
}

export default OffersForYou;

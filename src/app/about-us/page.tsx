"use client";
import Layout2 from "@/components/Layout/Layout2";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Image from "next/image";
import React from "react";
import discoverimg from "../../../public/images/static-from-landing/image.svg";
import bedimg from "../../../public/images/an image for hotel booking.svg";
import Worldmap from "@/components/landing/Worldmap";
import BreadcrumbHome from "@/components/Home-Breadcrumb/BreadcrumbHome";

interface topimgprop {
  title: string;
}
const about_us: React.FC<topimgprop> = ({ title }) => {
  return (
    <div>
      <Layout2 imgtitle="About Us">
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper>
            <BreadcrumbHome />
            <div className="text-[#0F172A] space-y-1">
              <p className="text-3xl  font-semibold">About Us</p>
              <p className="">Lorem ipsum league sparatum</p>
            </div>
            <div className=" flex justify-center items-start">
              <div className="h-full  my-14">
                <div className="  w-full flex justify-between rounded-2xl bg-[#F0FDFA] ">
                  <div className=" w-5/12 ">
                    <Image
                      src={discoverimg}
                      alt="discoverimg"
                      className="h-full "
                    />
                  </div>
                  <div className="w-6/12  flex justify-center items-center pr-20 pl-5  py-16">
                    <div className="   gap-5  flex flex-col">
                      <p className=" font-semibold text-2xl">
                        Discover our History
                      </p>
                      <p className="text-[#334155] leading-7 text-base">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's{" "}
                      </p>

                      <p className="text-[#334155] leading-7 text-base">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy Lorem Ipsum is simply dummy
                        text of the printing and typesetting industry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" flex  tracking-tight">
              <div className="h-full my-14">
                <div className="  w-full flex justify-between rounded-2xl  ">
                  <div className="w-6/12  flex  pr-5 ">
                    <div className="   gap-7  flex flex-col">
                      <div className="space-y-1">
                        <p className=" font-semibold text-2xl">
                          Lorem Ipsum is simply dummy text
                        </p>
                        <p className="text-[#64748B] leading-7 text-base">
                          Cras at pellentesque eros. Nullam vitae sapien et
                          felis eleifend luctus. Nam ac dui cursus, efficitur
                          ante sed, tempor sapien. Praesent nec mattis enim.
                          Mauris a laoreet purus.{" "}
                        </p>
                      </div>
                      <div className="bg-[#FEFCE8] pl-10 pr-28 py-7 rounded-xl space-y-1">
                        <p className="font-semibold text-xl">
                          Lorem Ipsum is simply dummy text
                        </p>
                        <p className="text-[#64748B] leading-7 text-base pb-5">
                          Etiam sed vulputate nisl, eu elementum arcu. Vivamus
                          dignissim tortor in tellus dictum pellentesque.{" "}
                        </p>

                        <p className=" border-t-2 pt-5 font-semibold text-xl">
                          Lorem Ipsum is simply dummy text
                        </p>
                        <p className="text-[#64748B] leading-7 text-base">
                          Etiam sed vulputate nisl, eu elementum arcu. Vivamus
                          dignissim tortor in tellus dictum pellentesque.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" w-5/12 ">
                    <Image
                      src={discoverimg}
                      alt="discoverimg"
                      className="h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="">
              <div className="space-y-4">
                <p className=" font-semibold text-2xl">
                  Lorem Ipsum is simply dummy text
                </p>
                <p className="text-[#64748B] text-sm">
                  In India, our organization is dedicated to creating a future
                  where senior citizens are free from hunger, ensuring that
                  every elderly person has access to nutritious food for a
                  vibrant and fulfilling life. Our approach revolves around
                  implementing sustainable initiatives, cultivating strong
                  partnerships within senior communities, and empowering elderly
                  individuals and families to overcome the challenges of aging.
                  <br />
                  <br />
                  Through collaborative efforts with local stakeholders, we
                  strive to address the unique needs of senior citizens and
                  establish long-term solutions that promote their well-being
                  and dignity. Our presence in India is characterized by a
                  holistic approach to supporting seniors, one that acknowledges
                  the importance of food security, social inclusion, and
                  healthcare access. By leveraging innovative programs and
                  support services, we work to ensure that every senior has
                  access to the resources they need to age with dignity and
                  independence. Through our commitment to collaboration,
                  compassion, and empowerment, we are dedicated to building a
                  future where every senior citizen in India can live with
                  dignity and enjoy their golden years to the fullest.
                </p>
              </div>
              <Image src={bedimg} alt="bedimg" className="mt-12 rounded-md" />
            </div>
          </MaxWidthWrapper>
        </div>
        <Worldmap />
      </Layout2>
    </div>
  );
};
export default about_us;

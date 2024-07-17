"use client";
import BreadcrumbHome from "@/components/Home-Breadcrumb/BreadcrumbHome";
import LayoutTwo from "@/components/Layout/LayoutTwo";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface TopImgProp {
  title: string;
}
const Policy: React.FC<TopImgProp> = ({ title }) => {
  return (
    <div>
      <LayoutTwo imgTitle="Privacy Policy">
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper>
            <BreadcrumbHome />
            <div className="text-[#0F172A] space-y-1">
              <p className="text-3xl  font-semibold">Privacy Policy</p>
              <p className="">Lorem ipsum league sparatum</p>
            </div>
            <div className="py-32">
              <div className="space-y-5 text-[#64748B] text-sm leading-7">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-black text-2xl font-semibold leading-9">
                      {i + 1}. Lorem ipsum dolor sit
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MaxWidthWrapper>
        </div>
      </LayoutTwo>
    </div>
  );
};
export default Policy;

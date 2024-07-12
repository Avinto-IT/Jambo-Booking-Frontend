"use client";
import Breadcrumb_Home from "@/components/Home-Breadcrumb/BreadcrumbHome";
import Layout2 from "@/components/Layout/Layout2";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface topimgprop {
  title: string;
}
const policy: React.FC<topimgprop> = ({ title }) => {
  return (
    <div>
      <Layout2 imgtitle="Privacy Policy">
        <div className=" flex justify-center items-center">
          <MaxWidthWrapper>
            <Breadcrumb_Home />
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
      </Layout2>
    </div>
  );
};
export default policy;

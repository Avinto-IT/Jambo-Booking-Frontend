"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Bed,
  NotebookText,
  Settings,
  Briefcase,
  PenTool,
  User,
  Users2,
  DollarSign,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname(); // Use usePathname to get the current path
  const [pathArray, setPathArray] = useState<string[]>([]);

  useEffect(() => {
    if (pathname) {
      setPathArray(pathname.split("/").filter((x) => x));
    } else {
      setPathArray([]); // Ensure it sets an empty array if pathname is undefined
    }
  }, [pathname]);
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <div className="flex items-center mb-6">
            <Image
              src="/images/minimalLogo.svg"
              alt="Jambo Hotels Logo"
              width={40}
              height={40}
            />
          </div>
          <Link
            href="/dashboard"
            className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded text-lg font-semibold md:h-8 md:w-8 md:text-base ${
              pathname === "/dashboard" ? "bg-[#F1F5F9]" : "text-primary"
            }`}
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/hotels"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "/dashboard/hotels"
                      ? "bg-[#F1F5F9]"
                      : "text-primary"
                  }`}
                >
                  <Bed className="h-5 w-5" />
                  <span className="sr-only">Hotels</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Hotels</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/bookings"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "/dashboard/bookings"
                      ? "bg-[#F1F5F9]"
                      : "text-primary"
                  }`}
                >
                  <NotebookText className="h-5 w-5" />
                  <span className="sr-only">Bookings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Bookings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/agents"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "/dashboard/agents"
                      ? "bg-[#F1F5F9]"
                      : "text-primary"
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span className="sr-only">Agents</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Agents</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "#" ? "bg-[#F1F5F9]" : "text-primary"
                  }`}
                >
                  <PenTool className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "#" ? "bg-[#F1F5F9]" : "text-primary"
                  }`}
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/pricing"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "/dashboard/pricing"
                      ? "bg-[#F1F5F9]"
                      : "text-primary"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="sr-only">Calendar Pricing</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Calendar Pricing</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    pathname === "#" ? "bg-[#F1F5F9]" : "text-primary"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <main className="py-4 flex bg-gray-100 flex-col flex-1 ml-14">
        <div className="px-6 w-full flex justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              {pathArray.map((path, index) => {
                const href = "/" + pathArray.slice(0, index + 1).join("/");
                return (
                  <React.Fragment key={path}>
                    <BreadcrumbItem>
                      {index === pathArray.length - 1 ? (
                        <BreadcrumbPage className="capitalize">
                          {path}
                        </BreadcrumbPage>
                      ) : (
                        <>
                          <BreadcrumbLink href={href} className="capitalize">
                            {path}
                          </BreadcrumbLink>
                          {/* <BreadcrumbSeparator /> */}
                        </>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          <div className=" flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

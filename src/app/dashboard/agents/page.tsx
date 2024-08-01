"use client";
import React, { useEffect, useState } from "react";
import { CirclePlus, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateRangePicker from "../../../components/AdminComponents/Sub-Components/DateRangePicker";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Agent {
  agencyName: string | null;
  contactNumber: string;
  dateOfBirth: string;
  email: string;
  firstName: string;
  gradeID: string | null;
  hotelID: string | null;
  lastName: string;
  password: string;
  role: string;
  userID: string;
}

interface Booking {}
export default function AgentDashboard({}: {}) {
  // const [hotels, setHotels] = useState<Hotel[]>([]);
  // const [bookings, setBookings] = useState<Booking[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getAgents");
        const data = await response.json();
        setAgents(data.agents);
      } catch (error) {
        console.log("Error fetching agent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filteredAgents = searchQuery
    ? agents.filter((agent) => {
        return (
          agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.agencyName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : agents;

  return (
    <AdminLayout>
      <div className="flex flex-col sm:gap-4 ">
        <div className="flex px-6 py-4 flex-col gap-2">
          <h1 className="text-2xl font-semibold">Agent Tier</h1>
          <span className="text-[#64748B]">
            Manage your details form the dashboard
          </span>
        </div>

        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 ">
          <div className="grid auto-rows-max items-start gap-4 md:gap-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 ">
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-1">
                  <CardDescription className="font-medium text-black">
                    Tier A
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">400</CardTitle>
                </CardHeader>
                <CardContent className="text-[#64748B] text-xs">
                  Currently applied 10% markup in Hotel price{" "}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <div className="border-2 border-[#E2E8F0] py-2 px-4 gap-2 rounded-md font-medium text-sm hover:bg-slate-100">
                        Edit Markup
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Markup</DialogTitle>
                        <DialogDescription>
                          Make changes to your markup value for each tier here.
                          Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="pt-5 space-y-5 ">
                        <div className="space-y-3">
                          <Label>Tier</Label>
                          <Input type="text" placeholder="Tier A" />
                        </div>
                        <div className="space-y-3">
                          <Label>MarkUp Percent</Label>
                          <Input type="nujmber" placeholder="10%" />
                        </div>
                      </div>
                      <div className="flex justify-end w-full mt-3">
                        <Button className=" bg-blue-700">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-1">
                  <CardDescription className="font-medium text-black">
                    Tier B
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">897</CardTitle>
                </CardHeader>
                <CardContent className="text-[#64748B] text-xs">
                  Currently applied 10% markup in Hotel price{" "}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <div className="border-2 border-[#E2E8F0] py-2 px-4 gap-2 rounded-md font-medium text-sm hover:bg-slate-100">
                        Edit Markup
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Markup</DialogTitle>
                        <DialogDescription>
                          Make changes to your markup value for each tier here.
                          Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="pt-5 space-y-5 ">
                        <div className="space-y-3">
                          <Label>Tier</Label>
                          <Input type="text" placeholder="Tier B" />
                        </div>
                        <div className="space-y-3">
                          <Label>MarkUp Percent</Label>
                          <Input type="nujmber" placeholder="10%" />
                        </div>
                      </div>
                      <div className="flex justify-end w-full mt-3">
                        <Button className=" bg-blue-700">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-1">
                  <CardDescription className="font-medium text-black">
                    Tier C
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold">14000</CardTitle>
                </CardHeader>
                <CardContent className="text-[#64748B] text-xs">
                  Currently applied 10% markup in Hotel price{" "}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      <div className="border-2 border-[#E2E8F0] py-2 px-4 gap-2 rounded-md font-medium text-sm hover:bg-slate-100">
                        Edit Markup
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Markup</DialogTitle>
                        <DialogDescription>
                          Make changes to your markup value for each tier here.
                          Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="pt-5 space-y-5 ">
                        <div className="space-y-3">
                          <Label>Tier</Label>
                          <Input type="text" placeholder="Tier C" />
                        </div>
                        <div className="space-y-3">
                          <Label>MarkUp Percent</Label>
                          <Input type="nujmber" placeholder="10%" />
                        </div>
                      </div>
                      <div className="flex justify-end w-full mt-3">
                        <Button className=" bg-blue-700">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>

            <div
              className="filters flex justify-between items-center 
           h-10 -mb-4"
            >
              <Tabs defaultValue="All" className=" w-20 h-10 p-1 rounded-md ">
                <TabsList className="bg-[#64748B] bg-opacity-10">
                  <TabsTrigger
                    value="Tier A"
                    className=""
                    // onClick={() => setActiveTab("TierA")}
                  >
                    Tier A
                  </TabsTrigger>
                  <TabsTrigger
                    value="Tier B"
                    // onClick={() => setActiveTab("TierB")}
                  >
                    Tier B
                  </TabsTrigger>
                  <TabsTrigger
                    value="Tier C"
                    // onClick={() => setActiveTab("TierC")}
                  >
                    Tier C
                  </TabsTrigger>
                  <TabsTrigger
                    value="All"
                    // onClick={() => setActiveTab("All")}
                  >
                    All
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="buttons gap-2 h-8 w-50  ">
                <Button asChild className="bg-blue-600 hover:bg-blue-800  h-8">
                  <Link href="/dashboard/agents/add-agent">
                    <CirclePlus className="size-4 mr-1" />
                    Add Agents
                  </Link>
                </Button>
              </div>
            </div>
            <Tabs className="w-full">
              <Card x-chunk="dashboard-05-chunk-3">
                <div className="p-6 flex justify-between items-center">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl font-semibold">
                      Agents
                    </CardTitle>
                    <CardDescription>
                      Manage your blogs and view their status performance.
                    </CardDescription>
                  </CardHeader>

                  <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full pl-8"
                      // value={searchQuery}
                      // onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead className="">Name</TableHead>
                        <TableHead className="">Tier</TableHead>
                        <TableHead className="">Email</TableHead>
                        <TableHead className="">Agency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAgents?.map((agent, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>001 </TableCell>
                            <TableCell className="">
                              {`${agent.firstName} ${agent.lastName}`}
                            </TableCell>
                            <TableCell className="">
                              <Badge>Tier A</Badge>
                            </TableCell>
                            <TableCell className="">{agent.email}</TableCell>
                            <TableCell className="">
                              {agent.agencyName}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

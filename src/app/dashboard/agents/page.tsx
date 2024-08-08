"use client";
import React, { useEffect, useState } from "react";
import { CirclePlus, MoreHorizontal, Search, User } from "lucide-react";
import { Grade } from "@/utils/types";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, Toaster } from "sonner";

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
  gradeName: string;
}

interface Booking {}
export default function AgentDashboard({}: {}) {
  // const [hotels, setHotels] = useState<Hotel[]>([]);
  // const [bookings, setBookings] = useState<Booking[]>([]);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gradeInfo, setGradeInfo] = useState<Grade[]>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [updatedAgentGrade, setUpdatedAgentGrade] = useState({
    agentID: "",
    gradeID: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [priceModifierObj, setPriceModifierObj] = useState({
    gradeID: "",
    priceModifier: "",
  });
  const [refreshAgents, setRefreshAgents] = useState<boolean>(false);
  const [refreshGrades, setRefreshGrades] = useState<boolean>(false);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  useEffect(() => {
    const fetchGrades = async () => {
      if (!token) return;
      try {
        const response = await fetch("/api/getGradeInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setGradeInfo(data.grade);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGrades();
  }, [token, refreshGrades]);
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
  }, [refreshAgents]);
  const onSubmit = async () => {
    try {
      const response = await fetch("/api/updateAgentGrade", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentID: updatedAgentGrade.agentID,
          gradeID: updatedAgentGrade.gradeID,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Agent tier updated successfully!");
        setIsDialogOpen(false);

        setRefreshAgents(!refreshAgents); // Trigger a refresh of the agents list
      }
    } catch (error) {
      toast.error("Error updating the agent tier.");
      console.log(error);
    }
  };

  const onPriceModifierSubmit = async () => {
    try {
      const response = await fetch("/api/updateAgentGradePrice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gradeID: priceModifierObj.gradeID,
          priceModifier: priceModifierObj.priceModifier,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Agent tier price modifier updated successfully!");
        setRefreshGrades(!refreshGrades);
      }
    } catch (error) {
      toast.error("Error updating the agent tier price modifier.");
      console.log(error);
    }
  };

  const filteredAgents = agents
    .filter((agent) => {
      if (activeTab === "all") return true;
      return agent.gradeName?.toLowerCase() === activeTab.toLowerCase();
    })
    .filter((agent) => {
      return (
        agent.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.agencyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const calculateBookingStatusCounts = (agents: Agent[]) => {
    const statusCounts = {
      tierA: 0,
      tierB: 0,
      tierC: 0,
    };

    agents.forEach((agent) => {
      switch (agent.gradeName) {
        case "A":
          statusCounts.tierA++;
          break;
        case "B":
          statusCounts.tierB++;
          break;
        case "C":
          statusCounts.tierC++;
          break;
        default:
          break;
      }
    });

    return statusCounts;
  };
  const tierCount = calculateBookingStatusCounts(agents);
  const getPriceModifier = (gradeID: string) => {
    const grade = gradeInfo?.find((g) => g.gradeID === gradeID);
    return grade ? grade.priceModifier : "";
  };
  console.log(agents);
  return (
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
                <CardTitle className="text-2xl font-bold">
                  {tierCount.tierA}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#64748B] text-xs">
                Currently applied 10% markup in Hotel price{" "}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Dialog>
                  <DialogTrigger>
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
                        <Label className="text-2xl font-bold">Tier A</Label>
                      </div>
                      <div className="space-y-3">
                        <Label>Mark Up Percent</Label>
                        <Input
                          type="number"
                          placeholder="10%"
                          defaultValue={getPriceModifier(
                            "66b1fa300a0d9e6652fb4890"
                          )}
                          onChange={(e) =>
                            setPriceModifierObj({
                              gradeID: "66b1fa300a0d9e6652fb4890",
                              priceModifier: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <Button onClick={onPriceModifierSubmit}>
                        Save Changes
                      </Button>
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
                <CardTitle className="text-2xl font-bold">
                  {tierCount.tierB}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#64748B] text-xs">
                Currently applied 10% markup in Hotel price{" "}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Dialog>
                  <DialogTrigger>
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
                      <Label className="text-2xl font-bold">Tier B</Label>
                      <div className="space-y-3">
                        <Label>Mark Up Percent</Label>
                        <Input
                          type="number"
                          placeholder="10%"
                          defaultValue={getPriceModifier(
                            "66b1fa550a0d9e6652fb4891"
                          )}
                          onChange={(e) =>
                            setPriceModifierObj({
                              gradeID: "66b1fa550a0d9e6652fb4891",
                              priceModifier: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <Button onClick={onPriceModifierSubmit}>
                        Save Changes
                      </Button>
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
                <CardTitle className="text-2xl font-bold">
                  {tierCount.tierC}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#64748B] text-xs">
                Currently applied 10% markup in Hotel price{" "}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Dialog>
                  <DialogTrigger>
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
                        <Label className="text-2xl font-bold">Tier C</Label>
                      </div>
                      <div className="space-y-3">
                        <Label>Mark Up Percent</Label>
                        <Input
                          type="number"
                          placeholder="10%"
                          defaultValue={getPriceModifier(
                            "66b1fa6c0a0d9e6652fb4892"
                          )}
                          onChange={(e) =>
                            setPriceModifierObj({
                              gradeID: "66b1fa6c0a0d9e6652fb4892",
                              priceModifier: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end w-full mt-3">
                      <Button onClick={onPriceModifierSubmit}>
                        Save Changes
                      </Button>
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
            <Tabs
              defaultValue="all"
              className=" w-20 h-10 p-1 rounded-md"
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="bg-[#64748B] bg-opacity-10">
                <TabsTrigger
                  value="A"
                  className=""
                  // onClick={() => setActiveTab("TierA")}
                >
                  Tier A
                </TabsTrigger>
                <TabsTrigger
                  value="B"
                  // onClick={() => setActiveTab("TierB")}
                >
                  Tier B
                </TabsTrigger>
                <TabsTrigger
                  value="C"
                  // onClick={() => setActiveTab("TierC")}
                >
                  Tier C
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  // onClick={() => setActiveTab("All")}
                >
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="buttons gap-2 h-8 w-50  ">
              <Button asChild className="  h-8">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Agency</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
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
                            <Badge>
                              Tier {agent.gradeName ? agent.gradeName : ""}
                            </Badge>
                          </TableCell>
                          <TableCell className="">{agent.email}</TableCell>
                          <TableCell className="">{agent.agencyName}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <Dialog
                                  open={isDialogOpen}
                                  onOpenChange={setIsDialogOpen}
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      className="h-10 w-full"
                                      variant="ghost"
                                    >
                                      Update Tier
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Update Tier</DialogTitle>
                                      <DialogDescription>
                                        Update the agent tier from here.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="flex items-center gap-4">
                                        <Label htmlFor="username">
                                          Agent name:
                                        </Label>
                                        <div className="">
                                          {agent.firstName} {agent.lastName}
                                        </div>
                                      </div>
                                      {/* <div className="flex items-center gap-4">
                                          <Label htmlFor="username">
                                            Agent Id:
                                          </Label>
                                          <div className="">{agent.userID}</div>
                                        </div> */}
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                          htmlFor="name"
                                          className="text-right"
                                        >
                                          Tier
                                        </Label>
                                        <Select
                                          onValueChange={(value) =>
                                            setUpdatedAgentGrade(
                                              (prevState) => ({
                                                ...prevState,
                                                gradeID: value,
                                                agentID: agent.userID,
                                              })
                                            )
                                          }
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a grade" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="66b1fa300a0d9e6652fb4890">
                                                A
                                              </SelectItem>
                                              <SelectItem value="66b1fa550a0d9e6652fb4891">
                                                B
                                              </SelectItem>
                                              <SelectItem value="66b1fa6c0a0d9e6652fb4892">
                                                c
                                              </SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        onClick={() => onSubmit()}
                                      >
                                        Save changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
      <Toaster />
    </div>
  );
}

import React, { useEffect, useState } from "react";

import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import DateRangePicker from "../AdminComponents/Sub-Components/DateRangePicker";
import AdminLayout from "../Layout/AdminLayout";
import { Agent, Booking, Hotel } from "@/utils/types";
export default function Dashboard({
  hotels,
  bookings,
  agents,
}: {
  hotels: Hotel[];
  bookings: Booking[];
  agents: Agent[];
}) {
  return (
    <AdminLayout>
      <div className="flex flex-col sm:gap-4 ">
        <div className="p-6 flex justify-between ">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <span>Manage your details form the dashboard</span>
          </div>

          <DateRangePicker />
        </div>
        <main className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8 ">
          <div className="grid auto-rows-max items-start gap-4 md:gap-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Total Revenue</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Orders Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Create New Order</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Hotels
                  </CardDescription>
                  <CardTitle className="text-4xl">{hotels?.length}</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter>
                  <Progress value={25} aria-label="25% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Agents
                  </CardDescription>
                  <CardTitle className="text-4xl">{agents.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription className="font-medium text-black">
                    Bookings
                  </CardDescription>
                  <CardTitle className="text-4xl">{bookings?.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress value={12} aria-label="12% increase" />
                </CardFooter>
              </Card>
            </div>
            <div className="w-full justify-between flex gap-6">
              <Tabs className="w-3/4">
                <Card x-chunk="dashboard-05-chunk-3">
                  <div className="p-6 flex justify-between items-center">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl font-semibold">
                        Bookings
                      </CardTitle>
                      <CardDescription>
                        Recent bookings in Jambo Hotels.
                      </CardDescription>
                    </CardHeader>
                    <button className=" py-2 px-6 bg-blue-400 h-10">
                      View All
                    </button>
                  </div>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hotel Name</TableHead>
                          <TableHead className="text-right">
                            Agent Name
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings?.map((booking, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{booking.hotel.name} </TableCell>
                              <TableCell className="text-right">
                                {`${booking.user.firstName} ${booking.user.lastName}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Tabs>
              <Card className="w-1/4" x-chunk="dashboard-05-chunk-4">
                <CardHeader className="flex flex-row items-start ">
                  <CardTitle className="group flex items-center gap-2 text-2xl">
                    Agents
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-6 text-sm">
                  {agents.map((agent, index) => {
                    return (
                      <div key={index} className="flex justify-between">
                        <div className="flex gap-x-3 items-center">
                          <div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="overflow-hidden rounded-full"
                            >
                              <User />
                            </Button>
                          </div>
                          <div>
                            <div>{`${agent.firstName} ${agent.lastName}`} </div>
                            <div>{agent.email}</div>
                          </div>
                        </div>
                        <div className="self-center">{agent.agencyName}</div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}

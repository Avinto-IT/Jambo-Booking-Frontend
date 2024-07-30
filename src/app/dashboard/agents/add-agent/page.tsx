"use client";

import Link from "next/link";
import { useState, useEffect, Key } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/Layout/AdminLayout";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select, { components, MenuListProps } from "react-select";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Title,
  Value,
} from "@/components/AdminComponents/Sub-Components/ReviewComponents";

import { ChevronDown } from "lucide-react";

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
  address: string;
}

interface CollapsedSectionsState {
  basicInformation: boolean;
  password: boolean;
  review: boolean;
}

interface FormData {
  basicInfo: {
    name: string;
    email: string;
    phone: number;
    agency: string;
    address: string;

    tier: { value: string; label: string };
    toursCompleted: number;
  };
  password: {
    createNewPassword: string;
    confirmPassword: string;
  };
}

const basicInfoSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  address: z
    .string()
    .min(1, "location is required")
    .refine(
      (value) => {
        //to checkif location is in state,city,country,zip code format
        const parts = value.split(",").map((part) => part.trim());
        return parts.length === 4;
      },
      {
        message:
          "Address must be in the form of 'state, city, country, zip code'",
      }
    ),

  email: z.string().min(5, "Email is required"),
  phone: z.string().min(10, "enter valid phone number"),
  agency: z.string().min(1, "Agency name is required"),
  //   tier: z.object({
  //     value: z.string().min(1, "tier is required"),
  //   }),
  toursCompleted: z.number().min(0, "tourscannot be negetive"),
});

const passwordSchema = z
  .object({
    createNewPassword: z
      .string()
      .min(7, "Password must be 7 or more characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.createNewPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const formSchemas = [
  z.object({ basicInfo: basicInfoSchema }),
  z.object({ password: passwordSchema }),
];
export default function AddHotel() {
  const [currentStep, setCurrentStep] = useState(0);
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedSectionsState>({
      basicInformation: false,
      password: true,
      review: true,
    });

  const steps = [
    { component: BasicInformation, label: "Basic Information" },
    { component: Password, label: "Password" },
    { component: Review, label: "Review" },
  ];
  const CurrentComponent = steps[currentStep].component;
  const methods = useForm<FormData>({
    resolver:
      currentStep < formSchemas.length
        ? zodResolver(formSchemas[currentStep])
        : undefined,
    defaultValues: {
      basicInfo: {
        name: "",
        address: "",
        email: "",
        // phone: ,
        agency: "",
        tier: { value: "", label: "" },
        toursCompleted: 2,
      },
      password: {
        confirmPassword: "",
        createNewPassword: "",
      },
      //  isRunning: false,
    },
  });

  const [token, setToken] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  const router = useRouter();
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getAgents");
        const data: Agent[] = await response.json();
        setAgents(data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitClicked(true);
    const payload = {
      ...data.basicInfo,
      ...data.password,
    };
    try {
      const response = await fetch("/api/setAgents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Agent added successfully!");
        setTimeout(() => {
          router.push("/dashboard/agents");
        }, 1500);
      } else {
        toast.error(`Error: ${result.error}`);
        setIsSubmitClicked(false);
      }
    } catch (error) {
      setIsSubmitClicked(false);

      console.log(error);
      toast.error("Error: Unable to add agent.");
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();
    console.log(isValid);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  function BasicInformation() {
    const {
      register,
      setValue,
      formState: { errors },
    } = methods;

    return (
      <div className="grid gap-8">
        <Card x-chunk="dashboard-04-chunk-1 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Basic Information
            </CardTitle>
            <CardDescription>
              Add agent basic details such as name, location. You can always
              edit your details here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  placeholder="Luffy"
                  {...register("basicInfo.name")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.name?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full"
                  placeholder="Luffy@gmail.com"
                  {...register("basicInfo.email")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.email?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.email.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Phone Number</Label>
                <Input
                  id="phone"
                  type="text"
                  className="w-full"
                  placeholder="9812345678"
                  {...register("basicInfo.phone")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.phone?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.phone.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Agency</Label>
                <Input
                  id="agency"
                  type="text"
                  className="w-full"
                  placeholder="luffykoagency"
                  {...register("basicInfo.agency")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.agency?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.agency.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Location</Label>
                <Input
                  id="address"
                  type="text"
                  className="w-full"
                  placeholder="address"
                  {...register("basicInfo.address")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.address?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.address.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="tier">Tier</Label>
                <Controller
                  name="basicInfo.tier"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      instanceId="tier-select"
                      //   components={{ MenuList }}
                      //   options={[...tierOptions]}
                      placeholder="Select Tier"
                    />
                  )}
                />
                {errors?.basicInfo?.tier?.value?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.tier?.value.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Tours Completed</Label>
                <Input
                  id="toursCompleted"
                  type="number"
                  className="w-full"
                  {...register("basicInfo.toursCompleted", {
                    setValueAs: (v) => (v === "" ? undefined : parseInt(v, 10)),
                  })}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.toursCompleted?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.toursCompleted.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function Password() {
    const {
      register,
      formState: { errors },
    } = methods;
    return (
      <div className="grid gap-8">
        <Card x-chunk="dashboard-04-chunk-1 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Password</CardTitle>
            <CardDescription>
              Create your passwordalsdkmlakdmlksamdlkasmdlnsalkdnlsakdn here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">Create New Password </Label>
                <Input
                  id="createNewPassword"
                  type="password"
                  className="w-full"
                  placeholder="Enter your password"
                  {...register("password.createNewPassword")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.password?.createNewPassword?.message && (
                  <span className="text-red-500">
                    {errors?.password?.createNewPassword.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="name">Confirm Password </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="w-full"
                    placeholder="Enter your password"
                    {...register("password.confirmPassword")}
                    onKeyDown={handleKeyDown}
                  />
                  {errors?.password?.confirmPassword?.message && (
                    <span className="text-red-500">
                      {errors?.password?.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  function Review() {
    const { getValues } = useFormContext<FormData>();

    const formData = getValues();
    if (!formData.basicInfo) {
      return <div>Loading...</div>;
    }

    const toggleSection = (section: "basicInformation" | "password") => {
      setCollapsedSections((prevState) => ({
        ...prevState,
        [section]: !prevState[section],
      }));
    };
    return (
      <div className="flex flex-col gap-8">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex justify-center gap-1.5">
              <ChevronDown
                className={`mt-0.5 ${
                  collapsedSections.basicInformation ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("basicInformation")}
              />

              <CardTitle className="text-2xl font-semibold">
                Basic Information
                <div className="text-sm font-normal text-slate-400">
                  <div className="">Your general information.</div>
                  <div className="">
                    Click on edit to modify basic information.
                  </div>
                </div>
              </CardTitle>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(0)}
            >
              Edit
            </Button>
          </CardHeader>
          {!collapsedSections.basicInformation && (
            <CardContent className="">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <Title>Name</Title>
                  <Value>{formData.basicInfo.name}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Email</Title>
                  <Value>{formData.basicInfo.email}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Phone Number</Title>
                  <Value>{formData.basicInfo.phone}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Phone Number</Title>
                  <Value>{formData.basicInfo.phone}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Agency</Title>
                  <Value>{formData.basicInfo.agency}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Location</Title>
                  <Value>{formData.basicInfo.address}</Value>
                </div>
                {/* <div className="flex justify-between items-center">
                  <Title>Tier</Title>
                  <Value>{formData.basicInfo.tier}</Value>
                </div> */}
                <div className="flex justify-between items-center">
                  <Title>Tours Completed</Title>
                  <Value>{formData.basicInfo.toursCompleted}</Value>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex justify-center gap-1.5">
              <ChevronDown
                className={`mt-0.5 ${
                  collapsedSections.password ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("password")}
              />

              <CardTitle className="text-2xl font-semibold">
                Password
                <div className="text-sm font-normal text-slate-400">
                  <div className="">Your password.</div>
                  <div className="">
                    Click on edit to modify basic information.
                  </div>
                </div>
              </CardTitle>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(1)}
            >
              Edit
            </Button>
          </CardHeader>
          {!collapsedSections.password && (
            <CardContent className="">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <Title>Create New Password</Title>
                  <Value>{formData.password.createNewPassword}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Confirm Password</Title>
                  <Value>{formData.password.confirmPassword}</Value>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <FormProvider {...methods}>
        <div className="border-2 rounded-md bg-white flex flex-col gap">
          <div className="p-6 grid w-full max-w-6xl gap-2">
            <h1 className="text-2xl font-semibold">Add Agent</h1>
            <div>Manage and view their overall details.</div>
          </div>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="p-6 grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav
                className="grid gap-4 text-sm text-muted-foreground"
                x-chunk="dashboard-04-chunk-0"
              >
                {steps.map((step, index) => (
                  <Link
                    key={index}
                    href="#"
                    className={`font-semibold ${
                      currentStep === index ? "text-primary" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentStep(index);
                    }}
                  >
                    {step.label}
                  </Link>
                ))}
              </nav>
              <div className="grid gap-8">
                <CurrentComponent />
                <div className="flex gap-1.5">
                  {currentStep > 0 ? (
                    <Button
                      className="bg-white text-black"
                      type="button"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <Button className="bg-white text-black" type="button">
                      <Link href="/dashboard/agents">Discard</Link>
                    </Button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <Button
                      className="bg-blue-700 hover:bg-blue-900"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      className="bg-blue-700 hover:bg-blue-900"
                      type="submit"
                      disabled={isSubmitClicked ? true : false}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </form>
          <Toaster />
        </div>
      </FormProvider>
    </AdminLayout>
  );
}

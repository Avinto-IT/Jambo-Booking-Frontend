"use client";
import Link from "next/link";
import { useState, useEffect, Key, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  Controller,
  FieldError,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/Layout/AdminLayout";
import { ChevronDown, PlusCircle, Trash, Upload } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Dot } from "lucide-react";

import bed from "../../../../../public/images/Bed.svg";
import guest from "../../../../../public/images/Guest.svg";

import facilitiesIcon from "../../../../../data/facilities.json";
import * as Icons from "lucide-react";

import staticimg from "../../../../../public/images/static-from-landing/image.svg";
import staticimg2 from "../../../../../public/images/an_image_for_hotel_booking.svg";
import staticimg3 from "../../../../../public/images/explore-east-africa/Photo1.svg";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { Location } from "@/utils/types";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Title,
  Value,
} from "@/components/AdminComponents/Sub-Components/ReviewComponents";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
interface HouseRule {
  id: number;
  type: {
    label: string;
    value: string;
  };
  details: string;
}

interface Facility {
  id: number;
  name: { label: string; value: string };
  description: string;
  subFacilities: { id: number; name: string }[];
}

interface Room {
  id: number;
  type: string;
  numberOfRooms: string;
  price: string;
  capacity: string;
  bedType: string;
  numberOfBeds: string;
  amenities: { id: number; name: string }[];
}

interface ContactDetails {
  name: string;
  position: string;
  email: string;
  number: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

interface FormData {
  basicInfo: {
    hotelID: string;
    name: string;
    location: { value: string; label: string };
    discount: string;
    description: string;
  };
  facilities: Facility[];
  rooms: Room[];
  contactForm: ContactDetails;
  houseRules: HouseRule[];
  isRunning: boolean;

  primaryImageLink: string;
  imageLinks: string[];
}
interface CollapsedSectionsState {
  basicInformation: boolean;
  facilities: boolean;
  room: boolean;
  houseRules: boolean;
  contactDetails: boolean;
}
const basicInfoSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.object({
    value: z.string().min(1, "Location is required"),
    // label: z.string().min(1, "Location label is required"),
  }),
  discount: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

const facilitySchema = z.object({
  name: z.object({
    label: z.string().min(1, "Facility is required"),
    value: z.string().min(1, "Facility is required"),
  }),
  description: z.string().min(1, "Description is required"),
  subFacilities: z
    .array(
      z.object({ name: z.string().min(1, "Sub-facility name is required") })
    )
    .min(1, "At least one sub-facility is required"),
});

const roomSchema = z.object({
  type: z.string().min(1, "Room type is required"),
  numberOfRooms: z.string().min(1, "Number of rooms is required"),
  price: z.string().min(1, "Price is required"),
  capacity: z.string().min(1, "Capacity is required"),
  bedType: z.string().min(1, "Bed type is required"),
  numberOfBeds: z.string().min(1, "Number of beds is required"),
  amenities: z
    .array(z.object({ name: z.string().min(1, "Amenity name is required") }))
    .min(1, "At least one amenity is required"),
});

const contactDetailsSchema = z.object({
  name: z.string().min(1, "Contact person name is required"),
  position: z.string().min(1, "Position is required"),
  email: z.string().email("Invalid email address"),
  number: z.string().min(1, "Phone number is required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
});

const houseRuleSchema = z.object({
  type: z.object({
    label: z.string().min(1, "House Rules is required"),
    value: z.string().min(1, "House Rules is required"),
  }),
  details: z.string().min(1, "Details are required"),
});

const formSchemas = [
  z.object({ basicInfo: basicInfoSchema }),
  z.object({
    facilities: z
      .array(facilitySchema)
      .min(1, "At least one facility is required"),
  }),
  z.object({
    rooms: z.array(roomSchema).min(1, "At least one room type is required"),
  }),
  z.object({
    houseRules: z
      .array(houseRuleSchema)
      .min(1, "At least one house rule is required"),
  }),
  z.object({ contactForm: contactDetailsSchema }),
];
export default function AdminUpdateHotel() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminUpdateHotelContent />
    </Suspense>
  );
}
const AdminUpdateHotelContent = () => {
  const steps = [
    { component: BasicInformation, label: "Basic Information" },
    { component: Facilities, label: "Facilities" },
    { component: AddRoom, label: "Room" },
    { component: HouseRules, label: "House Rules" },
    { component: ContactDetails, label: "Contact Details" },
    { component: Review, label: "Review" },
    { component: View, label: "View" },
  ];

  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const [hotel, setHotel] = useState(null);
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedSectionsState>({
      basicInformation: false,
      facilities: false,
      room: false,
      houseRules: false,
      contactDetails: false,
    });
  const [currentStep, setCurrentStep] = useState(0);
  const CurrentComponent = steps[currentStep].component;
  const [token, setToken] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const router = useRouter();
  const methods = useForm<FormData>({
    resolver:
      currentStep < formSchemas.length
        ? zodResolver(formSchemas[currentStep])
        : undefined,
    defaultValues: {
      basicInfo: {
        name: "",
        location: {
          value: "",
          label: "",
        },
        discount: "",
        description: "",
      },
      facilities: [
        {
          id: 1,
          name: { label: "", value: "" },
          description: "",
          subFacilities: [{ id: 1, name: "" }],
        },
      ],
      rooms: [
        {
          id: 1,
          type: "",
          numberOfRooms: "",
          price: "",
          capacity: "",
          bedType: "",
          numberOfBeds: "",
          amenities: [{ id: 1, name: "" }],
        },
      ],
      contactForm: {
        name: "",
        position: "",
        email: "",
        number: "",
        facebook: "",
        instagram: "",
        linkedin: "",
      },
      houseRules: [
        {
          id: 1,
          type: {
            value: "",
            label: "",
          },
          details: "",
        },
      ],
      isRunning: false,
    },
  });
  const { reset } = methods;

  useEffect(() => {
    if (id) {
      const fetchHotel = async () => {
        try {
          const response = await fetch(`/api/getHotelById?id=${id}`);
          const data = await response.json();
          setHotel(data.hotel);
          if (data.hotel) {
            reset({
              basicInfo: {
                hotelID: id,
                name: data.hotel.name,
                location: {
                  value: data.hotel.locationID,
                  label: data.hotel.address,
                },
                discount: data.hotel.discount.toString(),
                description: data.hotel.description,
              },
              facilities: data.hotel.facilities.map(
                (facility: Facility, index: Key) => ({
                  id: index,
                  name: {
                    label: facility.name,
                    value: facility.name,
                  },
                  description: facility.description,
                  subFacilities: facility.subFacilities.map(
                    (subFacility, subIndex) => ({
                      id: subIndex,
                      name: subFacility.name,
                    })
                  ),
                })
              ),
              rooms: data.hotel.rooms.map((room: Room, index: Key) => ({
                id: index,
                type: room.type,
                numberOfRooms: room.numberOfRooms,
                price: room.price,
                capacity: room.capacity,
                bedType: room.bedType,
                numberOfBeds: room.numberOfBeds,
                amenities: room.amenities.map((amenity, amenityIndex) => ({
                  id: amenityIndex,
                  name: amenity.name,
                })),
              })),
              contactForm: {
                name: data.hotel.contactDetails.name,
                position: data.hotel.contactDetails.position,
                email: data.hotel.contactDetails.email,
                number: data.hotel.contactDetails.number,
                facebook: data.hotel.contactDetails.facebook,
                instagram: data.hotel.contactDetails.instagram,
                linkedin: data.hotel.contactDetails.linkedin,
              },
              houseRules: data.hotel.houseRules.map(
                (houseRule: HouseRule, index: Key) => ({
                  id: index,
                  type: {
                    label: houseRule.type,
                    value: houseRule.type,
                  },
                  details: houseRule.details,
                })
              ),
              isRunning: data.hotel.isRunning,
            });
          }
        } catch (error) {
          console.log("Error fetching hotel:", error);
        }
      };
      fetchHotel();
    }
  }, [id, reset]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/getLocation");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
    console.log("fetching locations");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({
    control: methods.control,
    name: "facilities",
  });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control: methods.control,
    name: "rooms",
  });

  const {
    fields: houseRuleFields,
    append: appendHouseRule,
    remove: removeHouseRule,
  } = useFieldArray({
    control: methods.control,
    name: "houseRules",
  });

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data.basicInfo,
      hotelID: data.basicInfo.hotelID,
      address: data.basicInfo.location.label,
      locationID: data.basicInfo.location.value,
      facilities: data.facilities.map((facility) => ({
        name: facility.name.value,
        description: facility.description,
        subFacilities: facility.subFacilities.map((subFacility) => ({
          name: subFacility.name,
        })),
      })),
      primaryImageLink: "asdfasdfasdf",
      imageLinks: ["asdfasdfasdfasdf,asdfasdf"],
      rooms: data.rooms.map((room) => ({
        type: room.type,
        numberOfRooms: room.numberOfRooms,
        price: room.price,
        capacity: room.capacity,
        bedType: room.bedType,
        numberOfBeds: room.numberOfBeds,
        amenities: room.amenities.map((amenity) => ({
          name: amenity.name,
        })),
      })),
      contactDetails: data.contactForm,
      houseRules: data.houseRules.map((houseRule) => ({
        type: houseRule.type.value,
        details: houseRule.details,
      })),
      isRunning: data.isRunning,
      discount: parseFloat(data.basicInfo.discount),
    };
    console.log(payload);

    try {
      const response = await fetch("/api/updateHotelAdmin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Hotel updated successfully!"); // Use toast to show success message
        setTimeout(() => {
          router.push("/dashboard/hotels");
        }, 3000);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error: Unable to update hotel."); // Use toast to show error message
    }
  };

  const handleNext = async () => {
    const isValid = await methods.trigger();
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
      formState: { errors },
    } = methods;
    return (
      <div className="grid gap-8">
        <Card x-chunk="dashboard-04-chunk-1 p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Hotel Details
            </CardTitle>
            <CardDescription>
              Lipsum Dolor sit amet, consecteur adipiscing elit
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
                  placeholder="Hotel's Name"
                  {...register("basicInfo.name")}
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.name?.message && (
                  <span className="text-red-500">
                    {errors.basicInfo.name.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="location">Location</Label>
                <Controller
                  name="basicInfo.location"
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      instanceId="location-select"
                      options={locations.map((location) => ({
                        value: location.locationID,
                        label: `${location.city}, ${location.country}`,
                      }))}
                      placeholder="Select Location"
                    />
                  )}
                />
                {errors?.basicInfo?.location?.value?.message && (
                  <span className="text-red-500">
                    {errors.basicInfo.location.value.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="discount">Discount Offer</Label>
                <Controller
                  name="basicInfo.discount"
                  control={methods.control}
                  render={({ field }) => (
                    <Input
                      id="discount"
                      type="number"
                      className="w-full"
                      {...field}
                      placeholder="Discount Offer"
                      onKeyDown={handleKeyDown}
                    />
                  )}
                />
                {errors?.basicInfo?.discount?.message && (
                  <span className="text-red-500">
                    {errors.basicInfo.discount.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="w-full"
                  {...register("basicInfo.description")}
                  placeholder="Description"
                  onKeyDown={handleKeyDown}
                />
                {errors?.basicInfo?.description?.message && (
                  <span className="text-red-500">
                    {errors.basicInfo.description.message}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Hotel Images</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Image
                alt="Product image"
                className=" rounded-md object-cover"
                height={200}
                src="/images/image-placeholder.png"
                width={400}
              />
              <div className="grid grid-cols-3 gap-2">
                <button>
                  <Image
                    alt="Product image"
                    className="w-full rounded-md object-cover"
                    height={100}
                    src="/images/image-placeholder.png"
                    width={100}
                  />
                </button>
                <button>
                  <Image
                    alt="Product image"
                    className="w-full rounded-md object-cover"
                    height={100}
                    src="/images/image-placeholder.png"
                    width={100}
                  />
                </button>
                <button className="flex w-full items-center justify-center rounded-md border border-dashed">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Upload</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function Facilities() {
    const {
      register,
      formState: { errors },
    } = methods;

    const facilitiesList = [
      "Reception/Front Desk",
      "Room Amenities",
      "Bathroom Amenities",
      "Food and Beverage",
      "Facilities and Services",
      "Accessibility",
      "Parking",
      "Security",
      "Leisure and Recreation",
      "Additional Services",
    ];

    const addSubFacility = (facilityIndex: number) => {
      const newSubFacility = { id: Date.now(), name: "" };
      const facilities = methods.getValues("facilities");
      facilities[facilityIndex].subFacilities.push(newSubFacility);
      methods.setValue("facilities", facilities);
    };

    const removeSubFacility = (
      facilityIndex: number,
      subFacilityIndex: number
    ) => {
      const facilities = methods.getValues("facilities");

      facilities[facilityIndex].subFacilities.splice(subFacilityIndex, 1);

      methods.setValue("facilities", facilities);
    };

    return (
      <div className="p-6 space-y-6">
        {facilityFields.map((facility, facilityIndex) => (
          <Card key={facility.id} className="overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row justify-between ">
              <div>
                <CardTitle>Facility {facilityIndex + 1}</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => removeFacility(facilityIndex)}
              >
                <Trash className="h-4 w-4" />
                Remove Facility
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Label htmlFor={`facility-name-${facility.id}`}>
                  Facility Name
                </Label>
                <Controller
                  name={`facilities.${facilityIndex}.name`}
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={facilitiesList.map((facility) => ({
                        value: facility,
                        label: facility,
                      }))}
                      placeholder="Select facility"
                    />
                  )}
                />
                {errors?.facilities?.[facilityIndex]?.name?.value?.message && (
                  <span className="text-red-500">
                    {errors?.facilities?.[facilityIndex]?.name?.value?.message}
                  </span>
                )}

                <Label htmlFor={`facility-description-${facility.id}`}>
                  Short Description
                </Label>
                <Input
                  id={`facility-description-${facility.id}`}
                  type="text"
                  {...register(`facilities.${facilityIndex}.description`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.facilities?.[facilityIndex]?.description?.message && (
                  <span className="text-red-500">
                    {errors?.facilities?.[facilityIndex]?.description?.message}
                  </span>
                )}
                <div>
                  <div className="grid gap-4">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-left">S.No.</TableHead>
                          <TableHead className="text-left">
                            Sub Facility
                          </TableHead>
                          <TableHead className="text-left">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {facility.subFacilities.map((subFacility, subIndex) => (
                          <TableRow key={subFacility.id}>
                            <TableCell className="font-semibold">
                              {String(subIndex + 1).padStart(2, "0")}
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`facilities.${facilityIndex}.subFacilities.${subIndex}.name`}
                                control={methods.control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Lorem Ipsum"
                                    className="flex-1"
                                    onKeyDown={handleKeyDown}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  removeSubFacility(facilityIndex, subIndex);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow>
                          <TableCell colSpan={3} className="">
                            <Button
                              variant="ghost"
                              onClick={() => addSubFacility(facilityIndex)}
                              className="flex items-center gap-1"
                            >
                              <PlusCircle className="h-4 w-4" />
                              Add Sub Facility
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    {Array.isArray(errors?.facilities) &&
                      errors?.facilities?.map(
                        (facilityError, facilityIndex) => (
                          <div key={facilityIndex}>
                            {facilityError?.subFacilities?.root?.message && (
                              <span className="text-red-500">
                                {facilityError.subFacilities.root.message}
                              </span>
                            )}
                            {Array.isArray(facilityError?.subFacilities) &&
                              facilityError?.subFacilities?.map(
                                (
                                  subFacilityError: { name: FieldError },
                                  subFacilityIndex: Key | null | undefined
                                ) => (
                                  <div key={subFacilityIndex}>
                                    {subFacilityError?.name?.message && (
                                      <span className="text-red-500">
                                        {subFacilityError.name.message}
                                      </span>
                                    )}
                                  </div>
                                )
                              )}
                          </div>
                        )
                      )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="w-full p-6 border-2  rounded-lg flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              appendFacility({
                id: Date.now(),
                name: { label: "", value: "" },
                description: "",
                subFacilities: [{ id: Date.now(), name: "" }],
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Facility
          </Button>
        </div>
        {errors?.facilities?.root?.message && (
          <span className="text-red-500">{errors.facilities.root.message}</span>
        )}
      </div>
    );
  }

  function AddRoom() {
    const {
      register,
      formState: { errors },
    } = methods;

    const addAmenity = (roomIndex: number) => {
      const newAmenity = { id: Date.now(), name: "" };
      const rooms = methods.getValues("rooms");
      rooms[roomIndex].amenities.push(newAmenity);
      methods.setValue("rooms", rooms);
    };

    const removeAmenity = (roomIndex: number, amenityIndex: number) => {
      const rooms = methods.getValues("rooms");
      rooms[roomIndex].amenities.splice(amenityIndex, 1);
      methods.setValue("rooms", rooms);
    };

    return (
      <div className="p-6 space-y-6">
        {roomFields.map((room, roomIndex) => (
          <Card key={room.id} className="overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row justify-between ">
              <div>
                <CardTitle>Room Type {roomIndex + 1}</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => removeRoom(roomIndex)}>
                <Trash className="h-4 w-4" />
                Remove Room
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Label htmlFor={`room-type-${room.id}`}>Room Type</Label>
                <Input
                  id={`room-type-${room.id}`}
                  {...register(`rooms.${roomIndex}.type`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {(errors?.rooms?.[roomIndex]?.type as FieldError)?.message && (
                  <span className="text-red-500">
                    {(errors?.rooms?.[roomIndex]?.type as FieldError).message}
                  </span>
                )}
                <Label htmlFor={`number-of-rooms-${room.id}`}>
                  Number of Rooms
                </Label>
                <Input
                  id={`number-of-rooms-${room.id}`}
                  {...register(`rooms.${roomIndex}.numberOfRooms`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.numberOfRooms?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.numberOfRooms?.message}
                  </span>
                )}
                <Label htmlFor={`price-${room.id}`}>Price</Label>
                <Input
                  id={`price-${room.id}`}
                  {...register(`rooms.${roomIndex}.price`)}
                  placeholder="Lorem Ipsum"
                  required
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.price?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.price?.message}
                  </span>
                )}
                <Label htmlFor={`capacity-${room.id}`}>Capacity</Label>
                <Input
                  id={`capacity-${room.id}`}
                  {...register(`rooms.${roomIndex}.capacity`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.capacity?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.capacity?.message}
                  </span>
                )}
                <Label htmlFor={`bed-type-${room.id}`}>Bed Type</Label>
                <Input
                  id={`bed-type-${room.id}`}
                  {...register(`rooms.${roomIndex}.bedType`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.bedType?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.bedType?.message}
                  </span>
                )}
                <Label htmlFor={`number-of-beds-${room.id}`}>
                  Number of Beds
                </Label>
                <Input
                  id={`number-of-beds-${room.id}`}
                  {...register(`rooms.${roomIndex}.numberOfBeds`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.numberOfBeds?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.numberOfBeds?.message}
                  </span>
                )}
                <div>
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-left">S.No.</TableHead>
                        <TableHead className="text-left">Amenities</TableHead>
                        <TableHead className="text-left">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {room.amenities.map((amenity, amenityIndex) => (
                        <TableRow key={amenity.id}>
                          <TableCell className="font-semibold">
                            {String(amenityIndex + 1).padStart(2, "0")}
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`rooms.${roomIndex}.amenities.${amenityIndex}.name`}
                              control={methods.control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Lorem Ipsum"
                                  className="flex-1"
                                  onKeyDown={handleKeyDown}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                removeAmenity(roomIndex, amenityIndex);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {Array.isArray(errors?.rooms) &&
                    errors?.rooms?.map((roomError, roomIndex) => (
                      <div key={roomIndex}>
                        {roomError?.amenities?.root && (
                          <span className="text-red-500">
                            {roomError?.amenities?.root?.message}
                          </span>
                        )}
                        {Array.isArray(roomError?.amenities) &&
                          roomError?.amenities?.map(
                            (
                              amenityError: { name: { message: string } },
                              amenityIndex: Key
                            ) => (
                              <div key={amenityIndex}>
                                {amenityError?.name?.message && (
                                  <span className="text-red-500">
                                    {amenityError?.name?.message}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                      </div>
                    ))}

                  <Button
                    variant="ghost"
                    onClick={() => addAmenity(roomIndex)}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Amenity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <div className="w-full p-6 border-2  rounded-lg flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              appendRoom({
                id: Date.now(),
                type: "",
                numberOfRooms: "",
                price: "",
                capacity: "",
                bedType: "",
                numberOfBeds: "",
                amenities: [{ id: Date.now(), name: "" }],
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Room
          </Button>
        </div>
        {errors?.rooms?.root?.message && (
          <span className="text-red-500">{errors?.rooms?.root?.message}</span>
        )}
      </div>
    );
  }

  function HouseRules() {
    const {
      register,
      formState: { errors },
    } = methods;

    const houseRuleOptions = [
      { value: "No Smoking", label: "No Smoking" },
      { value: "No Pets", label: "No Pets" },
      { value: "No Parties", label: "No Parties" },
    ];

    return (
      <div className="p-6 space-y-6">
        {houseRuleFields.map((houseRule, index) => (
          <Card key={houseRule.id} className=" flex flex-col">
            <CardHeader className="flex flex-row justify-between ">
              <div>
                <CardTitle>House Rule {index + 1}</CardTitle>
                <CardDescription>
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => removeHouseRule(index)}>
                <Trash className="h-4 w-4" />
                Remove House Rule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <Label htmlFor={`house-rule-type-${houseRule.id}`}>
                  House Rule Type
                </Label>
                <Controller
                  name={`houseRules.${index}.type`}
                  control={methods.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={houseRuleOptions}
                      placeholder="Select house rule"
                    />
                  )}
                />
                {Array.isArray(errors.houseRules) &&
                  errors.houseRules.map((houseRuleError, houseRuleIndex) => (
                    <div key={houseRuleIndex}>
                      {houseRuleError.type?.value?.messsage && (
                        <span className="text-red-500">
                          {houseRuleError.type.value.message}
                        </span>
                      )}
                    </div>
                  ))}
                <Label htmlFor={`house-rule-details-${houseRule.id}`}>
                  Details
                </Label>
                <Input
                  id={`house-rule-details-${houseRule.id}`}
                  {...register(`houseRules.${index}.details`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.houseRules?.[index]?.details?.message && (
                  <span className="text-red-500">
                    {errors?.houseRules?.[index]?.details?.message}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="w-full p-6 border-2  rounded-lg flex items-center justify-center">
          <Button
            variant="ghost"
            onClick={() =>
              appendHouseRule({
                id: Date.now(),
                type: {
                  label: "",
                  value: "",
                },
                details: "",
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add House Rule
          </Button>
        </div>
        {errors.houseRules?.root?.message && (
          <span className="text-red-500">{errors.houseRules.root.message}</span>
        )}
      </div>
    );
  }

  function ContactDetails() {
    const {
      register,
      formState: { errors },
    } = methods;

    return (
      <div className="p-6 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Label htmlFor="contact-person-name">Contact Person Name</Label>
              <Input
                id="contact-person-name"
                {...register("contactForm.name")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.name?.message && (
                <span className="text-red-500">
                  {errors.contactForm.name.message}
                </span>
              )}
              <Label htmlFor="role-position">Role / Position</Label>
              <Input
                id="role-position"
                {...register("contactForm.position")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.position?.message && (
                <span className="text-red-500">
                  {errors.contactForm.position.message}
                </span>
              )}
              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                {...register("contactForm.email")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.email?.message && (
                <span className="text-red-500">
                  {errors.contactForm.email.message}
                </span>
              )}
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                {...register("contactForm.number")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.number?.message && (
                <span className="text-red-500">
                  {errors.contactForm.number.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Lipsum dolor sit amet, consectetur adipiscing elit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                {...register("contactForm.facebook")}
                placeholder="www.facebook.com"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.facebook?.message && (
                <span className="text-red-500">
                  {errors.contactForm.facebook.message}
                </span>
              )}
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                {...register("contactForm.instagram")}
                placeholder="www.instagram.com"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.instagram?.message && (
                <span className="text-red-500">
                  {errors.contactForm.instagram.message}
                </span>
              )}
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...register("contactForm.linkedin")}
                placeholder="www.linkedin.com"
                onKeyDown={handleKeyDown}
              />
              {errors.contactForm?.linkedin?.message && (
                <span className="text-red-500">
                  {errors.contactForm.linkedin.message}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function View() {
    const { getValues } = useFormContext<FormData>();
    const [showMore, setShowMore] = useState(false);
    const [showAmenities, setShowAmentities] = useState(false);
    const [visibleFacilitiesCount, setVisibleFacilitiesCount] = useState(4);
    const [isCarouselOpen, setIsCarouselOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const formData = getValues();
    if (!formData.basicInfo) {
      return <div>Loading...</div>;
    }
    const toggleShowMore = () => {
      setShowMore(!showMore);
    };

    const toggleShowAmenities = () => {
      if (showAmenities) {
        setVisibleFacilitiesCount(4); // Show only the first 4 facilities
      } else {
        setVisibleFacilitiesCount(formData.facilities.length); // Show all facilities
      }
      setShowAmentities(!showAmenities);
    };

    const handleImageClick = (index) => {
      setCurrentIndex(index);
      setIsCarouselOpen(true);
    };

    const handleCloseCarousel = () => {
      setIsCarouselOpen(false);
    };
    const handlePrevClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? formData.imageLinks.length : prevIndex - 1
      );
    };

    const handleNextClick = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === formData.imageLinks.length ? 0 : prevIndex + 1
      );
    };

    return (
      <div className="flex flex-col gap-8">
        <Card className="overflow-hidden px-5">
          <div className="text-[#020617] my-7 space-y-10 tracking-tight">
            <div className="space-y-5">
              <div className="space-y-3">
                <p
                  className="text-3xl  font-semibold
            "
                >
                  {formData.basicInfo.name}
                </p>
                <p className="">{formData.basicInfo.location.label}</p>
              </div>
              <div className="  flex h-[550px] gap-2  ">
                <div className="w-1/2 relative overflow-hidden rounded-l-xl">
                  <img
                    // src={formData.primaryImageLink}
                    src={staticimg}
                    alt="PrimaryImage"
                    className="h-full transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                    onClick={() => handleImageClick(0)}
                  />
                </div>
                <div className="grid grid-cols-2 w-1/2 gap-2">
                  {formData.imageLinks.slice(0, 4).map((image, index) => (
                    <div
                      className={`relative overflow-hidden ${
                        index === 1
                          ? "rounded-tr-xl"
                          : index === 3
                          ? "rounded-br-xl"
                          : ""
                      }`}
                      onClick={() => handleImageClick(index + 1)}
                      key={index}
                    >
                      <Image
                        // src={image}
                        src={staticimg}
                        alt={`smallImage-${index}`}
                        className="h-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105 hover:brightness-75"
                      />
                    </div>
                  ))}
                </div>

                <Dialog open={isCarouselOpen} onOpenChange={setIsCarouselOpen}>
                  <DialogOverlay className="bg-black bg-opacity-50" />
                  <DialogContent className="flex items-center justify-center p-1 min-w-fit max-h-fit bg-transparent border-none">
                    <div className=" w-full">
                      <div className="flex overflow-hidden">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                          }}
                        >
                          <div className="flex-shrink-0 w-full">
                            <Image
                              src={staticimg3}
                              // src={hotel.primaryImageLink}
                              alt="PrimaryImage"
                              className=""
                              layout="fill"
                              // objectFit="cover"
                            />
                          </div>
                          {formData.imageLinks.map((image, index) => (
                            <div className="flex-shrink-0 w-full " key={index}>
                              <Image
                                src={staticimg}
                                alt={`carouselImage-${index}`}
                                className="w-full"
                                objectFit="cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        className="absolute top-1/2 -right-4 text-white bg-black bg-opacity-75 rounded-full"
                        onClick={handleNextClick}
                      >
                        &gt;
                      </Button>
                      <Button
                        className="absolute top-1/2 -left-4 text-white bg-black bg-opacity-75 rounded-full"
                        onClick={handlePrevClick}
                      >
                        &lt;
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-2xl font-semibold">Basic Overview</p>
                <p className="pb-5">{formData.basicInfo.location.label}</p>
                <p className="leading-7 border-t-2 pt-7">
                  {formData.basicInfo.description.length > 350 ? (
                    <div className="space-y-5">
                      <p className="">
                        {showMore
                          ? formData.basicInfo.description
                          : formData.basicInfo.description.substring(0, 350) +
                            "..."}
                      </p>
                      <div
                        className="text-blue-600 text-sm font-medium cursor-pointer"
                        onClick={toggleShowMore}
                      >
                        <u>{!showMore ? "Show More" : "Show Less"}</u>
                      </div>
                    </div>
                  ) : (
                    formData.basicInfo.description
                  )}
                </p>
              </div>
              <div className=" border-b-2 pt-1 "></div>
              <div className="space-y-7">
                <p className="text-2xl font-semibold pt-1">Top Facilities</p>
                <div className="grid gap-5 grid-cols-3">
                  {formData.facilities.map((facility, index) => {
                    // console.log(facility);
                    const facilityIcon = facilitiesIcon.facilitiesIcon.find(
                      (icon) => {
                        // console.log(icon);
                        return icon.name === facility.name.label;
                      }
                    );

                    const IconComponent = (Icons as any)[
                      `${facilityIcon?.icon}`
                    ];

                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="">
                          {IconComponent && <IconComponent className="" />}
                        </div>

                        <p className="">{facility.name.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="">
                <div className=" border-b-2  pt-2"></div>
                <div className="space-y-7">
                  <p className="text-2xl font-semibold mt-7">Rooms</p>
                  {formData.rooms.map((value, index) => {
                    //   console.log(value, "asasas");
                    return (
                      <Card
                        key={index}
                        className="p-5 space-y-2 hover:bg-[#EFF6FF] hover:border-[#2563EB] "
                      >
                        <CardTitle className="text-xl">{value.type}</CardTitle>
                        <div className="flex justify-between ">
                          <div className="space-y-2 pr-5  ">
                            <div className="flex   font-medium space-x-40 ">
                              <div className="flex  ">
                                <Image src={bed} alt="bed" />
                                <p className="pl-4 pr-1">
                                  {value.numberOfBeds}
                                </p>
                                <p className="">{value.bedType}</p>
                              </div>
                              <div className="flex space-x-4">
                                <Image src={guest} alt="guest" />
                                <p className=""> {value.capacity}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap ">
                              {value.amenities
                                .slice(0, 12)
                                .map((amenity, amenityIndex) => (
                                  <span
                                    className="text-sm text-[#64748B] flex items-center gap-x-1"
                                    key={amenityIndex}
                                  >
                                    <p className="whitespace-nowrap">
                                      {amenity.name}
                                    </p>
                                    <Dot />
                                  </span>
                                ))}
                            </div>
                            <div className="text-[#64748B]">
                              {value.amenities.length > 12 && (
                                <p>{value.amenities.length - 12}+ Amenities</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-end space-y-2">
                            <p className="text-[#64748B] text-sm">
                              Includes taxes and fees{" "}
                            </p>
                            <p className="flex justify-end text-xl font-semibold">
                              Rs.{value.price}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <div className=" border-b-2 my-7  "></div>
              </div>
              <div className="space-y-7">
                <p className="text-2xl font-semibold">Explore All Facilities</p>
                <div className="grid grid-cols-3 space-y-2">
                  {formData.facilities
                    .slice(0, visibleFacilitiesCount)
                    .map((value, index) => {
                      const facilityIcon = facilitiesIcon.facilitiesIcon.find(
                        (icon) => {
                          // console.log(icon);
                          return icon.name === value.name.label;
                        }
                      );

                      const IconComponent = (Icons as any)[
                        `${facilityIcon?.icon}`
                      ];
                      return (
                        <div className="" key={index}>
                          <div className="flex items-center space-x-4 ">
                            {IconComponent && <IconComponent className="" />}

                            <p className="">{value.name.label}</p>
                          </div>
                          <div className="">
                            {value.subFacilities.map((subValue, subIndex) => {
                              return (
                                <span
                                  className="text-sm text-[#64748B]    flex  items-end ml-10"
                                  key={subIndex}
                                >
                                  <Dot className="" />
                                  <p className="">{subValue.name}</p>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
                {formData.facilities.length > 4 && (
                  <Button
                    variant={"outline"}
                    onClick={toggleShowAmenities}
                    type="button"
                  >
                    {!showAmenities
                      ? `Show all ${formData.facilities.length} amenities`
                      : "Show Less"}
                  </Button>
                )}

                <div className=" border-b-2 mt-7"></div>
                <div className="space-y-7">
                  <p className="text-2xl font-semibold">House Rules</p>
                  <div className="">
                    {formData.houseRules.map((value, index) => {
                      return (
                        <div key={index}>
                          <div className="flex w-full">
                            <p className="w-1/4">{value.type.value}</p>
                            <p className="w-3/4">{value.details}</p>
                          </div>
                          {index !== formData.houseRules.length - 1 && (
                            <div className="border-t-2 my-5"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
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

    const toggleSection = (
      section:
        | "basicInformation"
        | "facilities"
        | "room"
        | "houseRules"
        | "contactDetails"
    ) => {
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
                  Lipsum dolor sit amet, consectetur adipiscing elit
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
                  <Title>Location</Title>
                  <Value>{formData.basicInfo.location.label}</Value>
                </div>
                <div className="flex justify-between items-center border-b">
                  <Title>Discount Offer</Title>
                  <Value>{formData.basicInfo.discount}</Value>
                </div>
                <div className="flex flex-col gap-3">
                  <Title>Description</Title>
                  <Value>{formData.basicInfo.description}</Value>
                </div>
                <div className="flex flex-col gap-3">
                  <Title>Hotel Images</Title>
                  <div className="grid grid-cols-5 gap-2 overflow-x-scroll">
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                    <Image
                      alt="Product image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src="/images/image-placeholder.png"
                      width={100}
                    />
                  </div>
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
                  collapsedSections.facilities ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("facilities")}
              />

              <CardTitle className="text-2xl font-semibold">
                Facilities
                <div className="text-sm font-normal text-slate-400">
                  Lipsum dolor sit amet, consectetur adipiscing elit
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
          {!collapsedSections.facilities && (
            <CardContent className="px-6 flex flex-col gap-6 border-b">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Label className="font-semibold text-lg">
                    Facility {index + 1}
                  </Label>
                  <div className="flex items-center justify-between">
                    <Title>Name</Title>
                    <Value className="font-medium">{facility.name.value}</Value>
                  </div>
                  <div>
                    <Title>Description </Title>
                    <Value>{facility.description}</Value>
                  </div>

                  <div>
                    <Title>Sub Facilities</Title>
                    <ul className="list-disc pl-5">
                      {facility.subFacilities.map((subFacility, subIndex) => (
                        <li key={subIndex}>{subFacility.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex justify-center gap-1.5">
              <ChevronDown
                className={`mt-0.5 ${
                  collapsedSections.room ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("room")}
              />

              <CardTitle className="text-2xl font-semibold">
                Rooms
                <div className="text-sm font-normal text-slate-400">
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </div>
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(2)}
            >
              Edit
            </Button>
          </CardHeader>
          {!collapsedSections.room && (
            <CardContent className="flex flex-col gap-4">
              {formData.rooms.map((room, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <Label className="text-lg font-semibold">
                    Room {index + 1}
                  </Label>
                  <div className="flex items-center justify-between">
                    <Title>Type</Title>
                    <Value>{room.type}</Value>
                  </div>
                  <div className="flex items-center justify-between">
                    <Title>Number of Rooms</Title>
                    <Value>{room.numberOfRooms}</Value>
                  </div>

                  <div className="flex items-center justify-between">
                    <Title>Price</Title>
                    <Value> {room.price}</Value>
                  </div>

                  <div className="flex items-center justify-between">
                    <Title>Capacity</Title>
                    <Value> {room.capacity}</Value>
                  </div>

                  <div className="flex items-center justify-between">
                    <Title>Bed Type</Title>
                    <Value> {room.bedType}</Value>
                  </div>

                  <div className="flex items-center justify-between">
                    <Title>Number of Beds</Title>
                    <Value> {room.numberOfBeds}</Value>
                  </div>
                  <div>
                    <Title className="text-base font-semibold">Amenities</Title>
                    <ul className="list-disc pl-5">
                      {room.amenities.map((amenity, amenityIndex) => (
                        <li key={amenityIndex}>{amenity.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex justify-center gap-1.5">
              <ChevronDown
                className={`mt-0.5 ${
                  collapsedSections.houseRules ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("houseRules")}
              />

              <CardTitle className="text-2xl font-semibold">
                House Rules
                <div className="text-sm font-normal text-slate-400">
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </div>
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(3)}
            >
              Edit
            </Button>
          </CardHeader>

          {!collapsedSections.houseRules && (
            <CardContent className="px-6 flex flex-col gap-6">
              {formData.houseRules.map((houseRule, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <Label className="text-lg font-semibold">
                    House Rule {index + 1}
                  </Label>
                  <div className="flex items-center justify-between">
                    <Title>Type</Title> <Value>{houseRule.type.value}</Value>
                  </div>
                  <div className="flex flex-col">
                    <Title>Details</Title> <Value> {houseRule.details}</Value>
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex justify-center gap-1.5">
              <ChevronDown
                className={`mt-0.5 ${
                  collapsedSections.contactDetails ? "" : "rotate-180"
                }`}
                onClick={() => toggleSection("contactDetails")}
              />

              <CardTitle className="text-2xl font-semibold">
                Contact Details
                <div className="text-sm font-normal text-slate-400">
                  Lipsum dolor sit amet, consectetur adipiscing elit
                </div>
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(4)}
            >
              Edit
            </Button>
          </CardHeader>
          {!collapsedSections.contactDetails && (
            <CardContent className="px-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Title className="font-semibold">Contact Person Name:</Title>
                  <Value>{formData.contactForm.name}</Value>
                </div>
                <div className="flex items-center justify-between">
                  <Title className=" font-semibold">Role / Position</Title>
                  <Value>{formData.contactForm.position}</Value>
                </div>
                <div className="flex items-center justify-between">
                  <Title className=" font-semibold">Email Address</Title>

                  <Value>{formData.contactForm.email}</Value>
                </div>

                <div className="flex items-center justify-between">
                  <Title className=" font-semibold">Phone Number</Title>
                  <Value>{formData.contactForm.number}</Value>
                </div>

                <Label className="text-base font-semibold">Social Links</Label>
                <div className="flex justify-between items-center">
                  <Title>Facebook</Title>{" "}
                  <Value>{formData.contactForm.facebook}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>Instagram</Title>{" "}
                  <Value>{formData.contactForm.instagram}</Value>
                </div>
                <div className="flex justify-between items-center">
                  <Title>LinkedIn</Title>{" "}
                  <Value>{formData.contactForm.linkedin}</Value>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="flex items-center gap-2">
          <Controller
            name="isRunning"
            control={methods.control}
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label>Is the hotel operating?</Label>
        </div>
        <div className="text-sm text-muted-foreground">
          Please note to tick this box if the hotel is actively operating and
          currently open for guests.
        </div>
      </div>
    );
  }
  if (!hotel) return <>Loading...</>;
  return (
    <AdminLayout>
      <FormProvider {...methods}>
        <div className="border-2 rounded-md bg-white flex flex-col gap">
          <div className="p-6 grid w-full max-w-6xl gap-2">
            <h1 className="text-2xl font-semibold">Update Hotel</h1>
            <div>Manage your hotel and view their overall details.</div>
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
                      <Link href="/dashboard/hotels">Discard</Link>
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
};

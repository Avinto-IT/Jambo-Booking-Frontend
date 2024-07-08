"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/Layout/AdminLayout";
import {
  CircleUser,
  Menu,
  Package2,
  PlusCircle,
  Trash,
  Upload,
} from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface HouseRule {
  id: number;
  type: string;
  details: string;
}

interface Facility {
  id: number;
  name: string;
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
    name: string;
    location: { value: string; label: string };
    discount: string;
    description: string;
  };
  facilities: Facility[];
  rooms: Room[];
  contactForm: ContactDetails;
  houseRules: HouseRule[];
}

export default function AddHotel() {
  const steps = [
    { component: BasicInformation, label: "Basic Information" },
    { component: Facilities, label: "Facilities" },
    { component: AddRoom, label: "Room" },
    { component: HouseRules, label: "House Rules" },
    { component: ContactDetails, label: "Contact Details" },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const CurrentComponent = steps[currentStep].component;
  const { register, handleSubmit, control, setValue, getValues } =
    useForm<FormData>({
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
            name: "",
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
            type: "",
            details: "",
          },
        ],
      },
    });

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({
    control,
    name: "facilities",
  });

  const {
    fields: roomFields,
    append: appendRoom,
    remove: removeRoom,
  } = useFieldArray({
    control,
    name: "rooms",
  });

  const {
    fields: houseRuleFields,
    append: appendHouseRule,
    remove: removeHouseRule,
  } = useFieldArray({
    control,
    name: "houseRules",
  });

  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data.basicInfo,
      address: data.basicInfo.location.label,
      locationID: data.basicInfo.location.value,
      facilities: data.facilities.map((facility) => ({
        name: facility.name,
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
        type: houseRule.type,
        details: houseRule.details,
      })),
      isRunning: true,
      discount: parseFloat(data.basicInfo.discount),
    };

    try {
      const response = await fetch("/api/setHotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Hotel added successfully!");
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error: Unable to add hotel.");
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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
    const [locations, setLocations] = useState<Location[]>([]);

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
    }, []);

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
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="location">Location</Label>
                <Controller
                  name="basicInfo.location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={locations.map((location) => ({
                        value: location.locationID,
                        label: `${location.city}, ${location.country}`,
                      }))}
                      placeholder="Select Location"
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="discount">Discount Offer</Label>
                <Controller
                  name="basicInfo.discount"
                  control={control}
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
      const facilities = getValues("facilities");
      facilities[facilityIndex].subFacilities.push(newSubFacility);
      setValue("facilities", facilities);
    };

    const removeSubFacility = (
      facilityIndex: number,
      subFacilityIndex: number
    ) => {
      const facilities = getValues("facilities");
      facilities[facilityIndex].subFacilities.splice(subFacilityIndex, 1);
      setValue("facilities", facilities);
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
                  control={control}
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
                                control={control}
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
                                onClick={() =>
                                  removeSubFacility(facilityIndex, subIndex)
                                }
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
                name: "",
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
      </div>
    );
  }

  function AddRoom() {
    const addAmenity = (roomIndex: number) => {
      const newAmenity = { id: Date.now(), name: "" };
      const rooms = getValues("rooms");
      rooms[roomIndex].amenities.push(newAmenity);
      setValue("rooms", rooms);
    };

    const removeAmenity = (roomIndex: number, amenityIndex: number) => {
      const rooms = getValues("rooms");
      rooms[roomIndex].amenities.splice(amenityIndex, 1);
      setValue("rooms", rooms);
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
                <Label htmlFor={`number-of-rooms-${room.id}`}>
                  Number of Rooms
                </Label>
                <Input
                  id={`number-of-rooms-${room.id}`}
                  {...register(`rooms.${roomIndex}.numberOfRooms`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`price-${room.id}`}>Price</Label>
                <Input
                  id={`price-${room.id}`}
                  {...register(`rooms.${roomIndex}.price`)}
                  placeholder="Lorem Ipsum"
                  required
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`capacity-${room.id}`}>Capacity</Label>
                <Input
                  id={`capacity-${room.id}`}
                  {...register(`rooms.${roomIndex}.capacity`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`bed-type-${room.id}`}>Bed Type</Label>
                <Input
                  id={`bed-type-${room.id}`}
                  {...register(`rooms.${roomIndex}.bedType`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`number-of-beds-${room.id}`}>
                  Number of Beds
                </Label>
                <Input
                  id={`number-of-beds-${room.id}`}
                  {...register(`rooms.${roomIndex}.numberOfBeds`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
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
                              control={control}
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
                              onClick={() =>
                                removeAmenity(roomIndex, amenityIndex)
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

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
      </div>
    );
  }

  function HouseRules() {
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
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={houseRuleOptions}
                      placeholder="Select house rule"
                    />
                  )}
                />
                <Label htmlFor={`house-rule-details-${houseRule.id}`}>
                  Details
                </Label>
                <Input
                  id={`house-rule-details-${houseRule.id}`}
                  {...register(`houseRules.${index}.details`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
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
                type: "",
                details: "",
              })
            }
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add House Rule
          </Button>
        </div>
      </div>
    );
  }

  function ContactDetails() {
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

              <Label htmlFor="role-position">Role / Position</Label>
              <Input
                id="role-position"
                {...register("contactForm.position")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                {...register("contactForm.email")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                {...register("contactForm.number")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />
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

              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                {...register("contactForm.instagram")}
                placeholder="www.instagram.com"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...register("contactForm.linkedin")}
                placeholder="www.linkedin.com"
                onKeyDown={handleKeyDown}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="border-2 rounded-md bg-white flex flex-col gap">
        <div className="p-6 grid w-full max-w-6xl gap-2">
          <h1 className="text-2xl font-semibold">Add Hotel</h1>
          <div>Manage your hotel and view their overall details.</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    className="bg-blue-700"
                    type="button"
                    onClick={(e) => {
                      handleNext();
                      e.preventDefault();
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button className="bg-blue-700" type="submit">
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

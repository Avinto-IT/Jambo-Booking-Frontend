"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  Controller,
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
}

export default function AdminUpdateHotel() {
  const steps = [
    { component: BasicInformation, label: "Basic Information" },
    { component: Facilities, label: "Facilities" },
    { component: AddRoom, label: "Room" },
    { component: HouseRules, label: "House Rules" },
    { component: ContactDetails, label: "Contact Details" },
    { component: Review, label: "Review" },
  ];
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const [hotel, setHotel] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const CurrentComponent = steps[currentStep].component;
  const [token, setToken] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const router = useRouter();
  const methods = useForm<FormData>({
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
              facilities: data.hotel.facilities.map((facility, index) => ({
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
              })),
              rooms: data.hotel.rooms.map((room, index) => ({
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
              houseRules: data.hotel.houseRules.map((houseRule, index) => ({
                id: index,
                type: {
                  label: houseRule.type,
                  value: houseRule.type,
                },
                details: houseRule.details,
              })),
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

  if (!hotel) return <>Loading...</>;

  function BasicInformation() {
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
                  {...methods.register("basicInfo.name")}
                  onKeyDown={handleKeyDown}
                />
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
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  className="w-full"
                  {...methods.register("basicInfo.description")}
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
                <Label htmlFor={`facility-description-${facility.id}`}>
                  Short Description
                </Label>
                <Input
                  id={`facility-description-${facility.id}`}
                  type="text"
                  {...methods.register(
                    `facilities.${facilityIndex}.description`
                  )}
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
      </div>
    );
  }

  function AddRoom() {
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
                  {...methods.register(`rooms.${roomIndex}.type`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`number-of-rooms-${room.id}`}>
                  Number of Rooms
                </Label>
                <Input
                  id={`number-of-rooms-${room.id}`}
                  {...methods.register(`rooms.${roomIndex}.numberOfRooms`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`price-${room.id}`}>Price</Label>
                <Input
                  id={`price-${room.id}`}
                  {...methods.register(`rooms.${roomIndex}.price`)}
                  placeholder="Lorem Ipsum"
                  required
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`capacity-${room.id}`}>Capacity</Label>
                <Input
                  id={`capacity-${room.id}`}
                  {...methods.register(`rooms.${roomIndex}.capacity`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`bed-type-${room.id}`}>Bed Type</Label>
                <Input
                  id={`bed-type-${room.id}`}
                  {...methods.register(`rooms.${roomIndex}.bedType`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                <Label htmlFor={`number-of-beds-${room.id}`}>
                  Number of Beds
                </Label>
                <Input
                  id={`number-of-beds-${room.id}`}
                  {...methods.register(`rooms.${roomIndex}.numberOfBeds`)}
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
                  control={methods.control}
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
                  {...methods.register(`houseRules.${index}.details`)}
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
                {...methods.register("contactForm.name")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="role-position">Role / Position</Label>
              <Input
                id="role-position"
                {...methods.register("contactForm.position")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                {...methods.register("contactForm.email")}
                placeholder="Lorem Ipsum"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                {...methods.register("contactForm.number")}
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
                {...methods.register("contactForm.facebook")}
                placeholder="www.facebook.com"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                {...methods.register("contactForm.instagram")}
                placeholder="www.instagram.com"
                onKeyDown={handleKeyDown}
              />

              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...methods.register("contactForm.linkedin")}
                placeholder="www.linkedin.com"
                onKeyDown={handleKeyDown}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function Review() {
    const { getValues } = useFormContext<FormData>();

    const formData = getValues();
    // console.log(formData);
    if (!formData.basicInfo) {
      return <div>Loading...</div>;
    }
    const [collapsedSections, setCollapsedSections] = useState({
      basicInformation: false,
      facilities: true,
      room: true,
      houseRules: true,
      contactDetails: true,
    });
    const toggleSection = (section: string) => {
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
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <Label>Name</Label>
                  <p>{formData.basicInfo.name}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Location</Label>
                  <p>{formData.basicInfo.location.label}</p>
                </div>
                <div className="flex flex-col gap-3 border-b">
                  <Label>Discount Offer</Label>
                  <p>{formData.basicInfo.discount}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Description</Label>
                  <p>{formData.basicInfo.description}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Label>Hotel Images</Label>
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
            <CardContent className="p-6">
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <Label>Facility {index + 1}</Label>
                  <p>{facility.name.value}</p>
                  <p>{facility.description}</p>
                  <Label>Sub Facilities</Label>
                  <ul className="list-disc pl-5">
                    {facility.subFacilities.map((subFacility, subIndex) => (
                      <li key={subIndex}>{subFacility.name}</li>
                    ))}
                  </ul>
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
                <div key={index} className="flex flex-col gap-1">
                  <Label className="text-lg font-semibold">
                    Room {index + 1}
                  </Label>
                  <p>Type: {room.type}</p>
                  <p>Number of Rooms: {room.numberOfRooms}</p>
                  <p>Price: {room.price}</p>
                  <p>Capacity: {room.capacity}</p>
                  <p>Bed Type: {room.bedType}</p>
                  <p>Number of Beds: {room.numberOfBeds}</p>
                  <Label className="text-base font-semibold">Amenities</Label>
                  <ul className="list-disc pl-5">
                    {room.amenities.map((amenity, amenityIndex) => (
                      <li key={amenityIndex}>{amenity.name}</li>
                    ))}
                  </ul>
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
            <CardContent className="p-6 flex flex-col gap-6">
              {formData.houseRules.map((houseRule, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <Label className="text-lg font-semibold">
                    House Rule {index + 1}
                  </Label>
                  <p>Type: {houseRule.type.value}</p>
                  <p>Details: {houseRule.details}</p>
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
          {collapsedSections.contactDetails && (
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-x-2">
                  <Label className="font-semibold">Contact Person Name:</Label>
                  <p>{formData.contactForm.name}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <Label className=" font-semibold">Role / Position</Label>
                  <p>{formData.contactForm.position}</p>
                </div>
                <div className="flex items-center gap-x-2">
                  <Label className=" font-semibold">Email Address</Label>

                  <p>{formData.contactForm.email}</p>
                </div>

                <div className="flex items-center gap-x-2">
                  <Label className=" font-semibold">Phone Number</Label>
                  <p>{formData.contactForm.number}</p>
                </div>

                <Label className="text-base font-semibold">Social Links</Label>
                <p>Facebook: {formData.contactForm.facebook}</p>
                <p>Instagram: {formData.contactForm.instagram}</p>
                <p>LinkedIn: {formData.contactForm.linkedin}</p>
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

  return (
    <AdminLayout>
      <FormProvider {...methods}>
        <div className="border-2 rounded-md bg-white flex flex-col gap">
          <div className="p-6 grid w-full max-w-6xl gap-2">
            <h1 className="text-2xl font-semibold">Update Hotel</h1>
            <div>Update the hotel and view their overall details.</div>
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
                      Update
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

"use client";
import Link from "next/link";
import { useState, useEffect, Key, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { number, z } from "zod";
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
import {
  ChevronDown,
  ImagePlus,
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
import Select, { components, MenuListProps } from "react-select";
import { HouseRuleInterface, Location } from "@/utils/types";
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
import DialogBox from "@/components/AdminComponents/ImagePopup";
import { uploadFiles } from "@/components/AdminComponents/functions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  beds: {
    bedType: {
      label: string;
      value: string;
    };
    numberOfBeds: string;
  }[];

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
  primaryImage: File | null;
  imageLinks: File[];
}
interface AmenityError {
  name?: {
    message?: string;
  };
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
  beds: z
    .array(
      z.object({
        bedType: z.object({
          label: z.string().min(1, "Bed Type is required"),
          value: z.string().min(1, "Bed Type is required"),
        }),
        numberOfBeds: z.string().min(1, "Number of beds is required"),
      })
    )
    .min(1, "At least one bed configuration is required"),
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
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [previewPrimaryImage, setPreviewPrimaryImage] = useState<string | null>(
    null
  );
  const [previewImageLinks, setPreviewImageLinks] = useState<string[]>([]);

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
          beds: [
            {
              bedType: {
                value: "",
                label: "",
              },
              numberOfBeds: "",
            },
          ],
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
      primaryImage: null,
      imageLinks: [],
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
          setPreviewPrimaryImage(data.hotel.primaryImageLink);
          setPreviewImageLinks(data.hotel.imageLinks);
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
                beds: room.beds.map((bed, bedIndex) => ({
                  bedType: {
                    value: bed.bedType.value,
                    label: bed.bedType.label,
                  },
                  numberOfBeds: bed.numberOfBeds,
                })),
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
              primaryImage: data.hotel.primaryImageLink,
              imageLinks: data.hotel.imageLinks.map((link: File) => link),
            });
          }
        } catch (error) {
          console.log("Error fetching hotel:", error);
        }
      };
      fetchHotel();
    }
  }, [id, reset]);
  const [houseRules, setHouseRules] = useState<HouseRuleInterface[]>([]);

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
  useEffect(() => {
    const fetchHouseRules = async () => {
      try {
        const response = await fetch("/api/getHouseRules");
        const data: HouseRuleInterface[] = await response.json();
        setHouseRules(data);
      } catch (error) {
        console.error("Error fetching house rules:", error);
      }
    };
    fetchHouseRules();
  }, []);
  const locationOptions = locations.map((location) => ({
    value: location.locationID,
    label: `${location.address}, ${location.city}, ${location.country}, ${location.zipCode}`,
  }));
  const houseRulesOptions = houseRules.map((rule) => ({
    value: rule.houseRule,
    label: rule.houseRule,
  }));
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

  const handlePrimaryImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    methods.setValue("primaryImage", file);

    if (file) {
      setPreviewPrimaryImage(URL.createObjectURL(file));
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const currentFiles = methods.getValues("imageLinks");

      const allFiles = [...currentFiles, ...newFiles];
      methods.setValue("imageLinks", allFiles);

      setPreviewImageLinks((prevLinks) => [
        ...prevLinks,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };
  const onSubmit = async (data: FormData) => {
    setIsSubmitClicked(true);
    let imageLinks = [];
    if (data.imageLinks || data.primaryImage) {
      imageLinks = await uploadFiles(data.imageLinks, data.primaryImage);
    }
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
      primaryImageLink: data.primaryImage ? imageLinks[0] : "",
      imageLinks: imageLinks.slice(data.primaryImage ? 1 : 0),
      rooms: data.rooms.map((room) => ({
        type: room.type,
        numberOfRooms: room.numberOfRooms,
        price: room.price,
        capacity: room.capacity,
        beds: room.beds.map((bed) => ({
          bedType: bed.bedType.value,
          numberOfBeds: bed.numberOfBeds,
        })),
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
      setIsSubmitClicked(false);

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
      setValue,

      formState: { errors },
    } = methods;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [newLocation, setNewLocation] = useState({
      newAddress: "",
      newCity: "",
      newCountry: "",
      newZipCode: "",
    });
    const [locationErrors, setLocationErrors] = useState({
      newAddress: null as string | null,
      newCity: null as string | null,
      newCountry: null as string | null,
      newZipCode: null as string | null,
    });
    const validateLocation = () => {
      let valid = true;
      let errors: {
        newAddress: string | null;
        newCity: string | null;
        newCountry: string | null;
        newZipCode: string | null;
      } = {
        newAddress: null,
        newCity: null,
        newCountry: null,
        newZipCode: null,
      };

      if (!newLocation.newAddress) {
        valid = false;
        errors.newAddress = "Address is required";
      }
      if (!newLocation.newCity) {
        valid = false;
        errors.newCity = "City is required";
      }
      if (!newLocation.newCountry) {
        valid = false;
        errors.newCountry = "Country is required";
      }
      if (!newLocation.newZipCode) {
        valid = false;
        errors.newZipCode = "Zip Code is required";
      }

      setLocationErrors(errors);
      return valid;
    };
    const MenuList = (props: MenuListProps<any>) => {
      return (
        <components.MenuList {...props}>
          {props.children}
          <div
            style={{
              borderTop: "1px solid #ccc",
              padding: "8px 12px",
              cursor: "pointer",
              color: "green",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
          >
            Add new location
          </div>
        </components.MenuList>
      );
    };
    const closeDialog = () => {
      setIsDialogOpen(false);
      setNewLocation({
        newAddress: "",
        newCity: "",
        newCountry: "",
        newZipCode: "",
      });
    };
    const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewLocation((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    const handleAddLocation = async () => {
      if (!validateLocation()) {
        return;
      }
      const payload = {
        address: newLocation.newAddress,
        city: newLocation.newCity,
        country: newLocation.newCountry,
        zipCode: newLocation.newZipCode,
      };

      try {
        const response = await fetch("/api/addLocation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
          const newLoc = {
            value: result.location.locationID,
            label: `${result.location.address}, ${result.location.city}, ${result.location.country}, ${result.location.zipCode}`,
          };
          console.log(newLoc);
          setLocations((prevLocations) => [...prevLocations, result.location]);
          setValue("basicInfo.location", newLoc);
          closeDialog();
          toast.success(result.message);
        } else {
          console.error("Error adding location:", result);
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Error adding location:", error);
        toast.error("Error adding location");
      }
    };
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
                    {errors?.basicInfo?.name.message}
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
                      components={{ MenuList }}
                      options={[...locationOptions]}
                      placeholder="Select Location"
                    />
                  )}
                />
                {errors?.basicInfo?.location?.value?.message && (
                  <span className="text-red-500">
                    {errors?.basicInfo?.location?.value.message}
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
              <div className="flex flex-col gap-3 w-full">
                <Label htmlFor="primaryImage" className="text-base">
                  Primary Image
                </Label>
                <label
                  htmlFor="primaryImage"
                  className="flex items-center border shadow max-w-max px-3 py-1.5 rounded gap-2 cursor-pointer"
                >
                  <ImagePlus className="w-4 h-4" />
                  Choose File
                  <input
                    id="primaryImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePrimaryImageChange}
                  />
                </label>
                {previewPrimaryImage ? (
                  <div className="relative max-w-max rounded-md">
                    <DialogBox previewPrimaryImage={previewPrimaryImage}>
                      <Image
                        alt="Primary image"
                        className="w-full rounded-md object-cover max-h-96"
                        style={{ height: "auto", objectFit: "cover" }}
                        height={200}
                        src={previewPrimaryImage}
                        width={400}
                      />
                    </DialogBox>
                    <Trash
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => setPreviewPrimaryImage(null)}
                    />
                  </div>
                ) : (
                  <Image
                    alt="Primary image"
                    className=" w-full rounded-md object-cover max-h-96"
                    style={{ height: "auto", objectFit: "cover" }}
                    height={200}
                    src={"/images/image-placeholder.png"}
                    width={400}
                  />
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
              <div className="flex flex-col gap-3">
                <Label htmlFor="images">Upload Images</Label>
                <label
                  htmlFor="images"
                  className="flex items-center max-w-max border px-3 py-1.5 rounded-md shadow  gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Choose Files
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {previewImageLinks.length > 0 ? (
                  <span>{previewImageLinks.length} files chosen</span>
                ) : (
                  <span>No files chosen</span>
                )}
                <div className="grid grid-cols-3 gap-2">
                  {previewImageLinks.length > 0 ? (
                    previewImageLinks.map((link, index) => (
                      <div key={index} className="relative rounded-md w-full">
                        <DialogBox previewPrimaryImage={link}>
                          <Image
                            alt={`Image ${index + 1}`}
                            className="w-full rounded-md "
                            style={{ height: "200px", objectFit: "cover" }}
                            src={link}
                            width={200}
                            height={100}
                          />
                        </DialogBox>

                        <Trash
                          className="absolute top-1 right-1 text-red-500"
                          onClick={() => {
                            setPreviewImageLinks((prevLinks) =>
                              prevLinks.filter((link, i) => i !== index)
                            );
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <>
                      <Image
                        alt="Placeholder image"
                        className="w-full rounded-md "
                        style={{ height: "200px", objectFit: "cover" }}
                        src={"/images/image-placeholder.png"}
                        width={200}
                        height={100}
                      />
                      <Image
                        alt="Placeholder image"
                        className="w-full rounded-md "
                        style={{ height: "200px", objectFit: "cover" }}
                        src={"/images/image-placeholder.png"}
                        width={200}
                        height={100}
                      />
                      <Image
                        alt="Placeholder image"
                        className="w-full rounded-md "
                        style={{ height: "200px", objectFit: "cover" }}
                        src={"/images/image-placeholder.png"}
                        width={200}
                        height={100}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Label htmlFor="newAddress">Address</Label>
              <Input
                id="newAddress"
                name="newAddress"
                value={newLocation.newAddress}
                onChange={handleLocationInput}
              />
              {locationErrors.newAddress && (
                <span className="text-red-500">
                  {locationErrors.newAddress}
                </span>
              )}
              <Label htmlFor="newCity">City</Label>
              <Input
                id="newCity"
                name="newCity"
                value={newLocation.newCity}
                onChange={handleLocationInput}
              />
              {locationErrors.newCity && (
                <span className="text-red-500">{locationErrors.newCity}</span>
              )}
              <Label htmlFor="newCountry">Country</Label>
              <Input
                id="newCountry"
                name="newCountry"
                value={newLocation.newCountry}
                onChange={handleLocationInput}
              />
              {locationErrors.newCountry && (
                <span className="text-red-500">
                  {locationErrors.newCountry}
                </span>
              )}
              <Label htmlFor="newZipCode">Zip Code</Label>
              <Input
                id="newZipCode"
                name="newZipCode"
                value={newLocation.newZipCode}
                onChange={handleLocationInput}
              />
              {locationErrors.newZipCode && (
                <span className="text-red-500">
                  {locationErrors.newZipCode}
                </span>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleAddLocation} type="button">
                  Add Location
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
    const addBed = (roomIndex: number) => {
      const newBed = {
        bedType: { label: "", value: "" },
        numberOfBeds: "",
      };
      const rooms = methods.getValues("rooms");
      rooms[roomIndex].beds.push(newBed);
      methods.setValue("rooms", rooms);
    };

    const removeBed = (roomIndex: number, bedIndex: number) => {
      const rooms = methods.getValues("rooms");
      rooms[roomIndex].beds.splice(bedIndex, 1);
      methods.setValue("rooms", rooms);
    };
    const bedTypeOptions = [
      "Single",
      "Double",
      "Queen",
      "King",
      "Twin",
      "Twin XL",
      "Full",
      "Full XL",
      "California King",
      "Eastern King",
      "Sofa Bed",
      "Murphy Bed",
      "Trundle Bed",
      "Bunk Bed",
      "Daybed",
      "Canopy Bed",
      "Four Poster Bed",
      "Hammock",
    ];

    console.log(errors);
    console.log(methods.getValues());
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
                  type="number"
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
                  type="number"
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
                <Label htmlFor={`capacity-${room.id}`}>Max Occupants</Label>
                <Input
                  id={`capacity-${room.id}`}
                  type="number"
                  {...register(`rooms.${roomIndex}.capacity`)}
                  placeholder="Lorem Ipsum"
                  onKeyDown={handleKeyDown}
                />
                {errors?.rooms?.[roomIndex]?.capacity?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.capacity?.message}
                  </span>
                )}
                {room?.beds.map((bed, bedIndex) => (
                  <div key={bedIndex} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <Controller
                        name={`rooms.${roomIndex}.beds.${bedIndex}.bedType`}
                        control={methods.control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={bedTypeOptions.map((bed) => ({
                              value: bed,
                              label: bed,
                            }))}
                            placeholder="Select Bed"
                          />
                        )}
                      />
                      {errors?.rooms?.[roomIndex]?.beds?.[bedIndex]?.bedType
                        ?.value?.message && (
                        <span className="text-red-500">
                          {
                            (
                              errors?.rooms?.[roomIndex]?.beds?.[bedIndex]
                                ?.bedType?.value as FieldError
                            )?.message
                          }
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id={`rooms.${roomIndex}.beds.${bedIndex}.numberOfBeds`}
                        {...register(
                          `rooms.${roomIndex}.beds.${bedIndex}.numberOfBeds`
                        )}
                        placeholder="Number of Beds"
                        type="number"
                        onKeyDown={handleKeyDown}
                      />
                      {errors?.rooms?.[roomIndex]?.beds?.[bedIndex]
                        ?.numberOfBeds && (
                        <span className="text-red-500">
                          {
                            (
                              errors?.rooms?.[roomIndex]?.beds?.[bedIndex]
                                ?.numberOfBeds as FieldError
                            )?.message
                          }
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeBed(roomIndex, bedIndex)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => addBed(roomIndex)}
                  className="flex items-center gap-1 border"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Bed
                </Button>
                {errors?.rooms?.[roomIndex]?.beds?.root?.message && (
                  <span className="text-red-500">
                    {errors?.rooms?.[roomIndex]?.beds?.root?.message}
                  </span>
                )}
                <Label>Amenities</Label>
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
                beds: [{ bedType: { label: "", value: "" }, numberOfBeds: "" }],

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
      setValue,
      formState: { errors },
    } = methods;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newHouseRule, setNewHouseRule] = useState({ newRule: "" });
    const [houseRuleErrors, setHouseRuleErrors] = useState({
      newRule: null as string | null,
    });

    const validateHouseRule = () => {
      let valid = true;
      let errors: { newRule: string | null } = { newRule: null };

      if (!newHouseRule.newRule) {
        valid = false;
        errors.newRule = "House Rule is required";
      }

      setHouseRuleErrors(errors);
      return valid;
    };

    const MenuList = (props: MenuListProps<any>) => {
      return (
        <components.MenuList {...props}>
          {props.children}
          <div
            style={{
              borderTop: "1px solid #ccc",
              padding: "8px 12px",
              cursor: "pointer",
              color: "green",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDialogOpen(true);
            }}
          >
            Add new house rule
          </div>
        </components.MenuList>
      );
    };

    const closeDialog = () => {
      setIsDialogOpen(false);
      setNewHouseRule({ newRule: "" });
    };

    const handleHouseRuleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewHouseRule((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddHouseRule = async () => {
      if (!validateHouseRule()) return;

      const payload = { houseRuleName: newHouseRule.newRule };

      try {
        const response = await fetch("/api/addHouseRules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (response.ok) {
          const newRule = {
            value: result.houseRule.houseRuleId,
            label: result.houseRule.houseRule,
          };
          setHouseRules((prevRule) => [
            ...prevRule,
            {
              id: result.houseRule.houseRuleId,
              houseRule: result.houseRule.houseRule,
            },
          ]);
          appendHouseRule({
            id: Date.now(),
            type: newRule,
            details: "",
          });
          closeDialog();
          toast.success(result.message);
        } else {
          console.error("Error adding house rule:", result);
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Error adding house rule:", error);
        toast.error("Error adding house rule");
      }
    };

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
                      options={[...houseRulesOptions]}
                      components={{ MenuList }}
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
                {(errors?.houseRules?.[index]?.details as FieldError)
                  ?.message && (
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
        {errors?.houseRules?.root?.message && (
          <span className="text-red-500">
            {errors?.houseRules?.root.message}
          </span>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New House Rule</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Label htmlFor="newRule">House Rule</Label>
              <Input
                id="newRule"
                name="newRule"
                value={newHouseRule.newRule}
                onChange={handleHouseRuleInput}
              />
              {houseRuleErrors.newRule && (
                <span className="text-red-500">{houseRuleErrors.newRule}</span>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleAddHouseRule} type="button">
                  Add House Rule
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
    const isFile = (file: any): file is File => {
      return file instanceof File;
    };
    const getImageSrc = (file: any) => {
      return isFile(file) ? URL.createObjectURL(file) : file;
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
                General Information
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
                  {formData.primaryImage && (
                    <Image
                      alt="Primary image"
                      className="w-full rounded-md object-cover"
                      height={100}
                      src={getImageSrc(formData.primaryImage)}
                      width={100}
                    />
                  )}
                  <div className="grid grid-cols-5 gap-2 overflow-x-scroll">
                    {formData.imageLinks?.map((file, index) => (
                      <Image
                        key={index}
                        alt={`Image ${index + 1}`}
                        className="w-full rounded-md object-cover"
                        height={100}
                        src={getImageSrc(file)}
                        width={100}
                      />
                    ))}
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
                    <Title>Max Occupants</Title>
                    <Value> {room.capacity}</Value>
                  </div>

                  <div>
                    <Title className="text-base font-semibold">Beds</Title>
                    {room.beds.map((bed, bedIndex) => (
                      <div
                        key={bedIndex}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <Title>Bed Type</Title>
                          <Value> {bed.bedType.value}</Value>
                        </div>
                        <div className="flex items-center justify-between">
                          <Title>Number of Beds</Title>
                          <Value> {bed.numberOfBeds}</Value>
                        </div>
                      </div>
                    ))}
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
};

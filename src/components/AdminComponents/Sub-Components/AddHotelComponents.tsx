import Link from "next/link";
import {
  CircleUser,
  Menu,
  Package2,
  PlusCircle,
  Search,
  Trash,
  Upload,
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AdminLayout from "@/components/Layout/AdminLayout";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Location } from "@/utils/types";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function BasicInformation() {
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
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                // defaultValue="Hotel"
                placeholder="Hotel's Name"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Location</Label>
              <Select
                options={locations.map((location) => ({
                  value: location.locationID,
                  label: `${location.city}, ${location.country}`,
                }))}
                // onChange={handleLocationChange}
                placeholder="Select Location"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Discount Offer</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                // defaultValue="Hotel"
                placeholder="Discount Offer"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="name">Description</Label>
              <Textarea
                id="name"
                className="w-full"
                // defaultValue="Hotel"
                placeholder="Description"
              />
            </div>
          </form>
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

export function Facilities() {
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

  const [facilities, setFacilities] = useState<Facility[]>([
    { id: 1, name: "", description: "", subFacilities: [{ id: 1, name: "" }] },
  ]);

  const addSubFacility = (facilityId: number) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              subFacilities: [
                ...facility.subFacilities,
                { id: facility.subFacilities.length + 1, name: "" },
              ],
            }
          : facility
      )
    );
  };

  const removeSubFacility = (facilityId: number, subFacilityId: number) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              subFacilities: facility.subFacilities.filter(
                (subFacility) => subFacility.id !== subFacilityId
              ),
            }
          : facility
      )
    );
  };

  const removeFacility = (facilityId: number) => {
    setFacilities((prevFacilities) =>
      prevFacilities.filter((facility) => facility.id !== facilityId)
    );
  };

  const addFacility = () => {
    setFacilities((prevFacilities) => [
      ...prevFacilities,
      {
        id: prevFacilities.length + 1,
        name: "",
        description: "",
        subFacilities: [{ id: 1, name: "" }],
      },
    ]);
  };

  const handleInputChange = (
    facilityId: number,
    field: "name" | "description",
    value: string
  ) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) =>
        facility.id === facilityId ? { ...facility, [field]: value } : facility
      )
    );
  };

  const handleSubFacilityChange = (
    facilityId: number,
    subFacilityId: number,
    value: string
  ) => {
    setFacilities((prevFacilities) =>
      prevFacilities.map((facility) =>
        facility.id === facilityId
          ? {
              ...facility,
              subFacilities: facility.subFacilities.map((subFacility) =>
                subFacility.id === subFacilityId
                  ? { ...subFacility, name: value }
                  : subFacility
              ),
            }
          : facility
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {facilities.map((facility) => (
        <Card key={facility.id} className="overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row justify-between ">
            <div>
              <CardTitle>Facility {facility.id}</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => removeFacility(facility.id)}
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
              <Select
                id={`facility-name-${facility.id}`}
                options={facilitiesList.map((facility) => ({
                  value: facility,
                  label: facility,
                }))}
                onChange={(selectedOption) =>
                  handleInputChange(
                    facility.id,
                    "name",
                    selectedOption?.value || ""
                  )
                }
                placeholder="Select facility"
              />
              <Label htmlFor={`facility-description-${facility.id}`}>
                Short Description
              </Label>
              <Input
                id={`facility-description-${facility.id}`}
                type="text"
                value={facility.description}
                onChange={(e) =>
                  handleInputChange(facility.id, "description", e.target.value)
                }
                placeholder="Lorem Ipsum"
              />
              <div>
                {/* <Label>Sub Facility</Label> */}
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
                      {facility.subFacilities.map((subFacility, index) => (
                        <>
                          <TableRow key={subFacility.id}>
                            <TableCell className="font-semibold">
                              {String(index + 1).padStart(2, "0")}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={subFacility.name}
                                onChange={(e) =>
                                  handleSubFacilityChange(
                                    facility.id,
                                    subFacility.id,
                                    e.target.value
                                  )
                                }
                                placeholder="Lorem Ipsum"
                                className="flex-1 font-semibold"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  removeSubFacility(facility.id, subFacility.id)
                                }
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="">
                          <Button
                            variant="ghost"
                            onClick={() => addSubFacility(facility.id)}
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
          onClick={addFacility}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Facility
        </Button>
      </div>
    </div>
  );
}

export function AddRoom() {
  const [rooms, setRooms] = useState<Room[]>([
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
  ]);

  const addAmenity = (roomId: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              amenities: [
                ...room.amenities,
                { id: room.amenities.length + 1, name: "" },
              ],
            }
          : room
      )
    );
  };

  const removeAmenity = (roomId: number, amenityId: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              amenities: room.amenities.filter(
                (amenity) => amenity.id !== amenityId
              ),
            }
          : room
      )
    );
  };

  const addRoom = () => {
    setRooms((prevRooms) => [
      ...prevRooms,
      {
        id: prevRooms.length + 1,
        type: "",
        numberOfRooms: "",
        price: "",
        capacity: "",
        bedType: "",
        numberOfBeds: "",
        amenities: [{ id: 1, name: "" }],
      },
    ]);
  };

  const handleRoomChange = (
    roomId: number,
    field: keyof Room,
    value: string
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, [field]: value } : room
      )
    );
  };

  const handleAmenityChange = (
    roomId: number,
    amenityId: number,
    value: string
  ) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              amenities: room.amenities.map((amenity) =>
                amenity.id === amenityId ? { ...amenity, name: value } : amenity
              ),
            }
          : room
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {rooms.map((room) => (
        <Card key={room.id} className="overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row justify-between ">
            <div>
              <CardTitle>Room Type {room.id}</CardTitle>
              <CardDescription>
                Lipsum dolor sit amet, consectetur adipiscing elit
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setRooms((prevRooms) =>
                  prevRooms.filter((r) => r.id !== room.id)
                )
              }
            >
              <Trash className="h-4 w-4" />
              Remove Room
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Label htmlFor={`room-type-${room.id}`}>Room Type</Label>
              <Input
                id={`room-type-${room.id}`}
                value={room.type}
                onChange={(e) =>
                  handleRoomChange(room.id, "type", e.target.value)
                }
                placeholder="Lorem Ipsum"
              />
              <Label htmlFor={`number-of-rooms-${room.id}`}>
                Number of Rooms
              </Label>
              <Input
                id={`number-of-rooms-${room.id}`}
                value={room.numberOfRooms}
                onChange={(e) =>
                  handleRoomChange(room.id, "numberOfRooms", e.target.value)
                }
                placeholder="Lorem Ipsum"
              />
              <Label htmlFor={`price-${room.id}`}>Price</Label>
              <Input
                id={`price-${room.id}`}
                value={room.price}
                onChange={(e) =>
                  handleRoomChange(room.id, "price", e.target.value)
                }
                placeholder="Lorem Ipsum"
                required
              />
              <Label htmlFor={`capacity-${room.id}`}>Capacity</Label>
              <Input
                id={`capacity-${room.id}`}
                value={room.capacity}
                onChange={(e) =>
                  handleRoomChange(room.id, "capacity", e.target.value)
                }
                placeholder="Lorem Ipsum"
              />
              <Label htmlFor={`bed-type-${room.id}`}>Bed Type</Label>
              <Input
                id={`bed-type-${room.id}`}
                value={room.bedType}
                onChange={(e) =>
                  handleRoomChange(room.id, "bedType", e.target.value)
                }
                placeholder="Lorem Ipsum"
              />
              <Label htmlFor={`number-of-beds-${room.id}`}>
                Number of Beds
              </Label>
              <Input
                id={`number-of-beds-${room.id}`}
                value={room.numberOfBeds}
                onChange={(e) =>
                  handleRoomChange(room.id, "numberOfBeds", e.target.value)
                }
                placeholder="Lorem Ipsum"
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
                    {room.amenities.map((amenity, index) => (
                      <TableRow key={amenity.id}>
                        <TableCell className="font-semibold">
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={amenity.name}
                            onChange={(e) =>
                              handleAmenityChange(
                                room.id,
                                amenity.id,
                                e.target.value
                              )
                            }
                            placeholder="Lorem Ipsum"
                            className="flex-1"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeAmenity(room.id, amenity.id)}
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
                  onClick={() => addAmenity(room.id)}
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
          onClick={addRoom}
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add Room
        </Button>
      </div>
    </div>
  );
}

export function ContactDetails() {
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
            <Input id="contact-person-name" placeholder="Lorem Ipsum" />

            <Label htmlFor="role-position">Role / Position</Label>
            <Input id="role-position" placeholder="Lorem Ipsum" />

            <Label htmlFor="email-address">Email Address</Label>
            <Input id="email-address" placeholder="Lorem Ipsum" />

            <Label htmlFor="phone-number">Phone Number</Label>
            <Input id="phone-number" placeholder="Lorem Ipsum" />
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
            <Input id="facebook" placeholder="www.facebook.com" />

            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="www.instagram.com" />

            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input id="linkedin" placeholder="www.linkedin.com" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Review({ goToStep }) {
  // These states should be populated from the form data collected
  const [basicInfo, setBasicInfo] = useState({
    name: "Serene Hotel",
    location: "Lorem Ipsum",
    discount: "Lorem Ipsum",
    description:
      "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisi nec ultricies ultrices, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.",
  });

  const [facilities, setFacilities] = useState([
    {
      id: 1,
      name: "Facility 1",
      description: "Lorem Ipsum",
      subFacilities: ["Sub Facility 1", "Sub Facility 2"],
    },
  ]);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      type: "Room Type 1",
      numberOfRooms: 10,
      price: 100,
      capacity: 2,
      bedType: "King",
      numberOfBeds: 1,
      amenities: ["Amenity 1", "Amenity 2"],
    },
  ]);

  const [contact, setContact] = useState({
    contactPerson: "John Doe",
    role: "Manager",
    email: "johndoe@example.com",
    phone: "1234567890",
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "www.facebook.com",
    instagram: "www.instagram.com",
    linkedin: "www.linkedin.com",
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
          <Button variant="outline" onClick={() => goToStep(0)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p>Hotel Name: {basicInfo.name}</p>
          <p>Location: {basicInfo.location}</p>
          <p>Discount Offer: {basicInfo.discount}</p>
          <p>Description: {basicInfo.description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
          <Button variant="outline" onClick={() => goToStep(1)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {facilities.map((facility) => (
            <div key={facility.id}>
              <p>{facility.name}</p>
              <p>{facility.description}</p>
              <ul>
                {facility.subFacilities.map((subFacility, index) => (
                  <li key={index}>{subFacility}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
          <Button variant="outline" onClick={() => goToStep(2)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {rooms.map((room) => (
            <div key={room.id}>
              <p>Room Type: {room.type}</p>
              <p>Number of Rooms: {room.numberOfRooms}</p>
              <p>Price: {room.price}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Bed Type: {room.bedType}</p>
              <p>Number of Beds: {room.numberOfBeds}</p>
              <ul>
                {room.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>
            Lipsum dolor sit amet, consectetur adipiscing elit
          </CardDescription>
          <Button variant="outline" onClick={() => goToStep(3)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <p>Contact Person: {contact.contactPerson}</p>
          <p>Role/Position: {contact.role}</p>
          <p>Email Address: {contact.email}</p>
          <p>Phone Number: {contact.phone}</p>
          <p>Social Links:</p>
          <ul>
            <li>Facebook: {socialLinks.facebook}</li>
            <li>Instagram: {socialLinks.instagram}</li>
            <li>LinkedIn: {socialLinks.linkedin}</li>
          </ul>
        </CardContent>
      </Card>
      <div className="flex items-center gap-2">
        <Checkbox id="is-operating" />
        <Label htmlFor="is-operating">Is the hotel operating?</Label>
      </div>
      <div className="text-muted-foreground">
        Please tick this box if the hotel is actively operating and currently
        open for guests.
      </div>
      <div className="flex gap-2">
        <Button variant="destructive">Delete</Button>
        <Button variant="default">Add Hotel</Button>
      </div>
    </div>
  );
}

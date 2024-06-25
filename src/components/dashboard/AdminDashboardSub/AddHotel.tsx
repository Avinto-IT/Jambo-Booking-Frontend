"use client";
import { useEffect, useState } from "react";
import Select from "react-select";

interface Location {
  locationID: string;
  city: string;
  country: string;
}

interface Room {
  type: string;
  price: string;
  amenities: string[];
  capacity: string;
  bed: {
    bedType: string;
    numberOfBeds: string;
  };
}

interface Facility {
  name: string;
  comment: string;
  subFacilities: string[];
}

const initialRooms: Room[] = [
  {
    type: "simple",
    price: "",
    amenities: [],
    capacity: "",
    bed: { bedType: "", numberOfBeds: "" },
  },
  {
    type: "deluxe",
    price: "",
    amenities: [],
    capacity: "",
    bed: { bedType: "", numberOfBeds: "" },
  },
  {
    type: "super",
    price: "",
    amenities: [],
    capacity: "",
    bed: { bedType: "", numberOfBeds: "" },
  },
];

export default function AddHotelForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    locationID: "",
    facilities: [] as Facility[],
    description: "",
    houseRules: [] as string[],
    imageLinks: [""],
    primaryImageLink: "",
    isRunning: false,
    discount: 0,
  });
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [locations, setLocations] = useState<Location[]>([]);
  const [message, setMessage] = useState("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : name === "discount"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleRoomChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    category: string,
    subCategory?: string
  ) => {
    const { value } = e.target;
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      if (category === "type") {
        updatedRooms[index][category] = value;
      } else if (subCategory) {
        (updatedRooms[index][category] as any)[subCategory] = value;
      } else {
        updatedRooms[index][category] = value;
      }
      return updatedRooms;
    });
  };

  const handleLocationChange = (selectedOption: any) => {
    const selectedLocation = locations.find(
      (location) => location.locationID === selectedOption.value
    );
    setFormData((prevData) => ({
      ...prevData,
      locationID: selectedOption.value,
      address: selectedLocation
        ? `${selectedLocation.city}, ${selectedLocation.country}`
        : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/setHotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, rooms }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Hotel added successfully!");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.log(error);
      setMessage("Error: Unable to add hotel.");
    }
  };

  const createNewRoom = (): Room => ({
    type: "",
    price: "",
    amenities: [],
    capacity: "",
    bed: { bedType: "", numberOfBeds: "" },
  });

  const addRoom = () => {
    setRooms([...rooms, createNewRoom()]);
  };

  const deleteRoom = (index: number) => {
    setRooms((prevRooms) => prevRooms.filter((_, i) => i !== index));
  };

  const addFacility = () => {
    setFormData((prevData) => ({
      ...prevData,
      facilities: [
        ...prevData.facilities,
        { name: "", comment: "", subFacilities: [""] },
      ],
    }));
  };

  const addHouseRule = () => {
    setFormData((prevData) => ({
      ...prevData,
      houseRules: [...prevData.houseRules, ""],
    }));
  };

  const addSubFacility = (facilityIndex: number) => {
    console.log("addSubFacility called");
    setFormData((prevData) => {
      console.log("setFormData called");
      const updatedFacilities = [...prevData.facilities];
      updatedFacilities[facilityIndex].subFacilities.push("");
      console.log("Facilities updated:", updatedFacilities);
      return { ...prevData, facilities: updatedFacilities };
    });
  };

  const handleFacilityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Facility
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedFacilities = [...prevData.facilities];
      updatedFacilities[index][field] = value;
      return {
        ...prevData,
        facilities: updatedFacilities,
      };
    });
  };

  const handleSubFacilityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    facilityIndex: number,
    subFacilityIndex: number
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedFacilities = [...prevData.facilities];
      updatedFacilities[facilityIndex].subFacilities[subFacilityIndex] = value;
      return {
        ...prevData,
        facilities: updatedFacilities,
      };
    });
  };

  const handleHouseRuleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prevData) => {
      const updatedHouseRules = [...prevData.houseRules];
      updatedHouseRules[index] = value;
      return {
        ...prevData,
        houseRules: updatedHouseRules,
      };
    });
  };

  const addRoomAmenity = (index: number) => {
    console.log("addRoomAmenity called");
    setRooms((prevRooms) => {
      console.log("setRooms called");
      const updatedRooms = [...prevRooms];
      updatedRooms[index].amenities.push("");
      console.log("Rooms updated:", updatedRooms);
      return updatedRooms;
    });
  };

  const handleAmenityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    roomIndex: number,
    amenityIndex: number
  ) => {
    const { value } = e.target;
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[roomIndex].amenities[amenityIndex] = value;
      return updatedRooms;
    });
  };

  const renderRoomFields = (room: Room, roomIndex: number) => (
    <div key={roomIndex} className="room-fields">
      <h4 className="font-semibold">Room Type {roomIndex + 1}</h4>
      <label>
        Room Type:
        <input
          className="border border-red-300"
          type="text"
          name="type"
          value={room.type}
          onChange={(e) => handleRoomChange(e, roomIndex, "type")}
        />
      </label>
      <label>
        Price:
        <input
          className="border border-red-300"
          type="number"
          name="price"
          value={room.price}
          onChange={(e) => handleRoomChange(e, roomIndex, "price")}
        />
      </label>
      <label>
        Capacity:
        <input
          className="border border-red-300"
          type="text"
          name="capacity"
          value={room.capacity}
          onChange={(e) => handleRoomChange(e, roomIndex, "capacity")}
        />
      </label>
      <label>
        Bed Type:
        <input
          className="border border-red-300"
          type="text"
          name="bedType"
          value={room.bed.bedType}
          onChange={(e) => handleRoomChange(e, roomIndex, "bed", "bedType")}
        />
      </label>
      <label>
        Number of Beds:
        <input
          className="border border-red-300"
          type="number"
          name="numberOfBeds"
          value={room.bed.numberOfBeds}
          onChange={(e) =>
            handleRoomChange(e, roomIndex, "bed", "numberOfBeds")
          }
        />
      </label>
      {room.amenities.map((amenity, amenityIndex) => (
        <div key={amenityIndex}>
          <label>
            Amenity:
            <input
              className="border border-red-300"
              type="text"
              value={amenity}
              onChange={(e) => handleAmenityChange(e, roomIndex, amenityIndex)}
            />
          </label>
        </div>
      ))}
      <button
        className="p-2 m-2 border"
        type="button"
        onClick={() => addRoomAmenity(roomIndex)}
      >
        Add Amenity
      </button>
      <button type="button" onClick={() => deleteRoom(roomIndex)}>
        Delete Room
      </button>
    </div>
  );

  const renderFacilityFields = (facility: Facility, facilityIndex: number) => (
    <div key={facilityIndex} className="facility-fields">
      <label>
        Name:
        <input
          className="border border-red-300"
          type="text"
          value={facility.name}
          onChange={(e) => handleFacilityChange(e, facilityIndex, "name")}
        />
      </label>
      <label>
        Comment:
        <input
          className="border border-red-300"
          type="text"
          value={facility.comment}
          onChange={(e) => handleFacilityChange(e, facilityIndex, "comment")}
        />
      </label>
      {facility.subFacilities.map((subFacility, subFacilityIndex) => {
        return (
          <div key={subFacilityIndex}>
            <label>
              Sub-Facility:
              <input
                className="border border-red-300"
                type="text"
                value={subFacility}
                onChange={(e) =>
                  handleSubFacilityChange(e, facilityIndex, subFacilityIndex)
                }
              />
            </label>
          </div>
        );
      })}
      <button
        className="p-2 m-2 border"
        type="button"
        onClick={() => addSubFacility(facilityIndex)}
      >
        Add Sub-Facility
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add a New Hotel</h1>
      <input
        className="border border-red-300"
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        className="border border-red-300"
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <Select
        options={locations.map((location) => ({
          value: location.locationID,
          label: `${location.city}, ${location.country}`,
        }))}
        onChange={handleLocationChange}
        placeholder="Select Location"
      />
      <input
        className="border border-red-300"
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        className="border border-red-300"
        type="text"
        name="primaryImageLink"
        placeholder="Primary Image Link"
        value={formData.primaryImageLink}
        onChange={handleChange}
        required
      />
      <input
        className="border border-red-300"
        type="number"
        name="discount"
        placeholder="Discount"
        value={formData.discount}
        onChange={handleChange}
        required
      />
      <div>
        <h3>Facilities</h3>
        {formData.facilities.map((facility, index) =>
          renderFacilityFields(facility, index)
        )}
        <button type="button" onClick={addFacility}>
          Add Facility
        </button>
      </div>
      <div>
        <h3>House Rules</h3>
        {formData.houseRules.map((rule, index) => (
          <label key={index}>
            House Rule:
            <input
              className="border border-red-300"
              type="text"
              value={rule}
              onChange={(e) => handleHouseRuleChange(e, index)}
            />
          </label>
        ))}
        <button type="button" onClick={addHouseRule}>
          Add House Rule
        </button>
      </div>
      <div>
        <h3 className="font-bold text-lg">Rooms</h3>
        {rooms.map((room, index) => renderRoomFields(room, index))}
        <button type="button" onClick={addRoom}>
          Add Room
        </button>
      </div>
      <div>
        <label>
          <input
            className="border border-red-300"
            type="checkbox"
            name="isRunning"
            checked={formData.isRunning}
            onChange={handleChange}
          />
          Is Running
        </label>
      </div>
      <button type="submit">Add Hotel</button>
      {message && <p>{message}</p>}
    </form>
  );
}

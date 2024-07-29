// import React, { useEffect, useState } from "react";

// interface Facility {
//   facilityId: string;
//   facilityCategory: string;
//   name: string;
//   subFacilities: any[];
// }

// export default function UseFacilityIcon(nameOfFacility: string) {
//   const [facilityNames, setFacilityNames] = useState<string[]>([]);
//   const [facilityName, setFacilityName] = useState("");

//   useEffect(() => {
//     const fetchFacilities = async () => {
//       try {
//         const response = await fetch("/api/getFacilities");
//         const data: Facility[] = await response.json();
//         console.log("Data fetched", data);
//         const names = data.map((facility) => facility.facilityCategory);
//         setFacilityNames(names);
//         // setFacilityName(data[9].facilityCategory); // Assuming data is an array of facilities
//       } catch (error) {
//         console.log("Error fetching facilities:", error);
//       }
//     };
//     fetchFacilities();
//   }, []);

//   const getIconName = (facilityCategory: string): string | null => {
//     switch (facilityCategory) {
//       case "Amenities":
//         return "ConciergeBell";
//       case "Dining":
//         return "ChefHat";
//       case "Recreation":
//         return "TreePalm";
//       case "Business Services":
//         return "Handshake";
//       case "Transportation":
//         return "Car";
//       case "Guest Services":
//         return "HandPlatter";
//       case "Housekeeping":
//         return "WashingMachine";
//       case "Luggage":
//         return "Luggage";
//       case "Accessibility":
//         return "Accessibility";
//       case "Security":
//         return "Shield";
//       case "Emergency Services":
//         return "Siren";
//       case "Recreational Activities":
//         return "Tent";
//       case "Wellness and Spa":
//         return "Clover";
//       case "Entertainment":
//         return "Drama";
//       case "Children's Services":
//         return "Baby";
//       case "Pet Services":
//         return "PawPrint";
//       case "Technology":
//         return "Pickaxe";
//       case "Sustainability":
//         return "Flower";
//       case "Events":
//         return "CalendarCheck";
//       case "Miscellaneous":
//         return "Currency";
//       default:
//         return null;
//     }
//   };

//   return { facilityNames, getIconName };
//}

import React, { useEffect, useState } from "react";
import * as Icons from "lucide-react";
interface Facility {
  facilityId: string;
  facilityCategory: string;
  name: string;
  subFacilities: any[];
}

export default function UseFacilityIcon() {
  const [facilityNames, setFacilityNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("/api/getFacilities");
        const data: Facility[] = await response.json();
        console.log("Data fetched", data);
        const names = data.map((facility) => facility.facilityCategory);
        setFacilityNames(names);
      } catch (error) {
        console.log("Error fetching facilities:", error);
      }
    };
    fetchFacilities();
  }, []);

  const getIconName = (facilityCategory: string): string | null => {
    switch (facilityCategory) {
      case "Amenities":
        return "ConciergeBell";
      case "Dining":
        return "ChefHat";
      case "Recreation":
        return "TreePalm";
      case "Business Services":
        return "Handshake";
      case "Transportation":
        return "Car";
      case "Guest Services":
        return "HandPlatter";
      case "Housekeeping":
        return "WashingMachine";
      case "Luggage":
        return "Luggage";
      case "Accessibility":
        return "Accessibility";
      case "Security":
        return "Shield";
      case "Emergency Services":
        return "Siren";
      case "Recreational Activities":
        return "Tent";
      case "Wellness and Spa":
        return "Clover";
      case "Entertainment":
        return "Drama";
      case "Childrens Services":
        return "Baby";
      case "Pet Services":
        return "PawPrint";
      case "Technology":
        return "Pickaxe";
      case "Sustainability":
        return "Flower";
      case "Events":
        return "CalendarCheck";
      case "Miscellaneous":
        return "Currency";
      default:
        return null;
    }
  };

  const getIconComponent = (nameOfFacility: string): any => {
    if (nameOfFacility && facilityNames.includes(nameOfFacility)) {
      const facility = facilityNames.find(
        (facility) => facility === nameOfFacility
      );
      if (facility) {
        const IconComponent = (Icons as any)[`${getIconName(nameOfFacility)}`];
        return IconComponent;
      }
    }
    return null;
  };

  return { getIconComponent };
}

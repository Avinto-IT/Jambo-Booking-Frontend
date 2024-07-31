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
import amenities from "../../public/images/facility-icon/amenitiesIcon.svg";
import dining from "../../public/images/facility-icon/diningIcon.svg";
import recreation from "../../public/images/facility-icon/recreationIcon.svg";
import businessService from "../../public/images/facility-icon/businessIcon.svg";
import transportation from "../../public/images/facility-icon/transportationIcon.svg";
import guestServices from "../../public/images/facility-icon/guestServicesIcon.svg";
import housekeeping from "../../public/images/facility-icon/houseKeepingIcon.svg";
import luggage from "../../public/images/facility-icon/luggageIcon.svg";
import security from "../../public/images/facility-icon/securityIcon.svg";
import accessibility from "../../public/images/facility-icon/accessibilityIcon.svg";
import emergencyServices from "../../public/images/facility-icon/emergencyServicesIcon.svg";
import recreationalActivities from "../../public/images/facility-icon/recreationIcon.svg";
import wellnessAndSpa from "../../public/images/facility-icon/wellnessAndSpaIcon.svg";
import entertainment from "../../public/images/facility-icon/entertainmentIcon.svg";
import childrenServices from "../../public/images/facility-icon/childrenServicesIcon.svg";
import petServices from "../../public/images/facility-icon/petServicesIcon.svg";
import technology from "../../public/images/facility-icon/technologyIcon.svg";
import sustainability from "../../public/images/facility-icon/sustainabilityIcon.svg";
import events from "../../public/images/facility-icon/eventsIcon.svg";
import miscellaneous from "../../public/images/facility-icon/miscellaneousIcon.svg";
import Image from "next/image";

interface Facility {
  facilityId: string;
  facilityCategory: string;
  name: string;
  subFacilities: any[];
}

interface IconComponentProps {
  nameOfFacility: string;
}

const UseFacilityIcon: React.FC<IconComponentProps> = ({ nameOfFacility }) => {
  // const [facilityNames, setFacilityNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch("/api/getFacilities");
        const data: Facility[] = await response.json();
        console.log("Data fetched", data);
        const names = data.map((facility) => facility.facilityCategory);
        // setFacilityNames(names);
      } catch (error) {
        console.log("Error fetching facilities:", error);
      }
    };
    fetchFacilities();
  }, []);

  const getIconName = (facilityCategory: string): string | null => {
    switch (facilityCategory) {
      case "Amenities":
        return amenities;
      case "Dining":
        return dining;
      case "Recreation":
        return recreation;
      case "Business Services":
        return businessService;
      case "Transportation":
        return transportation;
      case "Guest Services":
        return guestServices;
      case "Housekeeping":
        return housekeeping;
      case "Luggage":
        return luggage;
      case "Accessibility":
        return accessibility;
      case "Security":
        return security;
      case "Emergency Services":
        return emergencyServices;
      case "Recreational Activities":
        return recreationalActivities;
      case "Wellness and Spa":
        return wellnessAndSpa;
      case "Entertainment":
        return entertainment;
      case "Children's Services":
        return childrenServices;
      case "Pet Services":
        return petServices;
      case "Technology":
        return technology;
      case "Sustainability":
        return sustainability;
      case "Events":
        return events;
      case "Miscellaneous":
        return miscellaneous;
      default:
        return null;
    }
  };

  const iconSrc = getIconName(nameOfFacility);

  if (iconSrc) {
    return <Image src={iconSrc} alt={nameOfFacility} />;
  } else {
    return null;
  }
};

export default UseFacilityIcon;

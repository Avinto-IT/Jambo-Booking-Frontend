import React, { useEffect, useState } from "react";
import checkInTime from "../../public/images/house-rules-icon/checkInTimeIcon.svg";
import checkOutTime from "../../public/images/house-rules-icon/checkOutTimeIcon.svg";
import cancelPolicy from "../../public/images/house-rules-icon/cancellationPolicyIcon.svg";
import noSmoking from "../../public/images/house-rules-icon/noSmokingIcon.svg";
import petPolicy from "../../public/images/house-rules-icon/petPolicyIcon.svg";

import Image from "next/image";
import { HouseRuleInterface } from "./types";

// interface HouseRules {
//   facilityId: string;
//   facilityCategory: string;
//   name: string;
//   subFacilities: any[];
// }

interface IconComponentProps {
  nameOfRule: string;
}

const UseHouseRuleIcon: React.FC<IconComponentProps> = ({ nameOfRule }) => {
  // const [facilityNames, setFacilityNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("/api/getHouseRules");
        const data: HouseRuleInterface[] = await response.json();
        console.log("Data fetched", data);
        const names = data.map((rule) => rule.houseRule);
        // setFacilityNames(names);
      } catch (error) {
        console.log("Error fetching facilities:", error);
      }
    };
    fetchRules();
  }, []);

  const getIconName = (houseRule: string): string | null => {
    switch (houseRule) {
      case "Check In Time":
        return checkInTime;
      case "Check-out time":
        return checkOutTime;
      case "No smoking":
        return noSmoking;
      case "Pet Policy":
        return petPolicy;
      case "Cancellation Policy":
        return cancelPolicy;

      default:
        return null;
    }
  };

  const iconSrc = getIconName(nameOfRule);

  if (iconSrc) {
    return <Image src={iconSrc} alt={nameOfRule} />;
  } else {
    return null;
  }
};

export default UseHouseRuleIcon;

export interface UserDetails {
  email: string;
  firstName: string;
  role: string;
  contactNumber: number;
  agencyName: string;
}

export interface Location {
  locationID: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface Hotel {
  hotelID: string;
  name: string;
  address: string;
  locationID: string;
  facilities: {
    name: string;
    comment: string;
    subFacilities: { id: number; name: { value: string; label: string } }[];
  }[];
  description: string;
  // houseRules: { [key: string]: boolean };
  addedDate: Date;
  houseRules: string[];
  imageLinks: string[];
  primaryImageLink: string;
  isRunning: boolean;
  rooms: Room[];
  discount: number;
}

export interface Booking {
  bookingID: string;
  userID: string;
  hotelID: string;
  bookingStartDate: string;
  bookingEndDate: string;
  status: string;
  guests: number;
  bookingInfo: {
    beds: { bedType: string; numberOfBeds: string }[];
    roomCapacity: string;
    roomType: string;
    rooms: number;
    totalRoomPrice: number;
    roomPrice: string;
  }[];
  specialRequest: string;
  totalBookingPrice: number;

  hotel: {
    address: string;
    discount: number;
    houseRules: string[];
    name: string;
    primaryImageLink: string;
    rooms: Room[];
    contactDetails: {
      email: string;
      name: string;
      number: string;
      facebook: string;
      instagram: string;
      linkedin: string;
      position: string;
    };
  };
  user: {
    agencyName: string | null;
    contactNumber: string;
    email: string;
    firstName: string;
    gradeID: string | null;
    lastName: string;
    userID: string;
  };
}

export interface Agent {
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
}

export interface Room {
  id: number;
  type: string;
  numberOfRooms: string;
  price: string;
  capacity: string;
  bedType: string;
  numberOfBeds: string;
  amenities: { id: number; name: string }[];
  calendarPrices?: {
    id: string;
    from: string;
    to: string;
    price: string;
    createdAt: string;
  }[];
  roomImageLinks: File[];
}

export interface HouseRuleInterface {
  id: string;
  houseRule: string;
}
export interface FacilitiesInterface {
  facilityId: string;
  facilityCategory: string;
  subFacilities: string[];
}

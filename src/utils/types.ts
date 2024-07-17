export interface UserDetails {
  email: string;
  firstName: string;
  role: string;
  contactNumber: number;
  agencyName: string;
}

export interface Location {
  locationID: string;
  city: string;
  country: string;
}

export interface Hotel {
  hotelID: string;
  name: string;
  address: string;
  locationID: string;
  facilities: {
    name: string;
    comment: string;
    subFacilities: string[];
  }[];
  description: string;
  houseRules: { [key: string]: boolean };
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
    roomType: string;
    rooms: number;
    totalPrice: number;
  };
  hotel: {
    address: string;
    description: string;
    discount: number;
    facilities: string[];
    houseRules: string[];
    imageLinks: string[];
    isRunning: boolean;
    locationID: string;
    name: string;
    primaryImageLink: string;
    rooms: Room[];
  };
  user: {
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
}

export interface UserDetails {
  email: string;
  firstName: string;
  role: string;
  contactNumber: number;
  agencyName: string;
}

export interface Hotels {
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
  rooms: {
    type: string;
    price: number;
    capacity: string;
    bed: {
      bedType: string;
      numberOfBeds: string;
    };
    amenities: { [key: string]: boolean };
  }[];
  discount: number;
}

export interface Location {
  locationID: string;
  city: string;
  country: string;
}

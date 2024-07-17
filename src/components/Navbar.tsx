import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const popularDestinationItems = [
  {
    title: "Popular Destinations",
    description:
      "East Africa boasts most renowned and diverse travel destinations",
  },
  {
    title: "Culture of East Africa",
    description:
      "A mosaic of rich and diverse cultures, each with its uniqueness.",
  },
  {
    title: "Trip Guide",
    description:
      "Planning a trip to East Africa? This comprehensive tour guide.",
  },
];

const hotelItems = [
  {
    title: "Alert Dialog",
    description:
      "A modal dialog that interrupts the user with important content and...",
  },
  {
    title: "Hover Card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    description:
      "Displays an indicator showing the completion progress of a task,...",
  },
  {
    title: "Scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    description: "A set of layered sections of content known as tab panels",
  },
  {
    title: "Tooltip",
    description:
      "A popup that displays information related to an element when the...",
  },
];
export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center space-x-4">
        <NavigationMenuItem>
          <NavigationMenuLink href="/" className="hover:text-blue-600">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-blue-600">
            Popular Destinations
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg inline-flex p-6 rounded-lg gap-x-3 min-w-[500px]">
            <div className="bg-blue-600 flex flex-col justify-end flex-grow text-white p-6 rounded-lg w-2/5 ">
              <h3 className="text-lg font-bold">Jambo Hotels</h3>
              <p className="mt-2 text-sm">
                Experience luxury and comfort, your gateway to exquisite
                destinations.
              </p>
            </div>
            <div className="w-3/5 flex flex-col gap-y-3">
              {popularDestinationItems.map((items, index) => {
                return (
                  <div
                    key={index}
                    className="hover:bg-slate-100 p-3 rounded flex flex-col flex-wrap items-start"
                  >
                    <h3 className="text-sm font-medium">{items.title}</h3>
                    <p className="text-gray-500 text-sm">{items.description}</p>
                  </div>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-blue-600">
            Hotels
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg inline-flex p-6 rounded-lg gap-x-3 min-w-[500px]">
            <div className="w-full grid grid-cols-2 gap-3">
              {hotelItems.map((item, index) => (
                <div
                  key={index}
                  className="hover:bg-slate-100 p-3 rounded flex flex-col flex-wrap items-start"
                >
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-blue-600">
            About Us
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg inline-flex p-6 rounded-lg gap-x-3 min-w-[500px]">
            <div className="w-full grid grid-cols-2 gap-3">
              {hotelItems.map((item, index) => (
                <div
                  key={index}
                  className="hover:bg-slate-100 p-3 rounded flex flex-col flex-wrap items-start"
                >
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:text-blue-600">
            Contact
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg inline-flex p-6 rounded-lg gap-x-3 min-w-[500px]">
            <div className="w-full grid grid-cols-2 gap-3">
              {hotelItems.map((item, index) => (
                <div
                  key={index}
                  className="hover:bg-slate-100 p-3 rounded flex flex-col flex-wrap items-start"
                >
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

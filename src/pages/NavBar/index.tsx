import React from "react";
import {
  Disclosure,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  Squares2X2Icon,
  SunIcon,
} from "@heroicons/react/24/outline";
// import { Link } from "react-router-dom";

interface NavBarProps {
  darkMode: boolean;
  navigation: { name: string; href: string; current: boolean }[];
  toggleSearch: () => void;
  toggleDarkMode: () => void;
  isSearchOpen: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  darkMode,
  navigation,
  toggleSearch,
  toggleDarkMode,
}) => (
  <Disclosure
    as="nav"
    className={darkMode ? "dark-nav bg-blue-800" : "bg-blue-800"}
  >
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex-shrink-0 items-center">
            <img
              alt="Pokedex"
              src="https://archive.org/download/PokemonIcon/pokemon%20icon.png"
              className="h-8 w-auto"
            />
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={
                    item.current
                      ? "bg-blue-900 text-white"
                      : "text-blue-300 hover:bg-blue-700 hover:text-white"
                  }
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button
            type="button"
            onClick={toggleSearch}
            className="relative rounded-full bg-blue-800 p-1 text-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="absolute -inset-1.5" />
            <MagnifyingGlassIcon aria-hidden="true" className="h-6 w-6" />
          </button>
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative rounded-full bg-blue-800 p-1 text-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800">
                <span className="absolute -inset-1.5" />
                <Cog8ToothIcon aria-hidden="true" className="h-6 w-6" />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
            >
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-blue-700 data-[focus]:bg-blue-100"
                >
                  <Squares2X2Icon aria-hidden="true" className="h-6 w-6" />
                  Grid View
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={toggleDarkMode}
                  className="block px-4 py-2 text-sm text-blue-700 data-[focus]:bg-blue-100"
                >
                  {darkMode ? (
                    <>
                      <SunIcon aria-hidden="true" className="h-6 w-6" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <MoonIcon aria-hidden="true" className="h-6 w-6" />
                      Dark Mode
                    </>
                  )}
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
    <Disclosure.Panel className="sm:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={
              item.current
                ? "bg-blue-900 text-white"
                : "text-blue-300 hover:bg-blue-700 hover:text-white"
            }
          >
            {item.name}
          </DisclosureButton>
        ))}
      </div>
    </Disclosure.Panel>
    {/* <div className="flex space-x-4">
      <Link to="/" className="text-blue-300 hover:bg-blue-700 hover:text-white">
        Pokemon List
      </Link>
      <Link
        to="/captured"
        className="text-blue-300 hover:bg-blue-700 hover:text-white"
      >
        Captured
      </Link>
    </div> */}
  </Disclosure>
);

export default NavBar;

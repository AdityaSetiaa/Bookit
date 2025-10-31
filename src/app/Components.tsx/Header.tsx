"use client";

import Image from "next/image";
import logo from "../../../public/highwaydeliteLogo.png";

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ search, setSearch }) => {
  return (
    <header className="w-full shadow h-[70px] sm:h-[84px] px-4 sm:px-10 lg:px-[124px] flex items-center bg-white">
      <div className="w-full flex flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Image
          src={logo}
          alt="Logo"
          width={90}
          height={45}
          priority
          className="w-20 sm:w-[100px] h-auto"
        />

        {/* Search Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 sm:gap-4 w-full max-w-[360px]"
        >
          <input
            type="text"
            className="flex-1 bg-zinc-100 px-3 py-2 rounded-md outline-none text-sm sm:text-base"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="bg-yellow-400 text-sm sm:text-base px-3 sm:px-4 py-2 rounded-md hover:bg-yellow-500 transition"
            type="button"
          >
            Search
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;

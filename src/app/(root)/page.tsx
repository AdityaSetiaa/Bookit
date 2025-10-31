"use client";;
import Header from "../Components.tsx/Header";
import Display from "../Components.tsx/Display";
import { useState } from "react";

export default function Home() {
    const [search, setSearch] = useState("");

  return (
    <div className="w-full h-full flex items-center text-black flex-col">
     <Header search={search} setSearch={setSearch} />
      <Display search={search} />
    </div>
  );
}

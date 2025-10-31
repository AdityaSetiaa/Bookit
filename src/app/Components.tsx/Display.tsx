"use client";

import { useEffect, useState } from "react";
import ExperienceCard from "./experienceCard";

interface ExperienceType {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image?: string;
}

const Display = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/experiences");
        const data = await res.json();
        setExperiences(data);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <p className="text-gray-600 text-lg animate-pulse">Loading experiences...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center lg:px-[124px] sm:px-14 w-full h-full py-[42px]">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-y-8 gap-x-6">
        {experiences.map((exp) => (
          <ExperienceCard key={exp._id} {...exp} />
        ))}
      </div>
    </div>
  );
};

export default Display;

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

interface DisplayProps {
  search: string;
}

const Display: React.FC<DisplayProps> = ({ search }) => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/experiences");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setExperiences(data.data);
        } else {
          console.error("Invalid data format received:", data);
          setExperiences([]);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const filtered = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(search.toLowerCase()) ||
      exp.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center lg:px-[124px] w-full h-full py-[42px]">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-y-8 gap-x-6">
        {filtered.length > 0 ? (
          filtered.map((exp) => <ExperienceCard key={exp._id} {...exp} />)
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No experiences found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Display;

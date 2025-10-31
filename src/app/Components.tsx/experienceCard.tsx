import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ExperienceProps {
  _id: string; 
  images?: string;
  location?: string;
  title?: string;
  price?: number;
  description?: string;
}

const ExperienceCard = ({
  _id,
  images,
  location,
  title,
  price,
  description,
}: ExperienceProps) => {
  return (
    <div className="w-[280px] h-[312px] rounded-2xl bg-[#F0F0F0] hover:shadow-lg transition-all duration-200">
      {/* Dynamic route */}
      <Link href={`/booking/${_id}`}>
        <div className="w-full h-full cursor-pointer">
          <div className="h-[170px] w-[280px] text-center">
            <Image
              src={images || "/fallback.jpg"}
              alt={title || "Experience Image"}
              width={200}
              height={100}
              className="w-full h-full rounded-t-2xl object-cover"
              priority
            />
          </div>
          <div className="px-4 py-3 flex flex-col gap-2 my-auto">
            <div className="w-full h-6 justify-between flex">
              <h1 className="font-semibold">{title}</h1>
              <h1 className="bg-[#D6D6D6] px-2 pt-0.5 font-semibold rounded text-[12px]">
                {location}
              </h1>
            </div>
            <h1 className="text-sm text-[12px] text-[#6C6C6C] line-clamp-2">
              {description}
            </h1>
            <div className="flex justify-between text-center">
              <div className="flex gap-1">
                <h1 className="flex font-semibold text-[11px] text-center justify-center my-auto">
                  From:
                </h1>
                <p className="text-[20px] font-semibold tracking-tight">
                  ₹{price}
                </p>
              </div>
              <h1 className="text-[14px] bg-[#FFD643] my-auto px-2 py-1 rounded">
                View Details
              </h1>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ExperienceCard;

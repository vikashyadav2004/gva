"use client";
import Image from "next/image"; 
import React   from "react"; 

export default function UserDropdown() { 

 
 
  return (
    <div className="relative">
      <button 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src="/images/icons/user.png"
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">Musharof</span> 
      </button>
 
    </div>
  );
}

import Image from "next/image"; 
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              
              <div className="flex flex-col items-center  ">
               
                <Image src="images/logo/logo-icon.svg" alt="logo" width={40} height={40} />
                  <p className="text-[36px] text-white">GVA e.V. DSDB</p> 
                <p className="text-center text-gray-400 dark:text-white/60 max-w-2xs">
                  Powerful Admin Dashboard designed for smooth management and insights.
                </p>
              </div>
            </div>
          </div> 
        </div> 
    </div>
  );
}

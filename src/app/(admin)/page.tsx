import type { Metadata } from "next"; 
import React from "react"; 
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";  
import LatestProtections from "@/components/ecommerce/RecentOrders";
import MetricsCard from "@/components/admin/MetricsCard";

export const metadata: Metadata = {
  title:
    "GVA e.V. DSDB",
  // description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div>
      <div> 
          <MetricsCard /> 
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-5 mt-6">
        <div className="col-span-12 space-y-6 xl:col-span-6">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-6">
          <LatestProtections />
        </div>
      </div>
    </div>
  );
}

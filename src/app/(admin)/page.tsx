import type { Metadata } from "next"; 
import React from "react"; 
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";  
import LatestProtections from "@/components/ecommerce/RecentOrders";
import MetricsCard from "@/components/admin/MetricsCard";
import { getOrganizations } from "@/server/data/organization.data";
import { getUsers } from "@/server/data/user.data";
import { getProtections } from "@/server/data/Protections";
import { getRightHolders } from "@/server/data/getRightHolders";
import OrganizationTimelineChart from "@/components/ecommerce/MonthlySalesChart";

export const metadata: Metadata = {
  title:
    "GVA e.V. DSDB",
  // description: "This is Next.js Home for TailAdmin Dashboard Template",
};


export default async function Ecommerce() {
   const orgs = await getOrganizations(); 
  //  const orgs = await getOrganizations(); 
       const User = await getUsers(); 
       const protection = await getProtections(); 
       const rightHolders = await getRightHolders();  
  
  return (
    <div>
      <div> 
          <MetricsCard  orgs={orgs.length} protections={protection.length} rightHolders={rightHolders.length} users={User.length}/> 
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-5 mt-6">
        <div className="col-span-12 space-y-6 xl:col-span-6">
          <OrganizationTimelineChart  organizations={orgs}/>
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-6">
          <LatestProtections orgs={orgs}/>
        </div>
      </div>
    </div>
  );
}

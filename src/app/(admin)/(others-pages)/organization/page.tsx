// "use client"
import React from "react";
import { getOrganizations } from "@/server/data/organization.data";
import OrganizationsTable from "@/components/orgnization/OrgnizationsTable";
import CreateOrganizations from "@/components/CustomeForms/CreateOrganizations"; 
const OrganizationPage = async () => {
    const orgs = await getOrganizations();
    return (
        <> 
            <div className="p-6">
                <div className="flex justify-between gap-x-3 flex-wrap gap-y-5 items-center mb-8">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Organizations
                    </h1>
                    <CreateOrganizations />
                </div>
            </div>
            <OrganizationsTable orgs={orgs} /> 
        </>
    );
};

export default OrganizationPage;

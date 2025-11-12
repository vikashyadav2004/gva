import UsersData from '@/components/User/Userdata';
import React from 'react';
import { getOrganizations } from "@/server/data/organization.data";
import { getUsers } from "@/server/data/user.data";


const page = async() => {
    const orgData = await getOrganizations();
    const userData = await getUsers(); 
  return (
    <div>
      <UsersData organizations={orgData} users={userData}/>
    </div>
  );
}

export default page;

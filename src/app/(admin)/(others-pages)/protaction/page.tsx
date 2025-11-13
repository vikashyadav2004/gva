import CreateProtection from '@/components/Protection/CreateProtection';
import ProtectionTable from '@/components/Protection/ProtectionTable';
import { getRightHolders } from '@/server/data/getRightHolders';
import { getOrganizations } from '@/server/data/organization.data';
import { getProtections } from '@/server/data/Protections';
import { getUsers } from '@/server/data/user.data';
import React from 'react';

const page = async() => {
   const orgs = await getOrganizations();
   const user = await getUsers();
   const RightHolders = await getRightHolders();
   const Protections = await getProtections();
  return (
    <div>
      <CreateProtection organizations={orgs} rightHolders={RightHolders} users={user}/>
      <ProtectionTable   protections={Protections} />
    </div>
  );
}

export default page;

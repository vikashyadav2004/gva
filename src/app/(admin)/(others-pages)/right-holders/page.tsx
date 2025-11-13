import CreateRightHolder from '@/components/RightHolder/CreateRightHolder';
import RightHolderTable from '@/components/RightHolder/RightHolderTable';
import { getRightHolders } from '@/server/data/getRightHolders';
import { getOrganizations } from '@/server/data/organization.data';
import { getUsers } from '@/server/data/user.data';
import React from 'react';

const page = async() => {
  const orgs = await getOrganizations();
  const user = await getUsers();
  const RightHolders = await getRightHolders();
  return (
    <div>
       <CreateRightHolder users={user} organizations={orgs} /> 
      <RightHolderTable data={RightHolders} />
    </div>
  );
}

export default page;

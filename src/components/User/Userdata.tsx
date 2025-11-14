"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";
import { PlusIcon } from "@/icons";
import { Modal } from "../ui/modal";
import CreateUsers from "../CustomeForms/CreateUsers";
import Select from "../form/Select";
import ActionMenu from "../ui/popover/ActionMenu";
import { getOrgNameById } from "@/server/data/conversion";

interface Organization {
  _id: string;
  adminUserId?: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "ORG_ADMIN" | "USER" | "SUPER_ADMIN";
  organizationId?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrganizationListProps {
  organizations: Organization[];
  users: User[];
}

const UsersData: React.FC<OrganizationListProps> = ({ organizations, users }) => {
  const [isOpen, setisOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [orgNames, setOrgNames] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadOrgNames() {
      const nameMap: Record<string, string> = {};

      for (const user of users) {
        if (user.organizationId && !nameMap[user.organizationId]) {
          const orgName = await getOrgNameById(user.organizationId);
          nameMap[user.organizationId] = orgName || "_";
        }
      }

      setOrgNames(nameMap);
    }

    loadOrgNames();
  }, [users]);

  const filteredUsers=
    selectedOrg === ""
      ? users
      : users.filter((u) => u.organizationId === selectedOrg);

  return (
    <>
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Users
        </h1>

        <div className="flex flex-1 gap-3 items-center">
          <Select
            className="w-full max-w-md"
            options={[
              { value: "", label: "All Organizations" },
              ...organizations.map((org) => ({
                value: String(org._id),
                label: org.name,
              })),
            ]}
            placeholder="Filter by Organization"
            onChange={setSelectedOrg}
            defaultValue=""
          />

          <Button
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white shadow-md px-4 py-2 rounded-lg"
            onClick={() => setisOpen(true)}
          >
            <PlusIcon />
            Add User
          </Button>
        </div>
      </div>

      {/* Table Wrapper */}
         {filteredUsers.length === 0 ?  
              <div  
                  className="flex justify-center w-full py-4 rounded bg-white"
                >
                  No users found 
              </div>:
      <div className="overflow-auto border min-h[500px] border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-900">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Organization
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Name
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Role
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </TableCell>
              <TableCell isHeader className="px-6 py-3 text-start text-sm font-semibold text-gray-700 dark:text-gray-300">
                Updated At
              </TableCell>
              <TableCell isHeader className="px-6 py-3  text-sm font-semibold text-gray-700 dark:text-gray-300 text-right">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader> 
          <TableBody>

            {filteredUsers?.map((user, index) => {
              if (user.role === "SUPER_ADMIN") return null;

              return (
                <TableRow
                  key={user._id}
                  className={`transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-transparent"
                      : "bg-gray-50 dark:bg-white/[0.05]"
                  } hover:bg-gray-100 dark:hover:bg-gray-800/50`}
                >
                  <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {orgNames[user.organizationId ?? ""] ?? "_"}
                  </TableCell>

                  <TableCell className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {user.email}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300 capitalize">
                    {user.role.replace("_", " ").toLowerCase()}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    {user.isActive ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-md">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                        Inactive
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <ActionMenu type="USER" data={user} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
           }

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={() => {}} className="lg:min-w-2xl">
        <CreateUsers onClose={() => setisOpen(false)} organization={organizations} />
      </Modal>
    </>
  );
};

export default UsersData;

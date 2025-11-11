"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Cookies from "js-cookie";

interface Organization {
  _id: string;
  name: string;
  code: string;
  adminUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationsTableProps {
  orgs: Organization[];
  onRefresh?: () => void; // Optional callback to refresh org list after admin assigned
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({ orgs, onRefresh }) => {
  const [openOrgId, setOpenOrgId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openOrgId) return;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const token = Cookies.get("gva_token");

      const res = await fetch(`/api/organizations/${openOrgId}/assign-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to assign admin");
        setLoading(false);
        return;
      }

      setSuccessMsg("Admin assigned successfully!");
      if (onRefresh) onRefresh();

      // Close modal after short delay
      setTimeout(() => {
        setOpenOrgId(null);
        setName("");
        setEmail("");
        setPassword("");
      }, 1200);
    } catch (error) {
      console.error("Assign Admin Error:", error);
      setErrorMsg("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-2xl overflow-auto">
      <Table>
        {/* ✅ Table Header */}
        <TableHeader className="bg-gray-50 dark:bg-white/[0.04] border-b border-gray-200 dark:border-gray-800">
          <TableRow>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Name
            </TableCell>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Organization Code
            </TableCell>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Admin User
            </TableCell>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400">
              Updated At
            </TableCell>
            <TableCell isHeader className="px-5 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 text-right">
              Actions
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* ✅ Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {orgs.map((org, index) => (
            <TableRow
              key={org._id}
              className={`transition-colors ${
                index % 2 === 0
                  ? "bg-white dark:bg-transparent"
                  : "bg-gray-50/50 dark:bg-white/[0.02]"
              } hover:bg-gray-100/60 dark:hover:bg-white/[0.05]`}
            >
              <TableCell className="px-5 py-4 text-gray-800 font-medium dark:text-white/90">
                {org.name}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {org.code}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {org.adminUserId ?? "_"}
              </TableCell>
              <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                {new Date(org.updatedAt || org.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="px-5 py-4 text-right">
                <button
                  onClick={() => setOpenOrgId(org._id)}
                  className="p-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Assign Admin
                </button>
              </TableCell>
            </TableRow>
          ))}

          {/* ✅ Empty State */}
          {orgs.length === 0 && (
            <TableRow>
              <TableCell
                className="text-center py-6 text-gray-500 text-sm dark:text-gray-400"
              >
                No organizations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Assign Admin Modal */}
      <Modal isOpen={!!openOrgId} onClose={() => setOpenOrgId(null)} className="lg:min-w-[600px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10">
          <button
            onClick={() => setOpenOrgId(null)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <h4 className="text-lg font-medium mb-6 text-gray-800 dark:text-white/90">
            Assign Admin to Organization
          </h4>

          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-500 text-sm mb-2">{successMsg}</p>}

          <form onSubmit={handleAssign}>
            <div className="space-y-5">
              <div>
                <Label>Admin Name</Label>
                <Input
                  type="text"
                  placeholder="Enter admin name" 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter admin email" 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password" 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpenOrgId(null)}
                className="px-4 py-3 text-sm rounded-lg bg-white text-gray-700 ring-1 ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-3 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300"
              >
                {loading ? "Assigning..." : "Assign Admin"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default OrganizationsTable;

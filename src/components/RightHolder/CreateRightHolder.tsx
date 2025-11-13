"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { IUser } from "@/app/models/User"; // ⭐ full user schema

interface RightHolderFormProps {
  organizations: { _id: string; name: string }[];
  users: IUser[];              // ⭐ FULL USER OBJECT
  onSuccess?: () => void;
}

export default function CreateRightHolder({
  organizations,
  users,
  onSuccess,
}: RightHolderFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [createdByUserId, setCreatedByUserId] = useState("");

  const [orgUsers, setOrgUsers] = useState<IUser[]>([]); // ⭐ Filtered user list

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Filter users when organization changes
  useEffect(() => {
    if (!organizationId) {
      setOrgUsers([]);
      setCreatedByUserId("");
      return;
    }

    const filtered = users.filter(
      (u) =>
        u.organizationId &&
        String(u.organizationId) === String(organizationId)
    );

    setOrgUsers(filtered);
  }, [organizationId, users]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = Cookies.get("gva_token");

      const fd = new FormData();
      fd.append("name", name);
      fd.append("organizationId", organizationId);
      fd.append("createdByUserId", createdByUserId); // ⭐ CORRECT USER ID

      const res = await fetch("/api/rightholders", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to create right holder");
        setLoading(false);
        return;
      }

      if (onSuccess) onSuccess();

      // reset
      setOpen(false);
      setName("");
      setOrganizationId("");
      setCreatedByUserId("");
      setOrgUsers([]);
    } catch (err) {
      console.log(err);
      setErrorMsg("Server Error");
    }

    setLoading(false);
  };

  return (
    <>
      {/* HEADER + BUTTON */}
      <div className="flex justify-between items-center gap-3 flex-wrap my-7">
        <h2>Right Holder</h2>

        <Button
          onClick={() => setOpen(true)}
          className="bg-brand-500 text-white px-4 py-2 rounded-lg"
        >
          + Create Right Holder
        </Button>
      </div>

      {/* MODAL */}
      <Modal isOpen={open} onClose={() => setOpen(false)} className="lg:min-w-[700px]">
        <div className="relative w-full bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-10">

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold mb-6">Create Right Holder</h3>

          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME INPUT */}
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Right holder name"
                onChange={(e) => setName(e.target.value)}
                className="h-11 w-full" 
              />
            </div>

            {/* ORGANIZATION DROPDOWN */}
            <div>
              <Label>Organization</Label>
              <select
                className="h-11 w-full border px-3 rounded-lg dark:bg-gray-800"
                required
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              >
                <option value="">-- Select Organization --</option>

                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* USER DROPDOWN (FILTERED BY ORG) */}
            <div>
              <Label>Select User</Label>

              <select
                disabled={orgUsers.length === 0}
                className="h-11 w-full border px-3 rounded-lg dark:bg-gray-800 disabled:opacity-60"
                required
                value={createdByUserId}
                onChange={(e) => setCreatedByUserId(e.target.value)}
              >
                <option value="">-- Select User --</option>

                {orgUsers.map((user) => (
                  <option key={user._id.toString()} value={user._id.toString()}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>

              {organizationId && orgUsers.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No users found for this organization.
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white"
              >
                {loading ? "Saving..." : "Save Right Holder"}
              </button>
            </div>

          </form>
        </div>
      </Modal>
    </>
  );
}

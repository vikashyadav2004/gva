"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";

import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface CreateProtectionProps {
  organizations: { _id: string; name: string }[];
  rightHolders: { _id: string; name: string; organizationId: string }[];
  users: { _id: string; name: string; organizationId: string }[];
  onSuccess?: () => void;
}

export default function CreateProtection({
  organizations,
  rightHolders,
  users,
  onSuccess,
}: CreateProtectionProps) { 
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [protectionType, setProtectionType] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [rightHolderId, setRightHolderId] = useState("");
  const [createdByUserId, setCreatedByUserId] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const token = Cookies.get("gva_token");

      const fd = new FormData();
      fd.append("title", title);
      fd.append("protectionType", protectionType);
      fd.append("organizationId", organizationId);
      fd.append("rightHolderId", rightHolderId);
      fd.append("createdByUserId", createdByUserId);

      const res = await fetch("/api/protections", {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to create Protection");
      } else {
        if (onSuccess) onSuccess();
        setOpen(false);
      }
    } catch (err) {
      setErrorMsg("Server Error");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-between items-center my-7">
        <h2>Protections</h2>

        <Button onClick={() => setOpen(true)} className="bg-brand-500 text-white">
          + Create Protection
        </Button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="lg:min-w-[700px]">
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-10">

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full"
          >
            ✕
          </button>

          <h3 className="text-xl font-semibold mb-6">Create Protection</h3>

          {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Title</Label>
              <Input
                type="text"
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Protection Type</Label>
              <Input
                type="text"
                placeholder="Enter type"
                onChange={(e) => setProtectionType(e.target.value)}
              />
            </div>

            <div>
              <Label>Organization</Label>
              <select
                className="border rounded-lg px-3 h-11 w-full"
                onChange={(e) => setOrganizationId(e.target.value)}
              >
                <option value="">-- Select Organization --</option>
                {organizations.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Right Holder</Label>
              <select
                className="border rounded-lg px-3 h-11 w-full"
                onChange={(e) => setRightHolderId(e.target.value)}
              >
                <option value="">-- Select Holder --</option>
                {rightHolders.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Created By User</Label>
              <select
                className="border rounded-lg px-3 h-11 w-full"
                onChange={(e) => setCreatedByUserId(e.target.value)}
              >
                <option value="">-- Select User --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white"
              >
                {loading ? "Saving..." : "Save Protection"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

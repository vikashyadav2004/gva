"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

export default function CreateProtection({ organizations, users, rightHolders, onSuccess }: any) {
  const [open, setOpen] = useState(false);

  const [rightHolderId, setRightHolderId] = useState("");
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");

  const [organizationId, setOrganizationId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");

  const [orgUsers, setOrgUsers] = useState([]);

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullPreview, setFullPreview] = useState(false);

  const role = Cookies.get("gva_role");
  const isSuperAdmin = role === "SUPER_ADMIN";

  // ⭐ PREVIEW IMAGE
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!isSuperAdmin) return;

    if (!organizationId) {
      setOrgUsers([]);
      return;
    }

    const filtered = users.filter(
      (u: any) => String(u.organizationId) === String(organizationId)
    );

    setOrgUsers(filtered);
  }, [organizationId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = Cookies.get("gva_token");

    const fd = new FormData();
    fd.append("rightHolderId", rightHolderId);
    fd.append("type", type);
    fd.append("title", title);

    fd.append("image", image as Blob);

    fd.append("organizationId", isSuperAdmin ? organizationId : "");
    fd.append("assignedUserId", isSuperAdmin ? assignedUserId : "");

    const res = await fetch("/api/protections", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }

    onSuccess?.();
    setOpen(false);
       setTimeout(() => window.location.reload(), 10);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-7">
        <h2>Protections</h2>
        <Button className="bg-brand-500 text-white" onClick={() => setOpen(true)}>
        + Create Protection
      </Button>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="lg:min-w-[700px]">
        <div className="p-6">

          <h2 className="text-xl font-semibold mb-4">Create Protection</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label>Right Holder</Label>
              <select
                className="border p-2 rounded w-full"
                required
                onChange={(e) => setRightHolderId(e.target.value)}
              >
                <option value="">Select Right Holder</option>
                {rightHolders.map((rh: any) => (
                  <option key={rh._id} value={rh._id}>{rh.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Type</Label>
              <Input  onChange={(e) => setType(e.target.value)} />
            </div>

            <div>
              <Label>Title</Label>
              <Input  onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* ⭐ Image Upload */}
            <div>
              <Label>Upload Image</Label>
              <input type="file" accept="image/*" required onChange={handleImageChange} />

              {previewUrl && (
                <div className="mt-3">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded cursor-pointer border"
                    onClick={() => setFullPreview(true)}
                  />
                </div>
              )}
            </div>

            {/* ⭐ FULL SIZE PREVIEW MODAL */}
            <Modal isOpen={fullPreview} onClose={() => setFullPreview(false)}>
              <div className="p-6">
                <img src={previewUrl!} className="w-full rounded" />
              </div>
            </Modal>

            {isSuperAdmin && (
              <>
                <div>
                  <Label>Organization</Label>
                  <select
                    className="border p-2 rounded w-full"
                    required
                    onChange={(e) => setOrganizationId(e.target.value)}
                  >
                    <option value="">Select Organization</option>
                    {organizations.map((o: any) => (
                      <option key={o._id} value={o._id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Assign To User</Label>
                  <select
                    className="border p-2 rounded w-full"
                    required
                    onChange={(e) => setAssignedUserId(e.target.value)}
                  >
                    <option value="">Select User</option>
                    {orgUsers.map((u: any) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="bg-brand-500 text-white">
                Save
              </Button>
            </div>

          </form>
        </div>
      </Modal>
    </>
  );
}

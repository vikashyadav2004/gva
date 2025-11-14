"use client";

import { MoreDotIcon, PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Modal } from "../modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface ActionMenuProps {
  data: any;
  type: "ORG" | "USER" | "PROTECTION" | "RIGHTHOLDER";
}

const ActionMenu: React.FC<ActionMenuProps> = ({ data, type }) => {
   
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(data);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Protection image
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  /* --------------------------------------------------------
      CLOSE DROPDOWN
  ----------------------------------------------------------- */
  useEffect(() => {
    const handler = (e: any) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* --------------------------------------------------------
      DELETE HANDLER BY TYPE
  ----------------------------------------------------------- */
  const handleDelete = async () => {
    try {
      const token = Cookies.get("gva_token");

      let url = "";
      if (type === "ORG") url = `/api/organizations?id=${data._id}`;
      else if (type === "USER") url = `/api/users/create?id=${data._id}`;
      else if (type === "PROTECTION") url = `/api/protections?id=${data._id}`;
      else if (type === "RIGHTHOLDER") url = `/api/rightholders?id=${data._id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      await res.json();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  /* --------------------------------------------------------
      UPDATE ORG
  ----------------------------------------------------------- */
  const updateOrg = async () => {
    const token = Cookies.get("gva_token");

    const res = await fetch(`/api/organizations?id=${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        name: editData.name,
        code: editData.code,
      }),
    });

    return { ok: res.ok, response: await res.json() };
  };

  /* --------------------------------------------------------
      UPDATE USER
  ----------------------------------------------------------- */
  const updateUser = async () => {
    const token = Cookies.get("gva_token");

    const  body: any = {
      name: editData.name,
      email: editData.email,
      role: editData.role,
    };

    if (editData.password) body.password = editData.password;

    const res = await fetch(`/api/users/create?id=${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    return { ok: res.ok, response: await res.json() };
  };

  /* --------------------------------------------------------
      UPDATE PROTECTION
  ----------------------------------------------------------- */
  const updateProtection = async () => {
    const token = Cookies.get("gva_token");

    const fd = new FormData();
    fd.append("title", editData.title);
    fd.append("type", editData.type);
    fd.append("rightHolderId", editData.rightHolderId?._id || editData.rightHolderId);

    if (newImage) fd.append("image", newImage);

    const res = await fetch(`/api/protections?id=${data._id}`, {
      method: "PUT",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      body: fd,
    });

    return { ok: res.ok, response: await res.json() };
  };

  /* --------------------------------------------------------
      UPDATE RIGHTHOLDER
  ----------------------------------------------------------- */
  const updateRightHolder = async () => {
    const token = Cookies.get("gva_token");

    const fd = new FormData();
    fd.append("name", editData.name);

    // organizationId can be null or id
    fd.append(
      "organizationId",
      editData.organizationId?._id || editData.organizationId || ""
    );

    const res = await fetch(`/api/rightholders?id=${data._id}`, {
      method: "PUT",
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      body: fd,
    });

    return { ok: res.ok, response: await res.json() };
  };

  /* --------------------------------------------------------
      SUBMIT HANDLER
  ----------------------------------------------------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    let result;

    if (type === "ORG") result = await updateOrg();
    else if (type === "USER") result = await updateUser();
    else if (type === "PROTECTION") result = await updateProtection();
    else result = await updateRightHolder();

    if (!result.ok) setMsg(result.response.message || "Update failed");
    else {
      setMsg("Updated successfully!");
      setTimeout(() => window.location.reload(), 800);
    }

    setLoading(false);
  };

  /* --------------------------------------------------------
      UI
  ----------------------------------------------------------- */
  return (
    <>
      {/* BUTTON */}
      <div ref={menuRef} className="relative inline-block">
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg">
          <MoreDotIcon />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-xl z-50">
            <button
              onClick={() => {
                setOpen(false);
                setEditModal(true);
              }}
              className="flex w-full gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <PencilIcon className="text-gray-500" /> Edit
            </button>

            <button
              onClick={() => {
                setOpen(false);
                handleDelete();
              }}
              className="flex w-full gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <TrashBinIcon className="text-gray-500" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} className="lg:min-w-[600px]">
        <div className="relative bg-white rounded-3xl p-6 lg:p-10">

          <button
            onClick={() => setEditModal(false)}
            className="absolute right-3 top-3 text-gray-500"
          >
            ✕
          </button>

          <h4 className="text-lg font-medium mb-6 text-left">
            Edit{" "}
            {type === "ORG"
              ? "Organization"
              : type === "USER"
              ? "User"
              : type === "RIGHTHOLDER"
              ? "Right Holder"
              : "Protection"}
          </h4>

          {msg && (
            <p className={`text-sm mb-2 ${msg.includes("success") ? "text-green-500" : "text-red-500"}`}>
              {msg}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {/* --------------------------------------------------
                ORG / USER / PROTECTION / RIGHTHOLDER FIELDS
            --------------------------------------------------- */}

            {/* NAME / TITLE */}
            <div className="text-left">
              <Label>
                {type === "PROTECTION"
                  ? "Title"
                  : type === "RIGHTHOLDER"
                  ? "Right Holder Name"
                  : "Name"}
              </Label>

              <Input
                type="text"
                defaultValue={
                  type === "PROTECTION"
                    ? editData.title
                    : editData.name
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    [type === "PROTECTION" ? "title" : "name"]: e.target.value,
                  })
                }
              />
            </div>

            {/* ORG FIELDS */}
            {type === "ORG" && (
              <div>
                <Label>Code</Label>
                <Input
                  type="text"
                  defaultValue={editData.code}
                  onChange={(e) =>
                    setEditData({ ...editData, code: e.target.value })
                  }
                />
              </div>
            )}

            {/* USER FIELDS */}
            {type === "USER" && (
              <>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    defaultValue={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <select
                    defaultValue={editData.role}
                    className="border p-2 rounded-lg w-full"
                    onChange={(e) =>
                      setEditData({ ...editData, role: e.target.value })
                    }
                  >
                    <option value="USER">User</option>
                    <option value="ORG_ADMIN">Org Admin</option>
                  </select>
                </div>

                <div>
                  <Label>New Password (optional)</Label>
                  <Input
                    type="password"
                    onChange={(e) =>
                      setEditData({ ...editData, password: e.target.value })
                    }
                  />
                </div>
              </>
            )}

            {/* RIGHTHOLDER FIELDS */}
            {type === "RIGHTHOLDER" && (
              <>
                <div>
                  <Label>Organization ID (optional)</Label>
                  <Input
                    type="text"
                    defaultValue={
                      editData.organizationId?._id || editData.organizationId || ""
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        organizationId: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}

            {/* PROTECTION FIELDS */}
            {type === "PROTECTION" && (
              <>
                <div>
                  <Label>Type</Label>
                  <Input
                    type="text"
                    defaultValue={editData.type}
                    onChange={(e) =>
                      setEditData({ ...editData, type: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Image</Label>

                  {previewImage || editData.imageUrl ? (
                    <img
                      src={previewImage || editData.imageUrl}
                      className="h-32 w-32 object-cover rounded border"
                    />
                  ) : null}

                  <input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewImage(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="px-4 py-3 rounded-lg bg-gray-200"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-3 rounded-lg bg-brand-500 text-white"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ActionMenu;

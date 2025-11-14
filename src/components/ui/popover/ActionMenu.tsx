"use client";

import { MoreDotIcon, PencilIcon, TrashBinIcon } from "@/icons";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Modal } from "../modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";

interface ActionMenuProps {
  data: any; // user, org, or rightholder object
  type: "USER" | "ORG" | "RIGHTHOLDER" |""; // ⭐ ADDED RIGHTHOLDER
  disable?: string | null;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  disable = null,
  type,
  data,
}) => {
  console.log(disable,"disable");
  
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  // CLOSE DROPDOWN WHEN CLICK OUTSIDE  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DELETE HANDLER (COMMON FOR USER, ORG, RIGHTHOLDER)
  const handleDelete = async () => {
    try {
      const token = Cookies.get("gva_token");

      let url = "";
      if (type === "RIGHTHOLDER") url = `/api/rightholders/${data._id}`;
      if (type === "USER") url = `/api/users/${data._id}`;
      if (type === "ORG") url = `/api/organizations/${data._id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) {
        alert("Failed to delete!");
        return;
      }

      alert("Deleted Successfully!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      
      alert("Server Error");
    }
  };

  return (
    <>
      {/* MENU BUTTON */}
      <div ref={menuRef} className="relative inline-block text-left">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-lg text-sm text-black"
        >
          <MoreDotIcon />
        </button>

        {/* DROPDOWN MENU */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-200 z-50">
            <div className="py-2 text-sm text-gray-700">
              
              {/* DELETE */}
              <button
                onClick={() => {
                  setOpen(false);
                  handleDelete();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <TrashBinIcon className="text-gray-500" />
                Delete
              </button>

              {/* EDIT */}
              <button
                onClick={() => {
                  setOpen(false);
                  setEditModal(true);
                  setEditData(data);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <PencilIcon className="text-gray-500" />
                Edit
              </button>

            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          RIGHTHOLDER EDIT MODAL
         ======================================================== */}
      {type === "RIGHTHOLDER" && (
        <Modal isOpen={editModal} onClose={() => setEditModal(false)} className="lg:min-w-[600px]">
          <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10 text-start">

            <button
              onClick={() => setEditModal(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h4 className="text-lg font-medium mb-6">Edit Right Holder</h4>

            {updateError && <p className="text-red-500 text-sm mb-2">{updateError}</p>}
            {updateSuccess && <p className="text-green-500 text-sm mb-2">{updateSuccess}</p>}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setUpdateLoading(true);
                setUpdateError("");
                setUpdateSuccess("");

                try {
                  const token = Cookies.get("gva_token");

                  const fd = new FormData();
                  fd.append("name", editData.name);
                  fd.append("organizationId", editData.organizationId);

                  const res = await fetch(`/api/rightholders/${editData._id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: fd,
                  });

                  const response = await res.json();

                  if (!res.ok) {
                    setUpdateError(response.message || "Update failed");
                  } else {
                    setUpdateSuccess("Updated successfully!");

                    setTimeout(() => {
                      setEditModal(false);
                      window.location.reload();
                    }, 1000);
                  }
                } catch (err) {
                  console.log(err);
                  
                  setUpdateError("Server error");
                }

                setUpdateLoading(false);
              }}
            >
              <div className="space-y-5">

                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    defaultValue={editData?.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Organization</Label>
                  <Input
                    type="text"
                    defaultValue={editData?.organizationId}
                    onChange={(e) =>
                      setEditData({ ...editData, organizationId: e.target.value })
                    }
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-3 text-sm rounded-lg bg-white text-gray-700 ring-1 ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-3 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300"
                >
                  {updateLoading ? "Updating..." : "Update"}
                </button>
              </div>

            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================
          USER EDIT MODAL (YOUR EXISTING CODE — NOT MODIFIED)
         ======================================================== */}
      {type === "USER" && (
        <Modal isOpen={editModal} onClose={() => setEditModal(false)} className="lg:min-w-[600px]">
          <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10 text-start">
            <button
              onClick={() => setEditModal(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h4 className="text-lg font-medium mb-6 text-gray-800 dark:text-white/90">
              Edit User
            </h4>

            {updateError && <p className="text-red-500 text-sm mb-2">{updateError}</p>}
            {updateSuccess && <p className="text-green-500 text-sm mb-2">{updateSuccess}</p>}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setUpdateLoading(true);
                setUpdateError("");
                setUpdateSuccess("");

                try {
                  const token = Cookies.get("gva_token");

                  const res = await fetch(`/api/users/${editData._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify(editData),
                  });

                  const response = await res.json();

                  if (!res.ok) {
                    setUpdateError(response.message || "Update failed");
                  } else {
                    setUpdateSuccess("User updated successfully!");

                    setTimeout(() => {
                      setEditModal(false);
                    }, 1000);
                  }
                } catch (error) {
                  console.log(error);
                  
                  setUpdateError("Server error");
                }

                setUpdateLoading(false);
              }}
            >
              <div className="space-y-5">
                <div>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    defaultValue={editData?.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    defaultValue={editData?.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Role</Label>
                  <Select
                    className="w-full"
                    defaultValue={editData?.role}
                    options={[
                      { value: "ORG_ADMIN", label: "Org Admin" },
                      { value: "USER", label: "User" },
                    ]}
                    onChange={(val) => setEditData({ ...editData, role: val })}
                    placeholder="Select role"
                  />
                </div>

                <div>
                  <Label>New Password (optional)</Label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-4 py-3 text-sm rounded-lg bg-white text-gray-700 ring-1 ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-3 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300"
                >
                  {updateLoading ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

    </>
  );
};

export default ActionMenu;

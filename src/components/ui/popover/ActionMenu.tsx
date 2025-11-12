"use client";
import { MoreDotIcon, PencilIcon, TrashBinIcon, UserIcon } from "@/icons";
import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Modal } from "../modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface ActionMenuProps {
  onEditProfile?: () => void;
  onSettings?: () => void;
  onSupport?: () => void;
  globleId?: string;
  disable?:string|null
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  onEditProfile,
  onSettings,
  onSupport,
  globleId,
  disable=null
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // ✅ Modal open/close state
  const [openOrgId, setOpenOrgId] = useState<string | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log(disable,"disable");
  

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ✅ API call
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

      // close modal after success
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
    <>
      <div ref={menuRef} className="relative inline-block text-left">
        {/* Trigger Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-lg text-sm text-black"
        >
          <MoreDotIcon />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-200 z-50">
            <div className="py-2 text-sm text-gray-700">
              {/* ✅ When clicked → open modal */}
              <button
                onClick={() => {
                  setOpen(false);
                  setOpenOrgId(globleId || ""); // Open the modal with this org ID
                }}
                disabled={disable!=null}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 ${disable!=null&&"cursor-not-allowed opacity-60"}`}
              >
                <UserIcon className="text-gray-500" />
                Assign Admin
              </button>

                <button
                onClick={() => {
                  onSettings?.();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
              >
                <TrashBinIcon className="text-gray-500" />
                Delete
              </button>

              <button
                onClick={() => {
                  onSupport?.();
                  setOpen(false);
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

      {/* ✅ Assign Admin Modal */}
      <Modal isOpen={!!openOrgId} onClose={() => setOpenOrgId(null)} className="lg:min-w-[600px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10 text-start">
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
    </>
  );
};

export default ActionMenu;

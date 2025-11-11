"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import Cookies from "js-cookie";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface CreateOrganizationsProps {
  onSuccess?: () => void; // optional callback to refresh list after create
}

const CreateOrganizations: React.FC<CreateOrganizationsProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const token = Cookies.get("gva_token");

      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Failed to create organization");
        setLoading(false);
        return;
      }

      // ✅ success
      if (onSuccess){ 
        onSuccess();}
      setOpen(false);
      setName("");
      setCode("");
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ✅ Create Org Button */}
      <Button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
      >
        <span className="text-white">
          <Building2 />
        </span>
        Create Organization
      </Button>

      {/* ✅ Modal Popup */}
      <Modal isOpen={open} onClose={() => setOpen(false)} className="lg:min-w-[700px]">
        <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            type="button"
            className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            ✕
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 w-full">
              Organization Information
            </h4>

            {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

            <div className="space-y-5">
              <div>
                <Label>Organization Name</Label>
                <Input
                  type="text"
                  placeholder="Enter organization name" 
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>

              <div>
                <Label>Organization Code</Label>
                <Input
                  type="text"
                  placeholder="Unique code (eg: GVA01)" 
                  onChange={(e) => setCode(e.target.value)}
                  className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-3 text-sm rounded-lg bg-white text-gray-700 ring-1 ring-gray-300 dark:bg-gray-800 dark:text-gray-400"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-3 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300"
              >
                {loading ? "Saving..." : "Save Organization"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateOrganizations;

import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";

interface Organization {
  _id: string;
  name: string;
}

interface ModalProps {
  onClose: () => void;
  organization: Organization[];
}

const CreateUsers: React.FC<ModalProps> = ({ onClose, organization }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgId, setOrgId] = useState<string>("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (!name || !email || !password || !orgId || !role) {
      setErrorMsg("Please fill all required fields");
      return;
    }

    setErrorMsg(""); 
    setLoading(true);

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          organizationId: orgId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Error creating user");
      } else {  
        onClose();
      }
    } catch (error) {
      setErrorMsg("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 w-full">
            User Information
          </h4>

          {/* ⚠️ Validation Message */}
          {errorMsg && (
            <div className="mb-4 text-sm text-red-500 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="John Doe" 
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="john@gmail.com" 
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="********" 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Label>Assign Organization</Label>
              <Select
                className="w-full"
                options={[
                  { value: "", label: "Select Organization" },
                  ...organization.map((org) => ({
                    value: org._id,
                    label: org.name,
                  })),
                ]}
                onChange={(v: any) => setOrgId(v)}
                placeholder="Assign Organization"
              />
            </div>

            <div>
              <Label>Assign Role</Label>
              <Select
                className="w-full"
                options={[
                  { value: "", label: "Select Role" },
                  { value: "ORG_ADMIN", label: "Org Admin" },
                  { value: "USER", label: "User" },
                ]}
                onChange={(v: any) => setRole(v)}
                placeholder="Select Role"
              />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-brand-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUsers;

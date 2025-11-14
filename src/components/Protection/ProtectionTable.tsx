"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import ActionMenu from "@/components/ui/popover/ActionMenu";
import { Modal } from "@/components/ui/modal";

interface Protection {
  _id: string;
  title: string;
  type: string;
  imageUrl: string;
  rightHolderId: { _id: string; name: string } | null;
  organizationId: { _id: string; name: string } | null;
  assignedUserId: { _id: string; name: string } | null;
  updatedAt: string;
}

export default function ProtectionTable({ data }: { data: Protection[] }) {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  if (!data || data.length === 0) {
    return (
      <p className="text-center py-4 bg-white rounded-xl">
        No Protections Found
      </p>
    );
  }

  return (
    <>
      <div className="border rounded-2xl overflow-auto min-h-[500px] bg-white dark:bg-gray-900">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-5 text-start py-3">Image</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Title</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Type</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Right Holder</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Organization</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Assigned User</TableCell>
              <TableCell isHeader className="px-5 text-start py-3">Updated At</TableCell>
              <TableCell isHeader className="px-5 py-3 text-right">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((prot, index) => (
              <TableRow
                key={prot._id}
                className={
                  index % 2 === 0 ? "bg-white" : "bg-gray-50 dark:bg-gray-800"
                }
              >
                {/* IMAGE Thumbnail */}
                <TableCell className="px-5 py-4">
                  {prot.imageUrl ? (
                    <img
                      src={prot.imageUrl}
                      className="h-14 w-14 object-cover rounded cursor-pointer border"
                      onClick={() => setPreviewImg(prot.imageUrl)}
                    />
                  ) : (
                    <span>—</span>
                  )}
                </TableCell>

                <TableCell className="px-5 py-4">{prot.title}</TableCell>
                <TableCell className="px-5 py-4">{prot.type}</TableCell>

                {/* Right Holder */}
                <TableCell className="px-5 py-4">
                  {prot.rightHolderId?.name?? "—"}
                </TableCell>

                {/* Organization */}
                <TableCell className="px-5 py-4">
                  {prot.organizationId?.name ?? "—"}
                </TableCell>

                {/* Assigned User */}
                <TableCell className="px-5 py-4">
                  {prot.assignedUserId?.name ?? "—"}
                </TableCell>

                <TableCell className="px-5 py-4">
                  {new Date(prot.updatedAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="px-5 py-4 text-right">
                  <ActionMenu
                    type="PROTECTION"
                    data={prot} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* FULL IMAGE PREVIEW MODAL */}
      <Modal isOpen={!!previewImg} onClose={() => setPreviewImg(null)} className="lg:min-w-[800px]">
        <div className="p-6">
          <img src={previewImg!} className="w-full rounded-lg shadow-lg" />
        </div>
      </Modal>
    </>
  );
}

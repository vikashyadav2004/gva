import {
  getUserNameById,
  getOrgNameById,
  getRightHolderNameById,
} from "@/server/data/conversion";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionMenu from "@/components/ui/popover/ActionMenu";

interface Protection {
  _id: string;
  title: string;
  protectionType: string;
  rightHolderId: string;
  organizationId: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export default async function ProtectionTable({
  protections,
}: {
  protections: Protection[];
}) {
  const userNames: Record<string, string> = {};
  const orgNames: Record<string, string> = {};
  const rhNames: Record<string, string> = {};

  for (const p of protections) {
    if (p.createdByUserId && !userNames[p.createdByUserId]) {
      userNames[p.createdByUserId] =
        (await getUserNameById(p.createdByUserId)) ?? "_";
    }

    if (p.organizationId && !orgNames[p.organizationId]) {
      orgNames[p.organizationId] =
        (await getOrgNameById(p.organizationId)) ?? "_";
    }

    if (p.rightHolderId && !rhNames[p.rightHolderId]) {
      rhNames[p.rightHolderId] =
        (await getRightHolderNameById(p.rightHolderId)) ?? "_";
    }
  }

  console.log(protections,"protections")

  return (
    <>
      {protections.length !== 0 ? (
        <div className="border rounded-2xl overflow-auto min-h-[500px]">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableCell isHeader className="px-5 text-start py-3">Title</TableCell>
                <TableCell isHeader className="px-5 text-start py-3">Type</TableCell>
                <TableCell isHeader className="px-5 text-start py-3">Right Holder</TableCell>
                <TableCell isHeader className="px-5 text-start py-3">Organization</TableCell>
                <TableCell isHeader className="px-5 text-start py-3">Created By</TableCell>
                <TableCell isHeader className="px-5 text-start py-3">Updated At</TableCell>
                <TableCell isHeader className="px-5 py-3 text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {protections.map((p, index) => (
                <TableRow
                  key={p._id}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50 dark:bg-gray-900"
                  }
                >
                  <TableCell className="px-5 py-4">{p.title}</TableCell>

                  <TableCell className="px-5 py-4">{p.protectionType?p.protectionType:"-"}</TableCell>

                  <TableCell className="px-5 py-4">
                    {rhNames[p.rightHolderId]}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {orgNames[p.organizationId]}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {userNames[p.createdByUserId]}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-right">
                    <ActionMenu type="" data={p} disable={p._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center py-4 bg-white rounded-xl">
          No Protections Found
        </p>
      )}
    </>
  );
}

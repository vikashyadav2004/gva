import {
  Table,
  TableBody,
  TableCell, 
  TableRow,
} from "../ui/table";

interface Organization {
  _id: string;
  name: string;
  code: string;
  adminUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrganizationsTableProps {
  orgs: Organization[];
} 
 const  LatestOrganizations: React.FC<OrganizationsTableProps> = ({ orgs }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Latest Organizations
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orgs.slice(0,5).map((item) => (
              <TableRow key={item._id}>
                <TableCell className="py-3">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white/90">
                      {item.name}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.code}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.updatedAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LatestOrganizations;
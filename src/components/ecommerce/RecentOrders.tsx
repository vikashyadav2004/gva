import {
  Table,
  TableBody,
  TableCell, 
  TableRow,
} from "../ui/table";

interface Protection {
  id: number;
  name: string; // Brand name
  category: string; // Type (Designschutz, Patent, Sonstige)
  date: string; // Date in DD.MM.YY format
}

const tableData: Protection[] = [
  { id: 1, name: "BMW", category: "Designschutz", date: "04.11.25" },
  { id: 2, name: "Mercedes-Benz", category: "Patent", date: "31.10.25" },
  { id: 3, name: "Porsche", category: "Sonstige", date: "31.10.25" },
  { id: 4, name: "Opel", category: "Sonstige", date: "27.10.25" },
  { id: 5, name: "Mercedes-Benz", category: "Designschutz", date: "04.09.25" },
];

export default function LatestProtections() {
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
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-3">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white/90">
                      {item.name}
                    </p>
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                      {item.category}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-right text-gray-500 text-theme-sm dark:text-gray-400">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

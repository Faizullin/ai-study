import React from "react";
import "./index.scss";

interface ITableProps<T> {
  data: Array<T>;
  columns: Array<{
    key: string;
    title: string;
    sortable?: boolean;
    render?: (data: T, key: string | number) => React.ReactNode;
    dangerous?: boolean;
  }>;
  // page?: number;
  // pageSize?: number;
  // rowsPerPageOptions?: Array<number>;
  // count?: number;
  // onChangePage?: (data?: any) => any;
  // onChangeRowsPerPage?: (data?: any) => any;
  // onSortingChange?: (data?: ISorting) => any;
  // sorting?: ISorting;
}

function PrimaryTable<T>({
  data,
  columns,
}: // page,
// pageSize,
// count,
// onChangePage,
// onChangeRowsPerPage,
// sorting,
// onSortingChange,
// rowsPerPageOptions,
ITableProps<T>) {
  return (
    <table className="primary-table table overflow-scroll">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={(row as any).id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
          >
            {columns.map((column, index) =>
              column.render ? (
                column.render(row, `${(row as any).id}-${column.key}`)
              ) : (
                <td
                  key={`${(row as any).id}-${column.key}-${index}`}
                  className="px-6"
                >
                  {column.dangerous ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: row[column.key] }}
                    ></div>
                  ) : (
                    row[column.key]
                  )}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default PrimaryTable;

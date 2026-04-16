export default function DataTable({ columns, data, onRowClick }) {
  if (!data.length) return (
    <div className="p-12 text-center text-gray-300 text-sm font-light">
      No records found
    </div>
  );

  return (
    <div className="w-full">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key} 
                // Increased to font-bold and text-gray-800 for a strong, clear heading
                className="px-6 py-4 text-[12px] font-bold text-gray-800 uppercase tracking-tight border-b border-gray-100 bg-gray-50/20"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr 
              key={row.id || i} 
              onClick={() => onRowClick?.(row)}
              className="group cursor-pointer transition-colors duration-150 hover:bg-blue-50/20"
            >
              {columns.map((col) => (
                <td 
                  key={col.key} 
                  className="px-6 py-4 text-sm text-gray-600 border-b border-gray-50 group-last:border-none"
                >
                  <div className="flex items-center">
                    {col.render
                      ? col.render(row[col.key], row)
                      : <span className="text-gray-500 font-normal">{row[col.key] || "—"}</span>
                    }
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

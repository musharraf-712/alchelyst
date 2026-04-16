export default function DataTable({ columns, data, onRowClick }) {
  if (!data.length) return <div className="p-4">No data</div>;

  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row,i) => (
          <tr key={row.id ? row.id : i} onClick={() => onRowClick?.(row)}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render
                  ? col.render(row[col.key], row)
                  : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
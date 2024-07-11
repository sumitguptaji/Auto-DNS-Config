import { DNSRecord, DNSRecordToAdd } from "../page"


export const CSVDataTable : React.FC<{records: DNSRecordToAdd[]}> = ({records})=>{
    return         <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
    <thead>
      <tr className="bg-gray-100">
        <th className="py-2 px-4 border-b text-left">Type</th>
        <th className="py-2 px-4 border-b text-left">Name</th>
        <th className="py-2 px-4 border-b text-left">Content</th>
        <th className="py-2 px-4 border-b text-left">TTL</th>
        <th className="py-2 px-4 border-b text-left">Proxied</th>
        <th className="py-2 px-4 border-b text-left">Priority</th>
      </tr>
    </thead>
    <tbody>
      {records.map((record) => (
        <tr key={record.name} className="hover:bg-gray-50">
          <td className="py-2 px-4 border-b">{record.type}</td>
          <td className="py-2 px-4 border-b break-words">
            {record.name}
          </td>
          <td className="py-2 px-4 border-b break-words">
            {record.content}
          </td>
          <td className="py-2 px-4 border-b">{record.ttl}</td>
          <td className="py-2 px-4 border-b">
            {record.proxied ? "Yes" : "No"}
          </td>
          <td className="py-2 px-4 border-b break-words">
            {record.priority}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
}

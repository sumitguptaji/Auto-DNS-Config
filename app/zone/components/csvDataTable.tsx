import { DNSRecord, DNSRecordToAdd } from "../page"


export const CSVDataTable : React.FC<{records: DNSRecordToAdd[] , setJsonRecords : React.Dispatch<React.SetStateAction<DNSRecordToAdd[]>> }> = ({records , setJsonRecords  })=>{
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
      {records.map((record , index ) => {
const updateValue = (value : string | number | boolean , field : string  )=>{
    const recordsCopy = [...records]
    recordsCopy[index] = {...recordsCopy[index] ,  [field]  : value}
    setJsonRecords(recordsCopy)
}

        return (
        <tr key={index} className="hover:bg-gray-50">
        <td className="py-2 px-4 border-b break-words">
        <input key="type" onChange={(e)=>updateValue(e.target.value  , "type")} value={record.type} ></input>
        </td>
        <td className="py-2 px-4 border-b break-words">
        <input key="name" onChange={(e)=>updateValue(e.target.value  , "name")} value={record.name} ></input>
        </td>
          <td className="py-2 px-4 border-b break-words">
            <input key="content" value={record.content} onChange={(e)=>updateValue(e.target.value  , "content")} ></input>
          </td>
          <td className="py-2 px-4 border-b">
          <input key="ttl" value={record.ttl} type="number" onChange={(e)=>updateValue(Number(e.target.value)  , "ttl")} ></input>
          </td>
          <td className="py-2 px-4 border-b">
          <input key="proxied" checked={record.proxied} type="checkbox" id="vehicle1" name="vehicle1" value="" onChange={(e)=>updateValue(e.target.checked , "proxied" )} />
            {/* {record.proxied ? "Yes" : "No"} */}
          </td>
          <td className="py-2 px-4 border-b break-words">
          <input key="priority" value={record.priority} onChange={(e)=>updateValue(Number(e.target.value)  , "priority")} ></input>
          </td>
        </tr>
      )})}
    </tbody>
  </table>
}

import { DNSRecord, DNSRecordToAdd } from "../page"


export const CSVDataTable : React.FC<{records: DNSRecordToAdd[] , setJsonRecords : React.Dispatch<React.SetStateAction<DNSRecordToAdd[]>> }> = ({records , setJsonRecords  })=>{
    return       <div  className=" mx-auto">
    <div  className="max-w-[97vw] overflow-x-auto" >
    <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
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
        <tr  key={index} className="hover:bg-gray-50 no-tailwind relative  h-fit ">
        <td    className="relative min-h-40    min-w-[200px] border-b p-0">
        <div className="h-14 invisible"  ></div>
        <input className="w-full  h-full p-5 px-2 m-0 absolute top-0 left-0" key="type" onChange={(e)=>updateValue(e.target.value  , "type")} value={record.type} ></input>
        </td>
        <td  className="relative min-w-[200px] border-b p-0">
        <input className="w-full p-5  h-full px-2 m-0 absolute top-0 left-0" key="name"   onChange={(e)=>updateValue(e.target.value  , "name")} value={record.name} ></input>
        </td>
        <td  className="relative min-w-[400px] border-b p-0">
  <input
    key="content"
    className="w-full h-full p-5  m-0 px-2 absolute top-0 left-0"
    value={record.content}
    onChange={(e) => updateValue(e.target.value, "content")}
  />
</td>
          <td className="relative min-w-[200px] border-b p-0" >
          <input className="w-full p-5  px-2 h-full m-0 absolute top-0 left-0" key="ttl" value={record.ttl} type="number" onChange={(e)=>updateValue(Number(e.target.value)  , "ttl")} ></input>
          </td>
          <td className=" px-4 border-b">
          <input className="p-5  h-full" key="proxied" checked={record.proxied} type="checkbox" id="vehicle1" name="vehicle1" value="" onChange={(e)=>updateValue(e.target.checked , "proxied" )} />
            {/* {record.proxied ? "Yes" : "No"} */}
          </td>
          <td className="relative min-w-[200px]  border-b p-0">
          <input className="w-full p-5  px-2 h-full m-0 absolute top-0 left-0"  key="priority" value={record.priority} onChange={(e)=>updateValue(Number(e.target.value)  , "priority")} ></input>
          </td>
        </tr>
      )})}
    </tbody>
  </table></div></div>   
}

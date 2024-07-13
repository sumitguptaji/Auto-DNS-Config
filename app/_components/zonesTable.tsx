
export interface ZoneInfo {name : string , name_servers : string[]    , status : string  }

export const ZonesTable : React.FC<{zones : ZoneInfo[]}> = ({zones})=>{

    return <div>
      <h2 className="text-xl font-semibold mb-4">Zones</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Name Servers</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone) => (
              <tr key={zone.name} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{zone.name}</td>
                <td className="py-2 px-4 border-b break-words">
                  {zone.name_servers.map(nameServer=><p key={nameServer} >{nameServer} <br/> </p>)}
                </td> 
                <td className="py-2 px-4 border-b break-words">
                  {zone.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
}



export const ZonesTableSkeleton = ()=>{

        return <div>
          <h2 className="text-xl font-semibold mb-4">Zones</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Name Servers</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[1 , 2 , 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b"><div className=" bg-gray-200 rounded-full dark:bg-gray-700 w-32 h-5"></div></td>
                    <td className="py-2 px-4 border-b break-words flex flex-col gap-2">
                      {[1 , 2].map(item=><div className=" bg-gray-200 m-0 rounded-full dark:bg-gray-700 w-80 h-5"></div> )}
                    </td> 
                    <td className="py-2 px-4 border-b break-words">
                    <div className=" bg-gray-200 rounded-full dark:bg-gray-700 w-32 h-5"></div>                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    }
    
    

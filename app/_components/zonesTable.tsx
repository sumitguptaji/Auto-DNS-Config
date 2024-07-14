import { cn } from "@/utils/tailwind-merge"
import { useEffect, useState } from "react"

export interface ZoneInfo {name : string , name_servers : string[]    , status : string  }

export const ZonesTableSkeleton = ()=>{

    return       <div className="overflow-x-auto">
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
                  {[1 , 2].map(item=><div key={item} className=" bg-gray-200 m-0 rounded-full dark:bg-gray-700 w-80 h-5"></div> )}
                </td> 
                <td className="py-2 px-4 border-b break-words">
                <div className=" bg-gray-200 rounded-full dark:bg-gray-700 w-32 h-5"></div>                    </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

}




const itemsPerPage = 6


export const ZonesTable : React.FC<{zones : ZoneInfo[] | null , loadingZones : boolean  }> = ({zones , loadingZones })=>{
const [zonesSearchText, setZonesSearchText] = useState<string>("")
const [pageStartItem, setpageStartItem] = useState<number>(0)
const displayedZones = zones ?  zones?.filter(zone=>zone.name.includes(zonesSearchText)).slice(pageStartItem , pageStartItem + itemsPerPage )  : null



useEffect(()=>{
setpageStartItem(0)
} , [zonesSearchText])

const nextPage = ()=>{
    setpageStartItem((prev)=>prev + itemsPerPage)
}

const prevPage = ()=>{
    setpageStartItem(prev=>prev - itemsPerPage)
}

return <div className="flex flex-col gap-7 py-16" >
          
{ (zones || loadingZones ) &&  <div className={ cn( "flex parent-focus-within gap-2 justify-between items-center p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" , {"invisible" : loadingZones }) } >       
     <input
          type="text"
          value={zonesSearchText}
          onChange={(e) => setZonesSearchText(e.target.value)}
          placeholder="Search for zones..."
          className="appearance-none  focus:outline-none focus:border-0 w-full"
        />
        <img src="/searchIcon.svg"  className="w-[20px]  h-[20px]" /></div>}
      <div className="flex flex-col gap-4" >
     { (zones || loadingZones ) &&  <h2 className="text-xl font-semibold ">All Zones</h2>}
     {zones &&  <div className="overflow-x-auto">
     {Boolean(displayedZones?.length === 0) && <h3>Opps! no zone found.</h3> }
     {Boolean(displayedZones?.length) &&  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Name Servers</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedZones && displayedZones.map((zone) => (
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
        </table>}
      </div>}
      {loadingZones &&<ZonesTableSkeleton/> }
      {zones && <div className="flex w-full justify-between lg:px-5" >
      <button onClick={prevPage} className={cn("bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"    , { "invisible":  pageStartItem < itemsPerPage} )}><img width={20} className="rotate-180" src="/arrow.svg" /><span>Previous</span></button>
      {pageStartItem < zones.length - itemsPerPage &&  <button onClick={nextPage} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"><span>Next</span><img width={20} src="/arrow.svg" /></button>}
      </div>}
    </div></div>
}




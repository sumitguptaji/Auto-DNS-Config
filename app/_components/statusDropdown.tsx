import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Statuses } from "./zonesTable"
import { cn } from "@/utils/tailwind-merge"


export const StatusDropdown : React.FC<{status : Statuses , setStatus  : Dispatch<SetStateAction<Statuses>>}> = ({status , setStatus})=>{
    const [openSelectList, setopenSelectList] = useState(false)

const closeList = ()=>{
    setopenSelectList(false)
}
    return  <div className="relative " >
    <th onClick={(e)=>{setopenSelectList(true)}} className="py-2 cursor-pointer px-4 border-b text-left">Status <span className={cn({"hidden" : status === Statuses.notSelected})} >: {status}</span> </th>
    { openSelectList &&   <div id="dropdown" className="z-10  absolute top-12 left-0 w-full  bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          <li>
            <div onClick={()=>{setStatus(Statuses.active) ; closeList() }} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Active</div>
          </li>
          <li>
            <div onClick={()=>{closeList() ;  setStatus(Statuses.pending)}} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Pending</div>
          </li>
          <li>
            <div onClick={()=>setStatus(Statuses.notSelected)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Any</div>
          </li>
        </ul>
        </div>}
    </div>
}







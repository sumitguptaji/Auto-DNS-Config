import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { DNSRecordToAdd } from '../page';
import papaParse from "papaparse"
import { CSVDataTable } from './csvDataTable';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const customStyles = {
  content: {
    padding : "8px" ,
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
;

const generateRecordsFromCsv = (csvText : string ) : DNSRecordToAdd[] =>{



    const jsonObj  =    papaParse.parse<any>(csvText)
    const records : DNSRecordToAdd[] = jsonObj.data.map((row)=>({
      type: row[0]  ,
      name: row[1], 
      content: row[2],
      priority: Number(row[3]),
      ttl: Number(row[4]),
      proxied: row[5] === "true" ? true : false
  }))
  return records
  }


export const  CsvDataModal  : React.FC<{setIsCsvModalOpened :   Dispatch<SetStateAction<boolean>> ,  isCsvModalOpened : boolean ,  csvText : string , addRecordsCallback : ()=>void , setCsvText : Dispatch<SetStateAction<string>>}> = ({csvText , setCsvText , addRecordsCallback , isCsvModalOpened , setIsCsvModalOpened })=> {

    const [jsonRecords, setJsonRecords] = useState<DNSRecordToAdd[]>(generateRecordsFromCsv(csvText))
    const [addingRecords, setAddingRecords] = useState(false)
    const searchParams = useSearchParams()
    const apiKey = searchParams.get("apiKey");
    const zoneId = searchParams.get("zoneId");
    const zoneName = searchParams.get("zoneName");



useEffect(()=>{
setJsonRecords(generateRecordsFromCsv(csvText))
} , [csvText] )


    const addDNSRecords = async () => {
        setAddingRecords(true);
        try {
          const response = await fetch("/api/addJsonDnsRecords", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ apiKey, zoneId , dnsRecords: jsonRecords }),
          });
          const data = await response.json();
          if (response.ok) {
            toast.success("DNS records created successfully.", {
              autoClose: 5000,
              className: "bg-green-500 text-white",
              progressClassName: "bg-green-700",
            });
            addRecordsCallback(); // Refresh DNS records
          } else {
            toast.error(`Error: ${data.message}`, {
              autoClose: 5000,
              className: "bg-red-500 text-white",
              progressClassName: "bg-red-700",
            });
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Error creating DNS records", {
              autoClose: 5000,
              className: "bg-red-500 text-white",
              progressClassName: "bg-red-700",
            });
          } else {
            toast.error("Error creating DNS records", {
              autoClose: 5000,
              className: "bg-red-500 text-white",
              progressClassName: "bg-red-700",
            });
          }
        }
        addRecordsCallback()
        setAddingRecords(false);
      };








  return (
    <div>
      <Modal
        onRequestClose={()=>setIsCsvModalOpened(false)}
        isOpen={Boolean(isCsvModalOpened)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 className="text-xl font-semibold my-4">Review the data</h2>
       <CSVDataTable key="CSVDataTable" setJsonRecords={setJsonRecords} records={jsonRecords}  ></CSVDataTable>
       <button
        onClick={addDNSRecords}
        className={`mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
          addingRecords ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={addingRecords}
      >
        {addingRecords ? "Adding..." : "Add Bulk DNS Records"}
      </button>
      </Modal>
    </div>
  );
}
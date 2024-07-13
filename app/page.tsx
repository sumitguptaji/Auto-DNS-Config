"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ZoneInfo, ZonesTable, ZonesTableSkeleton } from "./_components/zonesTable";

// interface Zone {
//   id: string;
//   name: string;
// }

export default function Home() {
  const [screen, setScreen] = useState(1);

  const ViewComponent: any = {
    1: <GetZoneComponent />,
    2: <AddZoneComponent />,
  };

  const BtnTitle: any = {
    2: "Get Zone List",
    1: "Add Zone List",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-end ">
          <button
            onClick={() => {
              setScreen((v: any) => (v == 1 ? 2 : 1));
            }}
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            {BtnTitle[screen]}
          </button>
        </div>
        {ViewComponent[screen]}
      </div>
    </div>
  );
}

const AddZoneComponent = () => {
  const [newApiKey, setNewApiKey] = useState("");
  const [domainName, setDomainName] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");
  const [serverNames, setServerNames] = useState([]);

  const addZones = async () => {
    setError("");
    try {
      const response: any = await axios.post(
        "/api/zone/addzone",
        {
          body: JSON.stringify({ apiKey: newApiKey, domainName, accountId }),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.data.length) return;

      setServerNames(response.data.data);
      localStorage.setItem("apiKey", newApiKey);
    } catch (error: any) {
      console.error("Error add zones:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    if (savedApiKey) {
      setNewApiKey(savedApiKey);
    }
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">
        Cloudflare DNS Manager
      </h1>

      <div className="flex item-center justify-between gap-3 mb-3">
        <input
          type="text"
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          placeholder="Enter your Cloudflare API key"
          className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
          placeholder="Enter your Domain"
          className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter your Account Id"
          className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center justify-around w-[800px]">
        <div className="text-center mb-6">
          <button
            onClick={() => {
              addZones();
              setServerNames([]);
            }}
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Zones
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {!!serverNames?.length && (
        <React.Fragment>
          <div className="mb-2">Here are the nameservers for {domainName}</div>
          <ul className="list-disc pl-5 space-y-2">
            {serverNames.map((v: any) => (
              <li
                key={v}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {v}
              </li>
            ))}
          </ul>
        </React.Fragment>
      )}
    </>
  );
};

const GetZoneComponent = () => {
  const [apiKey, setApiKey] = useState("");
  const [loadingZones , setLoadingZones ] = useState(true)
  const [zones, setZones] = useState<ZoneInfo[] | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedApiKey = localStorage.getItem("apiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const fetchZones = async () => {
    setError("");
    try {
      const response = await fetch("/api/zone/getzones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setZones(data);
      localStorage.setItem("apiKey", apiKey);
    } catch (error: any) {
      console.error("Error fetching zones:", error);
      setError(error.message);
    }
  };

  // const handleZoneSelect = (zone: ) => {
  //   router.push(
  //     `/zone?apiKey=${apiKey}&zoneId=${zone.id}&zoneName=${zone.name}`
  //   );
  // };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-6">
        Cloudflare DNS Manager
      </h1>
      <div className="mb-4">
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Cloudflare API key"
          className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center justify-around w-[800px]">
        <div className="text-center mb-6">
          <button
            onClick={fetchZones}
            className="bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-300"
          >
            Fetch Zones
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* <ul className="list-disc pl-5 space-y-2"> */}
      {/* {zones.length > 0 && (
        <div className="h-[400px] overflow-y-scroll scrollbar scrollbar-thumb-blue-600 scrollbar-style my-6">
          <ul className="list-disc pl-5 space-y-2">
            {zones.map((zone) => (
              <li
                key={zone.id}
                onClick={() => handleZoneSelect(zone)}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {zone.name} (ID: {zone.id})
              </li>
            ))}
          </ul>
        </div>
      )} */}
    { zones &&   <ZonesTable zones={zones} />}
    {loadingZones && <ZonesTableSkeleton/>}
    </>
  );
};

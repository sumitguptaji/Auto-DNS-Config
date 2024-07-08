"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.css";

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied: boolean;
  priority?: number; // Add priority for MX records
}

const ZoneContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");
  const zoneId = searchParams.get("zoneId");
  const zoneName = searchParams.get("zoneName");
  const [loaded, setLoaded] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: "",
    name: "",
    content: "",
    ttl: 0,
    proxied: false,
    priority: 0, // Add priority state
    dns_id: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const fetchDNSRecords = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/getdnsrecords?apiKey=${apiKey}&zoneId=${zoneId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch DNS records");
      }
      setDnsRecords(data);
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Error fetching DNS records");
      } else {
        setError("Error fetching DNS records");
      }
    } finally {
      setLoaded(true);
    }
  }, [apiKey, zoneId]);

  useEffect(() => {
    if (apiKey && zoneId && zoneName) {
      fetchDNSRecords();
    }
  }, [apiKey, zoneId, zoneName, fetchDNSRecords]);

  const addSingleDNSRecord = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/addsinglerecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          zoneId,
          recordType: newRecord.type,
          recordName: newRecord.name,
          recordContent: newRecord.content,
          recordTTL: newRecord.ttl,
          recordProxied: newRecord.proxied,
          recordPriority:
            newRecord.type === "MX" ? newRecord.priority : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("DNS record created successfully.", {
          autoClose: 5000,
          className: "bg-green-500 text-white",
          progressClassName: "bg-green-700",
        });
        fetchDNSRecords(); // Refresh DNS records
        setIsDialogOpen(false); // Close dialog
      } else {
        toast.error(`Error: ${data.message}`, {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error creating DNS record", {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      } else {
        toast.error("Error creating DNS record", {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      }
    }
    setIsLoading(false);
  };

  const deleteDNSRecord = async (recordId: string) => {
    try {
      const response = await fetch(
        `/api/deletednsrecords?apiKey=${apiKey}&zoneId=${zoneId}&recordId=${recordId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("DNS record deleted successfully.", {
          autoClose: 5000,
          className: "bg-green-500 text-white",
          progressClassName: "bg-green-700",
        });
        fetchDNSRecords(); // Refresh DNS records
      } else {
        toast.error(`Error: ${data.error}`, {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error deleting DNS record", {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      } else {
        toast.error("Error deleting DNS record", {
          autoClose: 5000,
          className: "bg-red-500 text-white",
          progressClassName: "bg-red-700",
        });
      }
    }
  };

  const deleteSelectedDNSRecords = async () => {
    const recordIds = Array.from(selectedRecords);
    for (let recordId of recordIds) {
      await deleteDNSRecord(recordId);
    }
    setSelectedRecords(new Set()); // Clear selected records
  };

  const handleSelectRecord = (recordId: string) => {
    setSelectedRecords((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(recordId)) {
        newSelected.delete(recordId);
      } else {
        newSelected.add(recordId);
      }
      return newSelected;
    });
  };

  const handleSelectAllRecords = () => {
    if (selectedRecords.size === dnsRecords.length) {
      setSelectedRecords(new Set()); // Deselect all
    } else {
      setSelectedRecords(new Set(dnsRecords.map((record) => record.id))); // Select all
    }
  };

  const addBulkDNSRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/adddnsrecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey, zoneId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("DNS records created successfully.", {
          autoClose: 5000,
          className: "bg-green-500 text-white",
          progressClassName: "bg-green-700",
        });
        fetchDNSRecords(); // Refresh DNS records
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
    setIsLoading(false);
  };

  const editDNSRecord = async (recordId: string) => {
    try {
      if (!dnsRecords?.length) return;

      let editRecord: any = dnsRecords.find((v) => v.id === recordId);
      setNewRecord({
        type: editRecord.type,
        name: editRecord.name,
        content: editRecord.content,
        ttl: editRecord.ttl,
        proxied: editRecord.proxied,
        priority: editRecord.priority,
        dns_id: editRecord.id,
      });
      setIsEdit(true);
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Error deleting DNS record", {
        autoClose: 5000,
        className: "bg-red-500 text-white",
        progressClassName: "bg-red-700",
      });
    }
  };

  const updateDNSRecord = async () => {
    try {
      const response: any = await fetch("/api/updatednsrecords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          zoneId,
          ...newRecord,
          priority: newRecord.type === "MX" ? newRecord.priority : undefined,
        }),
      });

      if (!response.ok) return;

      toast.success(response.message, {
        autoClose: 5000,
        className: "bg-green-500 text-white",
        progressClassName: "bg-green-700",
      });

      setIsDialogOpen(false);
      setIsEdit(false);
      fetchDNSRecords(); // Refresh DNS records
    } catch (error: any) {
      toast.error(error.message || "Error Updated DNS record", {
        autoClose: 5000,
        className: "bg-red-500 text-white",
        progressClassName: "bg-red-700",
      });
    }
  };

  if (!loaded) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Selected Zone</h1>
      <p className="mb-2">
        <strong>API Key:</strong> {apiKey}
      </p>
      <p className="mb-2">
        <strong>Zone Name:</strong> {zoneName}
      </p>
      <p className="mb-4">
        <strong>Zone ID:</strong> {zoneId}
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-4"
      >
        Back
      </button>
      <h2 className="text-xl font-semibold mb-4">DNS Records</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">
                <input
                  type="checkbox"
                  checked={selectedRecords.size === dnsRecords.length}
                  onChange={handleSelectAllRecords}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
              </th>
              <th className="py-2 px-4 border-b text-left">Type</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Content</th>
              <th className="py-2 px-4 border-b text-left">TTL</th>
              <th className="py-2 px-4 border-b text-left">Proxied</th>
              <th className="py-2 px-4 border-b text-left">Edit</th>
              <th className="py-2 px-4 border-b text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {dnsRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  <input
                    type="checkbox"
                    checked={selectedRecords.has(record.id)}
                    onChange={() => handleSelectRecord(record.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                </td>
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
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => editDNSRecord(record.id)}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-500"
                  >
                    Edit
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => deleteDNSRecord(record.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addBulkDNSRecords}
        className={`mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Bulk DNS Records"}
      </button>
      {selectedRecords.size > 0 && (
        <button
          onClick={deleteSelectedDNSRecords}
          className="mt-4 ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Delete Selected Records
        </button>
      )}
      <button
        onClick={() => setIsDialogOpen(true)}
        className="mt-4 ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Add Single DNS Record
      </button>
      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Update" : "Add"} DNS Record
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={newRecord.type}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, type: e.target.value })
                }
              >
                <option value={""}>Select Type</option>
                <option
                  value={"MX"}
                  selected={newRecord.type == "MX" ? true : false}
                >
                  MX
                </option>
                <option
                  value={"A"}
                  selected={newRecord.type == "A" ? true : false}
                >
                  A Record
                </option>
                <option
                  value={"TXT"}
                  selected={newRecord.type == "TXT" ? true : false}
                >
                  TXT
                </option>
                <option
                  value={"CNAME"}
                  selected={newRecord.type == "CNAME" ? true : false}
                >
                  CNAME
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={newRecord.name}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, name: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Content</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) =>
                  setNewRecord({ ...newRecord, content: e.target.value })
                }
              >
                {newRecord.content}
              </textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">TTL</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                value={newRecord.ttl}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, ttl: parseInt(e.target.value) })
                }
              >
                <option value={""}>Select TTL</option>
                <option value={"300"}>300</option>
              </select>
            </div>
            {newRecord.type === "MX" && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Priority</label>
                <input
                  type="number"
                  value={newRecord.priority}
                  onChange={(e) =>
                    setNewRecord({
                      ...newRecord,
                      priority: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Proxied</label>
              <input
                type="checkbox"
                checked={newRecord.proxied}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, proxied: e.target.checked })
                }
                className="form-checkbox h-4 w-4 text-blue-600"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewRecord({
                    type: "",
                    name: "",
                    content: "",
                    ttl: 0,
                    proxied: false,
                    priority: 0,
                    dns_id: "",
                  });
                }}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  isEdit ? updateDNSRecord() : addSingleDNSRecord();
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {isEdit ? "Update" : "Add"} Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Zone = () => (
  <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
    <ZoneContent />
  </Suspense>
);

export default Zone;

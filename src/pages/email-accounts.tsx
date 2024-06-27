/* eslint-disable @next/next/no-html-link-for-pages */
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

interface AccountInterface {
  id: number;
  email: string;
  name?: string;
  type: string;
  access_token?: string;
  refresh_token?: string;
  autoSend: boolean;
}

interface APIResponse {
  data: AccountInterface[];
}

function Page() {
  const [emailData, setEmailData] = useState<AccountInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("show-account");

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/get-accounts");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: APIResponse = await response.json();
        if (result.data.length === 0) {
          setTab("add-account");
        }
        setEmailData(result.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleCheckboxChange = async (id: number) => {
    const updatedEmailData = emailData.map((account) => {
      if (account.id === id) {
        return { ...account, autoSend: !account.autoSend };
      }
      return account;
    });
    setEmailData(updatedEmailData);

    try {
      const response = await fetch(`http://localhost:8080/api/update-autoreply-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          autoSend: updatedEmailData.find((account) => account.id === id)
            ?.autoSend,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update auto reply status");
      }
      const result = await response.json();
      console.log("API response", result);
    } catch (error: any) {
      console.error("API error", error);
    }
  };

  return (
    <div>
      {tab == "show-account" && emailData.length > 0 && (
        <div className="relative overflow-x-auto p-6">
          <button
            onClick={() => {
              setTab("add-account");
            }}
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 my-4 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Add Account
          </button>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Account Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  type
                </th>
                <th scope="col" className="px-6 py-3">
                  Auto Reply
                </th>
              </tr>
            </thead>
            <tbody>
              {emailData.map((data) => (
                <tr
                  key={data.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  {/* <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Apple MacBook Pro
                  </th> */}
                  <td className="px-6 py-4">{data?.id}</td>
                  <td className="px-6 py-4">{data?.email}</td>
                  <td className="px-6 py-4">{data?.type}</td>
                  <td className="px-6 py-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={data.autoSend}
                        onChange={() => handleCheckboxChange(data.id)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab == "add-account" && (
        <div className="w-full max-w-sm mx-auto p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-between">
            <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
              👋 Add Email Account
            </h5>
            {emailData.length > 0 && (
              <XMarkIcon
                onClick={() => {
                  setTab("show-account");
                }}
                className="w-8 h-8 hover:cursor-pointer"
              />
            )}
          </div>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Start adding your email accounts to start your campaign
          </p>
          <ul className="my-4 space-y-3">
            <li>
              <a
                href="http://localhost:8080/api/outlook/auth"
                className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="60"
                  height="60"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#03A9F4"
                    d="M21,31c0,1.104,0.896,2,2,2h17c1.104,0,2-0.896,2-2V16c0-1.104-0.896-2-2-2H23c-1.104,0-2,0.896-2,2V31z"
                  ></path>
                  <path
                    fill="#B3E5FC"
                    d="M42,16.975V16c0-0.428-0.137-0.823-0.367-1.148l-11.264,6.932l-7.542-4.656L22.125,19l8.459,5L42,16.975z"
                  ></path>
                  <path
                    fill="#0277BD"
                    d="M27 41.46L6 37.46 6 9.46 27 5.46z"
                  ></path>
                  <path
                    fill="#FFF"
                    d="M21.216,18.311c-1.098-1.275-2.546-1.913-4.328-1.913c-1.892,0-3.408,0.669-4.554,2.003c-1.144,1.337-1.719,3.088-1.719,5.246c0,2.045,0.564,3.714,1.69,4.986c1.126,1.273,2.592,1.91,4.378,1.91c1.84,0,3.331-0.652,4.474-1.975c1.143-1.313,1.712-3.043,1.712-5.199C22.869,21.281,22.318,19.595,21.216,18.311z M19.049,26.735c-0.568,0.769-1.339,1.152-2.313,1.152c-0.939,0-1.699-0.394-2.285-1.187c-0.581-0.785-0.87-1.861-0.87-3.211c0-1.336,0.289-2.414,0.87-3.225c0.586-0.81,1.368-1.211,2.355-1.211c0.962,0,1.718,0.393,2.267,1.178c0.555,0.795,0.833,1.895,0.833,3.31C19.907,24.906,19.618,25.968,19.049,26.735z"
                  ></path>
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Outlook</span>
              </a>
            </li>
            <li>
              <a
                href="http://localhost:8080/api/google/auth"
                className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="60"
                  height="60"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#4caf50"
                    d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
                  ></path>
                  <path
                    fill="#1e88e5"
                    d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
                  ></path>
                  <polygon
                    fill="#e53935"
                    points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
                  ></polygon>
                  <path
                    fill="#c62828"
                    d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
                  ></path>
                  <path
                    fill="#fbc02d"
                    d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
                  ></path>
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Gmail</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Page;

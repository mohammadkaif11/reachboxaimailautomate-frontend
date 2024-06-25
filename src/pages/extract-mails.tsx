/* eslint-disable @next/next/no-html-link-for-pages */
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface Account {
  id: number;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
  type: string;
  autoSend: boolean;
}

interface Mails {
  id: string;
  messageId: string;
  from: string;
  subject: string;
  snippet: string;
  email: string;
  label: string;
  createdAt: string;
  account: Account;
}

interface AIGeneratedMail {
  id: string;
  messageId: string;
  from: string;
  subject: string;
  snippet: string;
  email: string;
  label: string;
  account: Account;
  data: {
    content: string;
    subject: string;
  };
}

interface APIResponse {
  data: Mails[];
}

function Page() {
  const [mails, setMails] = useState<Mails[]>([]);
  const [AIResponse, setAIResponse] = useState<AIGeneratedMail>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/get-extract-mails"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: APIResponse = await response.json();
        setMails(result.data);
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

  const generateEmailByAI = async (mailId: string) => {
    setOpen(true);
    setModalLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/generate-mail-reply/${mailId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: AIGeneratedMail = await response.json();
      setAIResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  const sendMailAPI = async () => {
    try {
      if (!AIResponse) {
        throw new Error("AI Response was not found");
      }
      const response = await fetch(`http://localhost:8080/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ AIResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to send mail");
      }
      setMessage("Successfully sent mail");
      const result = await response.json();
      console.log("API response", result);
    } catch (error) {
      console.error(error);
    } finally {
      setMessage("");
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto p-6">
        <h2 className="text-center text-2xl my-2">All Extract Mails</h2>
        {mails.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Account Mail
                </th>
                <th scope="col" className="px-6 py-3">
                  Save Time
                </th>
                <th scope="col" className="px-6 py-3">
                  From
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Content
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Reply
                </th>
              </tr>
            </thead>
            <tbody>
              {mails.map((data) => (
                <tr
                  key={data.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{data?.account?.email}</td>
                  <td className="px-6 py-4">{new Date(data?.createdAt).toString()}</td>

                  <td className="px-6 py-4">{data?.from}</td>
                  <td className="px-6 py-4">{data?.email}</td>
                  <td className="px-6 py-4">{data?.subject}</td>
                  <td className="px-6 py-4">{data?.snippet}</td>
                  <td className="px-6 py-4">
                    {data.label === "Interested" && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        Interested
                      </span>
                    )}
                    {data.label === "Not_Interested" && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                        Not_Interested
                      </span>
                    )}
                    {data.label === "More_Information" && (
                      <span className="bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">
                        More_Information
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        generateEmailByAI(data.id);
                      }}
                      className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      type="button"
                    >
                      AI Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Dialog className="relative z-10" open={open} onClose={setOpen}>
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {modalLoading ? (
              <>Loading</>
            ) : (
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        AI Generated Mail
                      </DialogTitle>
                      {message != "" && (
                        <p className="text-md text-green-500">{message}</p>
                      )}

                      <div className="mt-2">
                        <label className="text-black font-serif font-bold">
                          Subject
                        </label>
                        <p className="text-sm text-gray-500">
                          {AIResponse?.data.subject}
                        </p>
                      </div>
                      <div className="mt-2">
                        <label className="text-black font-serif font-bold">
                          Mail Content
                        </label>
                        <p className="text-sm text-gray-500">
                          {AIResponse?.data.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={async () => {
                      await sendMailAPI();
                      setOpen(false);
                    }}
                    data-autofocus
                  >
                    Send
                  </button>
                </div>
              </DialogPanel>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Page;

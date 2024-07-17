/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useEffect, useState } from "react";


interface Account {
  id: number;
  email: string;
  name: string;
  access_token: string;
  refresh_token: string;
  type: string;
  autoSend: boolean;
}

interface MailReply {
  id: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  content: string;
  createdAt: string;
  account: Account;
}

interface APIResponse {
  data: MailReply[];
}

function Page() {
  const [mailsReply, setMailsReplys] = useState<MailReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/get-mail-reply"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: APIResponse = await response.json();
        setMailsReplys(result.data);
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

  return (
    <div>
      <div className="relative overflow-x-auto p-6">
        <h2 className="text-center text-2xl my-2">Mail Replys</h2>
        {mailsReply.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Your Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Client Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Content
                </th>
                <th scope="col" className="px-6 py-3">
                  Timing
                </th>
              </tr>
            </thead>
            <tbody>
              {mailsReply.map((data) => (
                <tr
                  key={data.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4">{data?.fromEmail}</td>
                  <td className="px-6 py-4">{data?.toEmail}</td>
                  <td className="px-6 py-4">{data?.subject}</td>
                  <td className="px-6 py-4">{data?.content}</td>
                  <td className="px-6 py-4">
                    {new Date(data?.createdAt).toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Page;

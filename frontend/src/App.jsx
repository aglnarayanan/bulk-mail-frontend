import { useState } from "react";
import * as XLSX from "xlsx";
import "./index.css";

function App() {
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const emailList = jsonData.map((row) => row.A).filter(Boolean);
      setEmails(emailList);
      console.log("Emails:", emailList);
    };

    reader.readAsBinaryString(file);
  };

  const handleSend = async () => {
    if (emails.length === 0) {
      alert("No emails to send!");
      return;
    }
    if (!subject || !message) {
      alert("Subject and message required!");
      return;
    }

    const res = await fetch("http://localhost:5000/send-bulk-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: emails,
        subject,
        message,
      }),
    });

    const data = await res.json();
    console.log(data);
    alert(`Mail send status: ${data.status}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        {/* ✅ Logo + Heading */}
        <div className="flex items-center justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
            alt="Gmail Logo"
            className="w-10 h-10 mr-2"
          />
          <h1 className="text-4xl font-bold text-blue-700">BulkMail</h1>
        </div>

        {/* ✅ Tagline */}
        <h2 className="text-center text-lg text-gray-600 mb-8">
          We can help your business with sending multiple emails at once
        </h2>

        {/* ✅ Drag & Drop */}
        <h3 className="text-md font-medium mb-2 text-gray-800">Drag and Drop</h3>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-full border-4 border-dashed border-blue-300 p-8 rounded-lg text-center cursor-pointer transition hover:border-blue-500 mb-6"
        />

        {/* ✅ Subject */}
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mb-4 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* ✅ Message */}
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="mb-6 p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        ></textarea>

        {/* ✅ Send Button */}
        <button
          onClick={handleSend}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Send Bulk Mail
        </button>

        {/* ✅ Recipients List */}
        {emails.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">📋 Recipients:</h3>
            <ul className="bg-gray-50 p-4 border border-gray-200 rounded max-h-64 overflow-y-auto text-sm">
              {emails.map((email, idx) => (
                <li key={idx} className="py-1 border-b border-gray-200 last:border-b-0">
                  {email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

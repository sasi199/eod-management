import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
    { text: "I need help with my order.", sender: "user" },
    { text: "Sure! Can you provide me with your order ID?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const chatMembers = [
    { name: "Alice", online: true, avatar: "https://via.placeholder.com/40" },
    { name: "Bob", online: false, avatar: "https://via.placeholder.com/40" },
    { name: "Charlie", online: true, avatar: "https://via.placeholder.com/40" },
  ];

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen px-4 bg-white shadow-lg rounded-lg ">
      {/* Chat Members Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-200 rounded-l-lg">
        <h2 className="text-lg font-semibold mb-4">Chat Members</h2>
        <ul className="space-y-4">
          {chatMembers.map((member, index) => (
            <li key={index} className="flex items-center space-x-3">
              <img
                src={member.avatar}
                alt={`${member.name}'s avatar`}
                className="w-10 h-10 rounded-full border border-gray-300"
              />
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">{member.name}</span>
                <span
                  className={`text-sm ${
                    member.online ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  {member.online ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col flex-1">
        <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg rounded-t-lg">
          Chat Support
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg text-sm max-w-xs shadow-md ${
                  message.sender === "user"
                    ? "bg-primary text-black"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-100 rounded-b-lg flex items-center">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 p-3 bg-primary  bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

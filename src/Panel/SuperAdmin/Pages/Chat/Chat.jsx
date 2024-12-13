import React, { useState } from "react";

const Chat = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState({
    Alice: [
      { text: "Welcome to the chat!", sender: "bot" },
      { text: "Hi Alice!", sender: "user" },
    ],
    Bob: [
      { text: "Hello Bob, how can I assist you today?", sender: "bot" },
    ],
    Charlie: [
      { text: "Hey Charlie! How's it going?", sender: "bot" },
    ],
  });

  const chatMembers = [
    { name: "Alice", online: true, avatar: "https://via.placeholder.com/40" },
    { name: "Bob", online: false, avatar: "https://via.placeholder.com/40" },
    { name: "Charlie", online: true, avatar: "https://via.placeholder.com/40" },
  ];

  const handleSendMessage = () => {
    if (input.trim() && selectedMember) {
      setConversations({
        ...conversations,
        [selectedMember.name]: [
          ...(conversations[selectedMember.name] || []),
          { text: input, sender: "user" },
        ],
      });
      setInput("");
    }
  };

  return (
    <div className="flex h-screen px-4 bg-white shadow-lg rounded-lg">
      {/* Chat Members Sidebar */}
      <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-200 rounded-l-lg">
        <h2 className="text-lg font-semibold mb-4">Chat Members</h2>
        <ul className="space-y-4">
          {chatMembers.map((member, index) => (
            <li
              key={index}
              className={`flex items-center space-x-3 cursor-pointer ${
                selectedMember?.name === member.name
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"
              } p-2 rounded-lg`}
              onClick={() => setSelectedMember(member)}
            >
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

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg rounded-t-lg">
          {selectedMember
            ? `Chat with ${selectedMember.name}`
            : "Welcome to Chat"}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {selectedMember ? (
            (conversations[selectedMember.name] || []).map((message, index) => (
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
            ))
          ) : (
            <div className="text-center text-gray-600 mt-10">
              Select a member to start chatting!
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100 rounded-b-lg flex items-center">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!selectedMember}
          />
          <button
            className={`ml-2 p-3 ${
              selectedMember
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } rounded-lg transition duration-200`}
            onClick={handleSendMessage}
            disabled={!selectedMember}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

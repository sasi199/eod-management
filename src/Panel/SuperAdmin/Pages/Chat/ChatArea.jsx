import React, { useState } from "react";
import { Input, Button } from "antd";
import { useChatContext } from "./ChatProvider";

const ChatArea = () => {
  const { selectedMember, conversations, setConversations, userId,handleSendMessage,setInput ,input} =
    useChatContext();


  console.log("selectedMember", selectedMember);
  console.log("conversations", conversations);

  console.log("userId", userId);



  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-100 font-semibold text-lg">
        {selectedMember
          ? `Chat with ${selectedMember.chatName}`
          : "Select a Member to Chat"}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {selectedMember ? (
          conversations?.map((message, index) => (
            <React.Fragment key={index}>
              {message.messageType === "initial" && (
                <div className="w-full text-center mb-8  text-gray-500 text-sm">
                  {message.message}
                </div>
              )}

              <div
                className={`flex my-2 ${
                  message.createdBy === userId ? "justify-end" : "justify-start"
                }`}
              >
                {message.messageType === "usual" && (
                    <div>
                  <div
                    className={`p-2 rounded-lg max-w-xs shadow-md text-sm ${
                      message.createdBy === userId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.message}
                  
                  </div>
                    <p className="itme-end text-xs mt-1 flex justify-end">{message.time}</p>
                    </div>
                )}
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="items-center flex justify-center w-full h-full">
            <p className="text-center text-gray-500">No chat selected</p>
          </div>
        )}
      </div>

      {selectedMember && (
        <div className="p-4 bg-gray-100 rounded-b-lg flex items-center">
          <Input
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSendMessage}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
          />
          <Button
            type="primary"
            className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;

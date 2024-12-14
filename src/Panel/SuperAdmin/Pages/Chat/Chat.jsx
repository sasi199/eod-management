import React from "react";
import { ChatProvider } from "./ChatProvider";
import ChatMembers from "./ChatMembers";
import ChatArea from "./ChatArea";

const Chat = () => {

  localStorage.setItem('userId','8a1ed041-5a94-4e12-8aa0-cd8ef4254164')
  return (
    <ChatProvider>
      <div className="flex h-fit p-2" style={{ height: "calc(100vh - 90px)" }}>
        <div className="w-1/4 border-r bg-gray-50">
          <ChatMembers />
        </div>

        <div className="flex-1">
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  );
};

export default Chat;

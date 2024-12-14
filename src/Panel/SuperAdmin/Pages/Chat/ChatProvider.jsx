import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GetMessage, GetUsersByChats } from "../../../../services";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";
import dayjs from "dayjs";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);
  const [input, setInput] = useState("");
  const [isSelectMember, setIsSelectMember] = useState(false);
  const [groupClick, setGroupClick] = useState({
    senderId: "",
    receiverId: "",
    roomId: "",
    profile: "",
    chatName: "",
    created: "",
    participants: [],
    chat_id: "",
    senderName: "",
    type: "",
    userProfile: "",
    usersCount: [],
  });

  const socketRef = useRef(null);

  const [chatMembers, setChatMembers] = useState([]);

  const fetchUsers = async () => {
    try {
      const users = await GetUsersByChats();
      setChatMembers(users.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    } else {
      console.log("No token found");
    }

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8010"); // Fixed assignment
      console.log("Socket connected successfully");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, []);

  console.log("user idfwf", userId);

  const fetchMessage = async (data) => {
    try {
      const message = await GetMessage(data);
      setConversations(message.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (isSelectMember && groupClick.roomId) {
      socketRef.current.emit("joinRoom", {
        room: groupClick.roomId,
        userId: userId,
      });

      const handleMessage = (message) => {
        console.log("Message received: ", message);
        message.shouldShake = true;
        // if (message.senderId === adminId) {
        //   const sound = new Audio(messageSendSound);
        //   sound.play();
        // } else {
        //   const sound = new Audio(notificationSound);
        //   sound.play();
        // }
        setConversations((prevMessages) => {
          const findMessageInfoForUser = groupClick.participants.filter(
            (participant) => participant._id !== userId
          );
          const mergedData = message.messageStatus
            .filter((val) => val.userId !== userId)
            .map((msge) => {
              const addMessage = findMessageInfoForUser.find(
                (user) => user._id === msge.userId
              );
              if (addMessage) {
                return { ...msge, ...addMessage };
              } else {
                return msge;
              }
            });
          const { messageStatus: removed, ...rest } = message;
          const newMessageStatus = { ...rest, messageStatus: mergedData };
          return [...prevMessages, newMessageStatus];
        });
        // setGroup((prevGroup) => {
        //   const updatedMsgStatus = prevGroup?.map((grp) => {
        //     if (grp.roomId === selectedGroup.roomId) {
        //       return { ...grp, messageStatus: message.messageStatus };
        //     } else {
        //       return grp;
        //     }
        //   });
        //   return updatedMsgStatus;
        // });
      };

      socketRef.current.on("message", handleMessage);
    
    return () => {
      socketRef.current.off("message", handleMessage);
      socketRef.current.emit("leaveRoom", {
        room: groupClick.roomId,
        userId: userId,
      });
    };
}
  }, [isSelectMember, groupClick.roomId, userId]);

  const handleGroupClick = (group) => {
    if (group?.roomId !== groupClick.roomId) {
      let filteredParticipants = group.participants
        ?.filter((val) => val._id !== userId)
        ?.map((val) => ({
          userId: val._id,
        }));

      const findProfileForMessage = group?.participants?.filter(
        (participant) => participant._id === userId
      );
      const { userName } = findProfileForMessage[0] || {};
      let userProfile = group.participants.find((part) => part._id === userId);

      setGroupClick({
        senderId: userId || "",
        receiverId: filteredParticipants || "",
        roomId: group.roomId || "",
        profile: group.profile || "",
        chatName: group.chatName || "",
        created: "",
        participants: group.participants || [],
        chat_id: group._id || "",
        senderName: userName || "",
        type: group.type || "",
        userProfile: userProfile?.profile || "",
        usersCount: group.usersCount || [],
      });
    }
  };

  const handleSendMessage = () => {
    const currentDate = dayjs();
    const formattedDate = currentDate.format("DD/MM/YYYY");
    const formattedTime = currentDate.format("hh:mm A");
    if (input.trim() && groupClick) {
      const {
        senderId,
        receiverId,
        roomId,
        userProfile,
        chat_id,
        senderName,
        usersCount,
        type,
      } = groupClick;

      socketRef.current.emit("sendMessage", {
        senderId,
        receiverId,
        message: input,
        roomId,
        senderName,
        date: formattedDate,
        time: formattedTime,
        profile: userProfile,
        tag: "",
        chat_id,
        userId,
        createdBy: userId,
        messageType: "usual",
        groupType: type,
      });

      setInput("");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        selectedMember,
        setSelectedMember,
        conversations,
        setConversations,
        chatMembers,
        fetchMessage,
        userId,
        handleGroupClick,
        handleSendMessage,
        input,
        setInput,
        setIsSelectMember,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);

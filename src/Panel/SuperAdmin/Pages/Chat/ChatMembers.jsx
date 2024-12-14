import React, { useEffect, useState } from "react";
import { useChatContext } from "./ChatProvider";
import { FaUser, FaUsers } from "react-icons/fa";
import { Modal, Button, Checkbox, Tooltip, message } from "antd";
import { CreateMeesage } from "../../../../services";

const ChatMembers = () => {
  const { chatMembers, setSelectedMember, selectedMember, fetchMessage,handleGroupClick,setIsSelectMember } =
    useChatContext();

  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [next, setNext] = useState(false);
  const [groupName, setGroupName] = useState("");
 

  const handleClick = (data) => {
    setSelectedMember(data);
    fetchMessage(data.roomId);
    handleGroupClick(data)
    setIsSelectMember(true)
  };


  const handleInitialMessage = async (member) => {
    const participants = [
      {
        _id: member._id,
        email: member.email,
        userName: member.userName,
        profile: member.profile,
        department: member.department || "Unknown",
        role: member.role || "Unknown",
      },
    ];

    const payload = {
      type: "individual",
      participants,
    };

    try {
      const response = await CreateMeesage(payload);
      if (response.status === 200) {
        handleModalClose();
        message.success("Message initiated successfully!");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to initiate message. Please try again.");
    }
  };

  const handleGroup = () => {
    setIsCreatingGroup((prev) => !prev);
    setSelectedUsers([]);
  };

  const handleUserCheck = (member) => {
    setSelectedUsers((prev) =>
      prev.includes(member)
        ? prev.filter((user) => user !== member)
        : [...prev, member]
    );
  };

  const handleNext = () => {
    if (selectedUsers.length >= 2) {
      setNext(true);
    } else {
      message.warning("Select at least two users.");
    }
  };

  const handleBack = () => {
    setNext(false);
    setSelectedUsers([]);
  };

  const handleCreate = async () => {
    const payload = {
      chatName: groupName,
      type: "group",
      participants: selectedUsers,
    };

    try {
      const response = await CreateMeesage(payload);
      if (response.status === 200) {
        message.success("Group created successfully!");
        handleModalClose();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to create group. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsCreatingGroup(false);
    setNext(false);
    setSelectedUsers([]);
    setGroupName("");
    setModalVisible(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-[14px] bg-gray-100 flex px-2 justify-between">
        <h1 className="text-2xl font-bold">Chats</h1>
        <div
          className="flex justify-center items-center"
          onClick={() => setModalVisible(true)}
        >
          <FaUsers className="text-2xl cursor-pointer" />
        </div>
      </div>

      <div
        className="space-y-2 px-2 mt-2"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {chatMembers?.data?.map((member) => (
          <div
            key={member.chatName}
            onClick={() => handleClick(member)}
            className={`flex items-center gap-1 p-3 rounded-lg shadow-sm cursor-pointer transition-colors duration-200 ${
              selectedMember?.chatName === member.chatName
                ? "bg-gray-200"
                : "bg-white"
            }`}
          >
            {member.profile ? (
              <img
                src={member.profile}
                alt={member.chatName}
                className="w-10 h-10 object-cover rounded-full mr-4"
              />
            ) : (
              <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200 mr-4">
                <FaUser className="text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-bold text-base text-gray-900">
                {member.chatName}
              </p>
              <p
                className={`text-sm ${
                  member.online ? "text-green-500" : "text-gray-400"
                }`}
              >
                {member.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title="All Users"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <div className="border p-4">
          {next ? (
            <div className="py-4 mt-4">
              <input
                className="flex-1 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
                name="groupName"
                placeholder="Enter the Group Name"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
              />
              <div className="flex justify-between mt-4">
                <Button
                  className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
                  onClick={handleCreate}
                >
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="py-4 flex justify-between">
                <Button
                  className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
                  onClick={handleGroup}
                >
                  {isCreatingGroup ? "Cancel Group" : "New Group"}
                </Button>
                {isCreatingGroup && (
                  <Tooltip
                    title={
                      selectedUsers.length < 2
                        ? "Select at least two users"
                        : undefined
                    }
                  >
                    <Button
                      className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
                      onClick={handleNext}
                      disabled={selectedUsers.length < 2}
                    >
                      Next
                    </Button>
                  </Tooltip>
                )}
              </div>

              <div className="space-y-2">
                {chatMembers?.val?.map((member) => (
                  <div
                    key={member._id}
                    className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
                  >
                    <div className="flex gap-3 items-center">
                      {member.profile ? (
                        <img
                          src={member.profile}
                          alt={member.userName}
                          className="w-12 h-12 object-cover border p-1 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-gray-200">
                          <FaUser className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.userName}
                        </p>
                        <p
                          className={`text-sm ${
                            member.online ? "text-green-500" : "text-gray-400"
                          }`}
                        >
                          {member.online ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isCreatingGroup ? (
                        <Checkbox
                          checked={selectedUsers.includes(member)}
                          onChange={() => handleUserCheck(member)}
                        />
                      ) : (
                        <Button
                          className="ml-2 p-3 bg-primary bg-orange-500 text-white rounded-lg hover:bg-primary-dark transition duration-200"
                          onClick={() => handleInitialMessage(member)}
                        >
                          Initiate Message
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ChatMembers;

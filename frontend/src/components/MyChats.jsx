import { useEffect, useState } from "react";
import axios from "axios";

import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import SearchModal from "./miscellaneous/SearchModal";
import Avatar from "./ui/Avatar";
import { PlusIcon, SearchIcon, UsersIcon } from "./ui/Icons";
import { toaster } from "./ui/toast";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const MyChats = ({ fetchAgain }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const { selectedChat, setSelectedChat, user, chats, setChats, notification, setNotification } =
    ChatState();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats(data);
    } catch {
      toaster.create({ title: "Failed to load chats", type: "error" });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  const openChat = (chat) => {
    setSelectedChat(chat);
    setNotification(notification.filter((n) => n.chat._id !== chat._id));
  };

  return (
    <>
      <div className="sidebar-bar">
        <h2>Chats</h2>
        <div className="row">
          <button className="btn btn-sm" onClick={() => setSearchOpen(true)}>
            <SearchIcon width={15} height={15} /> New chat
          </button>
          <GroupChatModal>
            <button className="btn btn-sm">
              <UsersIcon width={15} height={15} /> Group
            </button>
          </GroupChatModal>
        </div>
      </div>

      <div className="chat-list">
        {!chats && <ChatLoading />}

        {chats?.length === 0 && (
          <div className="empty-list">
            <PlusIcon width={22} height={22} style={{ marginBottom: 6 }} />
            <p>No conversations yet.</p>
            <p>Start one with "New chat".</p>
          </div>
        )}

        {chats?.map((chat) => {
          const name = chat.isGroupChat ? chat.chatName : getSender(user, chat.users);
          const other = chat.isGroupChat ? null : getSenderFull(user, chat.users);
          const unread = notification.filter((n) => n.chat._id === chat._id).length;
          const last = chat.latestMessage;

          return (
            <button
              key={chat._id}
              className={`chat-item ${selectedChat?._id === chat._id ? "active" : ""}`}
              onClick={() => openChat(chat)}
            >
              {chat.isGroupChat ? (
                <span className="avatar" style={{ width: 42, height: 42, background: "var(--accent-soft)", color: "var(--accent)" }}>
                  <UsersIcon width={20} height={20} />
                </span>
              ) : (
                <Avatar name={name} src={other?.pic} size={42} />
              )}

              <span className="chat-meta">
                <div className="chat-name">{name}</div>
                {last && (
                  <div className="chat-last">
                    <b>{last.sender._id === user._id ? "You" : last.sender.name.split(" ")[0]}:</b>{" "}
                    {last.content}
                  </div>
                )}
              </span>

              {unread > 0 && <span className="badge">{unread}</span>}
            </button>
          );
        })}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default MyChats;

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import Avatar from "./ui/Avatar";
import ScrollableChat from "./ScrollableChat";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { BackIcon, ChatIcon, InfoIcon, SendIcon, UsersIcon } from "./ui/Icons";
import { toaster } from "./ui/toast";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import { API_URL } from "../config";

let socket;
let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loadedChatId, setLoadedChatId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typingRoom, setTypingRoom] = useState(null);

  const typingTimeout = useRef(null);
  const iAmTyping = useRef(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const loadMessages = (chatId) =>
    axios
      .get(`/api/message/${chatId}`, { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => res.data);

  const showLoadError = (error) =>
    toaster.create({
      title: "Failed to load messages",
      description: error.response?.data?.message,
      type: "error",
    });

  // Re-fetch the open chat (used by the group modal after membership changes)
  const fetchMessages = async () => {
    if (!selectedChat) return;
    const chatId = selectedChat._id;

    try {
      const data = await loadMessages(chatId);
      if (selectedChatCompare?._id === chatId) setMessages(data);
    } catch (error) {
      showLoadError(error);
    }
  };

  const stopTyping = () => {
    clearTimeout(typingTimeout.current);
    if (iAmTyping.current && selectedChat) {
      socket?.emit("stop typing", selectedChat._id);
    }
    iAmTyping.current = false;
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const content = newMessage.trim();
    if (!content) return;

    stopTyping();
    setNewMessage("");

    try {
      const { data } = await axios.post(
        "/api/message",
        { content, chatId: selectedChat._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      socket?.emit("new message", data);
      setMessages((prev) => [...prev, data]);
      setFetchAgain((prev) => !prev); // refresh sidebar preview
    } catch (error) {
      setNewMessage(content);
      toaster.create({
        title: "Failed to send message",
        description: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return;

    if (!iAmTyping.current) {
      iAmTyping.current = true;
      socket.emit("typing", selectedChat._id);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(stopTyping, 2500);
  };

  // Connect to Socket.IO once per logged-in user
  useEffect(() => {
    socket = io(API_URL);
    socket.emit("setup", user);

    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (room) => setTypingRoom(room));
    socket.on("stop typing", (room) => setTypingRoom((cur) => (cur === room ? null : cur)));

    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
      socket.disconnect();
    };
  }, [user]);

  // Load messages whenever a different chat is selected
  useEffect(() => {
    selectedChatCompare = selectedChat;
    if (!selectedChat) return;

    const chatId = selectedChat._id;
    let active = true; // ignore the response if the user switches chats meanwhile

    loadMessages(chatId)
      .then((data) => {
        if (!active) return;
        setMessages(data);
        socket?.emit("join chat", chatId);
      })
      .catch((error) => active && showLoadError(error))
      .finally(() => active && setLoadedChatId(chatId));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?._id]);

  // Incoming messages: show in the open chat, otherwise add a notification
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg) => {
      if (!selectedChatCompare || selectedChatCompare._id !== msg.chat._id) {
        if (!notification.some((n) => n._id === msg._id)) {
          setNotification([msg, ...notification]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, msg]);
        setFetchAgain((prev) => !prev);
      }
    };

    socket.on("message recieved", handleMessageReceived);
    return () => socket.off("message recieved", handleMessageReceived);
  }, [notification, setNotification, setFetchAgain]);

  if (!selectedChat) {
    return (
      <div className="placeholder">
        <div>
          <div className="ph-icon"><ChatIcon /></div>
          <h3>Select a conversation</h3>
          <p>Choose a chat from the list, or start a new one.</p>
        </div>
      </div>
    );
  }

  const loading = loadedChatId !== selectedChat._id;
  const isGroup = selectedChat.isGroupChat;
  const other = isGroup ? null : getSenderFull(user, selectedChat.users);
  const title = isGroup ? selectedChat.chatName : getSender(user, selectedChat.users);

  return (
    <div className="convo">
      <header className="convo-head">
        <button className="icon-btn back-btn" onClick={() => setSelectedChat(undefined)} aria-label="Back to chats">
          <BackIcon />
        </button>

        {isGroup ? (
          <span className="avatar" style={{ width: 40, height: 40, background: "var(--accent-soft)", color: "var(--accent)" }}>
            <UsersIcon width={20} height={20} />
          </span>
        ) : (
          <Avatar name={title} src={other?.pic} size={40} />
        )}

        <div className="grow">
          <div className="convo-title">{title}</div>
          <div className="convo-sub">
            {isGroup ? `${selectedChat.users.length} members` : other?.email}
          </div>
        </div>

        {isGroup ? (
          <UpdateGroupChatModal
            fetchMessages={fetchMessages}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
          />
        ) : (
          <ProfileModal user={other}>
            <button className="icon-btn" aria-label="View profile"><InfoIcon /></button>
          </ProfileModal>
        )}
      </header>

      {loading ? (
        <div className="placeholder"><span className="spinner spinner-lg" /></div>
      ) : (
        <ScrollableChat messages={messages} isGroupChat={isGroup} isTyping={typingRoom === selectedChat._id} />
      )}

      <form className="composer" onSubmit={sendMessage}>
        <input
          className="input"
          placeholder="Type a message"
          value={newMessage}
          onChange={typingHandler}
          aria-label="Message"
        />
        <button className="send-btn" type="submit" disabled={!newMessage.trim()} aria-label="Send">
          <SendIcon />
        </button>
      </form>
    </div>
  );
};

export default SingleChat;

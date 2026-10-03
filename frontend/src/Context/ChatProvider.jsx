import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("userInfo")) || undefined
  );
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  const navigate = useNavigate();

  // Send logged-out visitors back to the login page
  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(undefined);
    setSelectedChat(undefined);
    setChats(undefined);
    setNotification([]);
    navigate("/");
  };

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        logout,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);

export default ChatProvider;

import { useState } from "react";

import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SidebarHeader from "../components/miscellaneous/SidebarHeader";
import { ChatState } from "../Context/ChatProvider";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, selectedChat } = ChatState();

  if (!user) return null;

  return (
    <div className={`shell ${selectedChat ? "has-chat" : ""}`}>
      <aside className="sidebar">
        <SidebarHeader />
        <MyChats fetchAgain={fetchAgain} />
      </aside>

      <main className="main">
        <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </main>
    </div>
  );
};

export default Chatpage;

import { useState } from "react";

import Avatar from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import ThemeToggle from "../ui/ThemeToggle";
import ProfileModal from "./ProfileModal";
import { BellIcon, ChatIcon, LogoutIcon, UserIcon } from "../ui/Icons";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";

const SidebarHeader = () => {
  const { user, logout, notification, setNotification, setSelectedChat } = ChatState();
  const [profileOpen, setProfileOpen] = useState(false);

  const openNotification = (notif) => {
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n) => n.chat._id !== notif.chat._id));
  };

  return (
    <div className="sidebar-top">
      <div className="brand">
        <span className="brand-mark"><ChatIcon /></span>
        ConnectX
      </div>

      <div className="sidebar-actions">
        <ThemeToggle />

        <Dropdown
          trigger={(open, toggle) => (
            <button className="icon-btn" onClick={toggle} aria-label="Notifications">
              <BellIcon />
              {notification.length > 0 && (
                <span className="badge badge-dot">{notification.length}</span>
              )}
            </button>
          )}
        >
          {notification.length === 0 && <div className="menu-empty">No new messages</div>}
          {notification.map((notif) => (
            <button key={notif._id} className="menu-item" onClick={() => openNotification(notif)}>
              {notif.chat.isGroupChat
                ? `New message in ${notif.chat.chatName}`
                : `New message from ${getSender(user, notif.chat.users)}`}
            </button>
          ))}
        </Dropdown>

        <Dropdown
          trigger={(open, toggle) => (
            <button className="icon-btn" onClick={toggle} aria-label="Account menu" style={{ width: 40 }}>
              <Avatar name={user.name} src={user.pic} size={30} />
            </button>
          )}
        >
          <div className="menu-head">
            <b>{user.name}</b>
            <span>{user.email}</span>
          </div>
          <div className="menu-sep" />
          <button className="menu-item" onClick={() => setProfileOpen(true)}>
            <UserIcon /> My profile
          </button>
          <button className="menu-item danger" onClick={logout}>
            <LogoutIcon /> Log out
          </button>
        </Dropdown>
      </div>

      {/* Lives outside the dropdown so it stays mounted after the menu closes */}
      <ProfileModal user={user} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
};

export default SidebarHeader;

import { useState } from "react";
import axios from "axios";

import Modal from "../ui/Modal";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "../ui/toast";
import { ChatState } from "../../Context/ChatProvider";

const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats, setSelectedChat } = ChatState();
  const auth = { headers: { Authorization: `Bearer ${user.token}` } };

  const reset = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
  };

  const close = () => {
    reset();
    setOpen(false);
  };

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${encodeURIComponent(query)}`, auth);
      setSearchResult(data);
    } catch {
      toaster.create({ title: "Failed to load search results", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toaster.create({ title: "User already added", type: "warning" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSubmit = async () => {
    if (!groupChatName.trim() || selectedUsers.length < 2) {
      toaster.create({
        title: "Add a group name and at least 2 members",
        type: "warning",
      });
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName.trim(),
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        auth
      );

      setChats([data, ...(chats || [])]);
      setSelectedChat(data);
      close();
      toaster.create({ title: "Group created", type: "success" });
    } catch (error) {
      toaster.create({
        title: "Failed to create group",
        description: error.response?.data?.message,
        type: "error",
      });
    }
  };

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ display: "contents" }}>
        {children}
      </span>

      <Modal
        open={open}
        onClose={close}
        title="Create group chat"
        footer={
          <>
            <button className="btn" onClick={close}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Create group</button>
          </>
        }
      >
        <input
          className="input"
          placeholder="Group name"
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Search people to add"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {selectedUsers.length > 0 && (
          <div className="chips">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => setSelectedUsers(selectedUsers.filter((s) => s._id !== u._id))}
              />
            ))}
          </div>
        )}

        <div>
          {loading && <p className="hint">Searching...</p>}
          {!loading &&
            searchResult.slice(0, 5).map((u) => (
              <UserListItem key={u._id} user={u} handleFunction={() => handleGroup(u)} />
            ))}
        </div>
      </Modal>
    </>
  );
};

export default GroupChatModal;

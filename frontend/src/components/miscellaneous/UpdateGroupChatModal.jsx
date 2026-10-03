import { useState } from "react";
import axios from "axios";

import Modal from "../ui/Modal";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { InfoIcon } from "../ui/Icons";
import { toaster } from "../ui/toast";
import { ChatState } from "../../Context/ChatProvider";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const auth = { headers: { Authorization: `Bearer ${user.token}` } };
  const isAdmin = selectedChat.groupAdmin?._id === user._id;

  const showError = (title, error) =>
    toaster.create({ title, description: error.response?.data?.message, type: "error" });

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
    } catch (error) {
      showError("Failed to load search results", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName.trim()) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName.trim() },
        auth
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setGroupChatName("");
      toaster.create({ title: "Group renamed", type: "success" });
    } catch (error) {
      showError("Failed to rename group", error);
    } finally {
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toaster.create({ title: "User is already in this group", type: "warning" });
      return;
    }

    if (!isAdmin) {
      toaster.create({ title: "Only the admin can add members", type: "warning" });
      return;
    }

    try {
      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        auth
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch("");
      setSearchResult([]);
      toaster.create({ title: "Member added", type: "success" });
    } catch (error) {
      showError("Failed to add member", error);
    }
  };

  const handleRemove = async (userToRemove) => {
    if (!isAdmin && userToRemove._id !== user._id) {
      toaster.create({ title: "Only the admin can remove members", type: "warning" });
      return;
    }

    try {
      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        auth
      );

      if (userToRemove._id === user._id) {
        setSelectedChat(undefined);
        setOpen(false);
      } else {
        setSelectedChat(data);
        fetchMessages?.();
      }

      setFetchAgain(!fetchAgain);
      toaster.create({
        title: userToRemove._id === user._id ? "You left the group" : "Member removed",
        type: "success",
      });
    } catch (error) {
      showError("Failed to update group", error);
    }
  };

  return (
    <>
      <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Group details">
        <InfoIcon />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedChat.chatName}
        footer={
          <button className="btn btn-danger" onClick={() => handleRemove(user)}>
            Leave group
          </button>
        }
      >
        <div className="chips">
          {selectedChat.users.map((u) => (
            <UserBadgeItem
              key={u._id}
              user={u}
              admin={selectedChat.groupAdmin}
              handleFunction={() => handleRemove(u)}
            />
          ))}
        </div>

        {isAdmin && (
          <>
            <div className="row-inline">
              <input
                className="input"
                placeholder="Rename group"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleRename} disabled={renameLoading}>
                {renameLoading ? <span className="spinner" /> : "Save"}
              </button>
            </div>

            <input
              className="input"
              placeholder="Add a member"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div>
              {loading && <p className="hint">Searching...</p>}
              {!loading &&
                searchResult.map((u) => (
                  <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                ))}
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

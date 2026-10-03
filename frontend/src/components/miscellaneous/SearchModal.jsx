import { useEffect, useState } from "react";
import axios from "axios";

import Modal from "../ui/Modal";
import UserListItem from "../userAvatar/UserListItem";
import { toaster } from "../ui/toast";
import { ChatState } from "../../Context/ChatProvider";

// Find a user and open (or create) a one-to-one chat with them
const SearchModal = ({ open, onClose }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats, setSelectedChat } = ChatState();

  // Search as the user types (debounced)
  useEffect(() => {
    if (!open) return;

    if (!search.trim()) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user?search=${encodeURIComponent(search)}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setResults(data);
      } catch {
        toaster.create({ title: "Failed to load search results", type: "error" });
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, open, user.token]);

  const accessChat = async (userId) => {
    try {
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      if (!chats?.find((c) => c._id === data._id)) {
        setChats([data, ...(chats || [])]);
      }

      setSelectedChat(data);
      handleClose();
    } catch (error) {
      toaster.create({
        title: "Could not open chat",
        description: error.response?.data?.message,
        type: "error",
      });
    }
  };

  const handleClose = () => {
    setSearch("");
    setResults([]);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Start a new chat">
      <input
        className="input"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      <div>
        {loading && <p className="hint">Searching...</p>}
        {!loading && search.trim() && results.length === 0 && <p className="hint">No users found</p>}
        {!loading &&
          search.trim() &&
          results.map((u) => (
            <UserListItem key={u._id} user={u} handleFunction={() => accessChat(u._id)} />
          ))}
      </div>
    </Modal>
  );
};

export default SearchModal;

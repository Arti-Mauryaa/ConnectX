import { useState } from "react";
import Avatar from "../ui/Avatar";
import Modal from "../ui/Modal";

// Two ways to use it:
//  1) Wrap a trigger:  <ProfileModal user={u}><button>View</button></ProfileModal>
//  2) Controlled:      <ProfileModal user={u} open={open} onClose={() => setOpen(false)} />
const ProfileModal = ({ user, children, open: controlledOpen, onClose }) => {
  const [innerOpen, setInnerOpen] = useState(false);

  if (!user) return null;

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : innerOpen;
  const close = isControlled ? onClose : () => setInnerOpen(false);

  return (
    <>
      {children && (
        <span onClick={() => setInnerOpen(true)} style={{ display: "contents" }}>
          {children}
        </span>
      )}

      <Modal open={open} onClose={close} title="Profile">
        <div className="profile">
          <Avatar name={user.name} src={user.pic} size={96} />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </Modal>
    </>
  );
};

export default ProfileModal;

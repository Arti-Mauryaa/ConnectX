import { CloseIcon } from "../ui/Icons";

// Removable chip for a group member. `admin` is the group admin user object.
const UserBadgeItem = ({ user, handleFunction, admin }) => (
  <button type="button" className="chip" onClick={handleFunction} title="Remove">
    {user.name}
    {admin?._id === user._id && " (admin)"}
    <CloseIcon />
  </button>
);

export default UserBadgeItem;

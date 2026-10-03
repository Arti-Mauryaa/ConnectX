import Avatar from "../ui/Avatar";

const UserListItem = ({ user, handleFunction }) => (
  <button type="button" className="user-row" onClick={handleFunction}>
    <Avatar name={user.name} src={user.pic} size={38} />
    <span>
      {user.name}
      <small>{user.email}</small>
    </span>
  </button>
);

export default UserListItem;

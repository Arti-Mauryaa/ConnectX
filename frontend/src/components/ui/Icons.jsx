const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

const make = (paths) =>
  function Icon(props) {
    return <svg {...base} {...props}>{paths}</svg>;
  };

export const ChatIcon = make(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />);
export const SearchIcon = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const BellIcon = make(<><path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>);
export const PlusIcon = make(<path d="M12 5v14M5 12h14" />);
export const UsersIcon = make(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.4c2.2.7 3.5 2.6 3.5 5.6" /></>);
export const SendIcon = make(<path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" />);
export const SunIcon = make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const MoonIcon = make(<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />);
export const BackIcon = make(<path d="m15 18-6-6 6-6" />);
export const InfoIcon = make(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>);
export const CloseIcon = make(<path d="m6 6 12 12M18 6 6 18" />);
export const LogoutIcon = make(<><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5M5 12h11" /></>);
export const UserIcon = make(<><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></>);

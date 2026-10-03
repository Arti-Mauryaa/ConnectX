export const isSameSenderMargin = (
  messages,
  m,
  i,
  userId
) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id ===
      m?.sender?._id &&
    messages[i]?.sender?._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1]?.sender?._id !==
        m?.sender?._id &&
      messages[i]?.sender?._id !== userId) ||
    (i === messages.length - 1 &&
      messages[i]?.sender?._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (
  messages,
  m,
  i,
  userId
) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1]?.sender?._id !==
      m?.sender?._id ||
      messages[i + 1]?.sender?._id ===
        undefined) &&
    messages[i]?.sender?._id !== userId
  );
};

export const isLastMessage = (
  messages,
  i,
  userId
) => {
  return (
    i === messages.length - 1 &&
    messages[i]?.sender?._id !== userId &&
    messages[i]?.sender?._id
  );
};

export const isSameUser = (
  messages,
  m,
  i
) => {
  return (
    i > 0 &&
    messages[i - 1]?.sender?._id ===
      m?.sender?._id
  );
};

export const getSender = (
  loggedUser,
  users
) => {
  if (!loggedUser || !users?.length) {
    return "";
  }

  return users[0]?._id === loggedUser?._id
    ? users[1]?.name
    : users[0]?.name;
};

export const getSenderFull = (
  loggedUser,
  users
) => {
  if (!loggedUser || !users?.length) {
    return null;
  }

  return users[0]?._id === loggedUser?._id
    ? users[1]
    : users[0];
};

export const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export const formatDay = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
};

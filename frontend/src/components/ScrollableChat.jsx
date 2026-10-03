import { Fragment, useEffect, useRef } from "react";

import Avatar from "./ui/Avatar";
import { formatDay, formatTime } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages, isGroupChat, isTyping }) => {
  const { user } = ChatState();
  const listRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="messages" ref={listRef}>
      {messages.map((m, i) => {
        const mine = m.sender._id === user._id;
        const prev = messages[i - 1];
        const next = messages[i + 1];

        const sameAsPrev = prev && prev.sender._id === m.sender._id;
        const lastOfGroup = !next || next.sender._id !== m.sender._id;
        const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();

        return (
          <Fragment key={m._id}>
            {newDay && <div className="day-sep">{formatDay(m.createdAt)}</div>}

            <div className={`msg-row ${mine ? "mine" : "theirs"} ${sameAsPrev && !newDay ? "same" : ""}`}>
              {!mine &&
                (lastOfGroup ? (
                  <Avatar name={m.sender.name} src={m.sender.pic} size={30} />
                ) : (
                  <span className="msg-spacer" />
                ))}

              <div className="bubble">
                {!mine && isGroupChat && (!sameAsPrev || newDay) && (
                  <div className="bubble-name">{m.sender.name}</div>
                )}
                {m.content}
                <span className="bubble-time">{formatTime(m.createdAt)}</span>
              </div>
            </div>
          </Fragment>
        );
      })}

      {isTyping && (
        <div className="typing" aria-label="Typing">
          <i /><i /><i />
        </div>
      )}

    </div>
  );
};

export default ScrollableChat;

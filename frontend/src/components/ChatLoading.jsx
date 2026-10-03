const ChatLoading = ({ rows = 7 }) => (
  <div>
    {Array.from({ length: rows }).map((_, i) => (
      <div className="skeleton" key={i}>
        <div className="sk sk-circle" />
        <div className="sk-lines">
          <div className="sk sk-line" style={{ width: "55%" }} />
          <div className="sk sk-line" style={{ width: "80%" }} />
        </div>
      </div>
    ))}
  </div>
);

export default ChatLoading;

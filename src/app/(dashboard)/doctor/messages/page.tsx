

// reuse the same component; it will automatically load rooms for doctor as well
// because the backend returns rooms filtered by role

import ConversationList from "../../patient/_components/messages/ConversationList";

const Messages = () => {
  return (
    <div className="h-[calc(100vh-200px)]">
      <ConversationList />
    </div>
  );
};

export default Messages;

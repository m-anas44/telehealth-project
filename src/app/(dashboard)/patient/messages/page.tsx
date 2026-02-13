
import AIAssistant from "../_components/messages/AIAssistant";
import ConversationList from "../_components/messages/ConversationList";

const Messages = () => {

  
  return (
    <div className="h-[calc(100vh-200px)]">
      {/* AI Assistant Placeholder */}
      <AIAssistant />

  
        {/* Conversations List */}
        <ConversationList />

    </div>
  );
};

export default Messages;

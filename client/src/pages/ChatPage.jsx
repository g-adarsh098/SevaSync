import { useNavigate } from 'react-router-dom';
import { DEMO_CHATS, DEMO_NGOS, DEMO_VOLUNTEERS } from '../utils/demoData';

export default function ChatPage() {
  const navigate = useNavigate();

  const getParticipantInfo = (chat) => {
    const otherId = chat.participants.find(p => p !== 'vol-1') || chat.participants[0];
    const ngo = DEMO_NGOS.find(n => n.uid === otherId);
    const vol = DEMO_VOLUNTEERS.find(v => v.uid === otherId);
    return ngo || vol || { displayName: 'Unknown', uid: otherId };
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page animate-fade">
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem' }}>💬 Messages</h1>
      </div>

      {DEMO_CHATS.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <div className="empty-title">No conversations yet</div>
          <div className="empty-text">Apply to a task to start chatting with NGOs</div>
        </div>
      ) : (
        <div className="chat-list">
          {DEMO_CHATS.map(chat => {
            const other = getParticipantInfo(chat);
            return (
              <div key={chat.id} className="chat-item" onClick={() => navigate(`/chat/${chat.id}`)} id={`chat-${chat.id}`}>
                <div className="avatar">{(other.displayName || 'U')[0]}</div>
                <div className="chat-info">
                  <div className="chat-name">{other.orgName || other.displayName}</div>
                  <div className="chat-preview">{chat.lastMessage}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div className="chat-time">{formatTime(chat.updatedAt)}</div>
                  {chat.unread > 0 && <div className="chat-unread">{chat.unread}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

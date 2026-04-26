import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEMO_MESSAGES, DEMO_NGOS } from '../utils/demoData';

export default function ChatRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(DEMO_MESSAGES.filter(m => m.chatId === id));
  const [newMsg, setNewMsg] = useState('');
  const bottomRef = useRef(null);
  const currentUserId = 'vol-1'; // demo user

  const otherUser = DEMO_NGOS.find(n => n.uid === 'ngo-1') || { displayName: 'NGO', orgName: 'Organization' };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: `msg-${Date.now()}`, chatId: id,
      senderId: currentUserId, text: newMsg.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, msg]);
    setNewMsg('');

    // Simulate AI auto-reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Thank you for your message! We'll get back to you shortly.",
        "That sounds great! Looking forward to having you on board.",
        "Sure, I'll share the details with you right away.",
        "We really appreciate your interest in volunteering with us! 🙌"
      ];
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`, chatId: id,
        senderId: 'ngo-1',
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date()
      }]);
    }, 1500);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-room">
      <div className="chat-room-header">
        <button className="back-btn" onClick={() => navigate('/chat')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div className="avatar avatar-sm">{(otherUser.orgName || 'O')[0]}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{otherUser.orgName || otherUser.displayName}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>Online</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.senderId === currentUserId ? 'message-sent' : 'message-received'}`}>
            <div>{msg.text}</div>
            <div className="message-time">{formatTime(msg.timestamp)}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={newMsg}
          onChange={e => setNewMsg(e.target.value)}
          id="chat-input"
        />
        <button type="submit" className="btn btn-primary btn-icon" id="chat-send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    </div>
  );
}

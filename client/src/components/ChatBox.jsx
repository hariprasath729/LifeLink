import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5001");

const ChatBox = ({ requestId, user, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const chatBodyRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: requestId,
        author: user.role,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    if (requestId) {
      socket.emit("join_room", requestId);
    }
    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandler);
    return () => {
      socket.off("receive_message", messageHandler);
    };
  }, [requestId]);
  
  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messageList]);

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50">
      <div className="flex justify-between items-center p-3 bg-primary text-white rounded-t-2xl">
        <h3 className="font-bold">Coordination Chat</h3>
        <button onClick={onClose} className="text-xl font-bold">&times;</button>
      </div>
      <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messageList.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${user.role === msg.author ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${user.role === msg.author ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
              <p className="text-sm">{msg.message}</p>
              <p className={`text-xs mt-1 ${user.role === msg.author ? 'text-gray-200' : 'text-gray-500'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t bg-white rounded-b-2xl">
        <div className="flex items-center">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-black placeholder:text-gray-500" // <-- CORRECTED
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="ml-3 w-16 btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
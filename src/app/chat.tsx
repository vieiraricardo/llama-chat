'use client';

import { Markdown } from '@/components/Markdown';
import { useChat } from '@/hooks/useChat';
import { FiSend } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { FaUserSecret } from 'react-icons/fa';
import { useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/generate',
    headers: { 'Content-Type': 'application/json' },
  });

  const messageIdentifier = {
    user: (
      <div className="flex gap-2 text-[18px] my-1">
        <FaUserSecret size={24} />
        You
      </div>
    ),
    assistant: (
      <div className="flex gap-2 text-[18px] my-1">
        <BsRobot size={24} />
        Assistant
      </div>
    ),
  };

  useEffect(() => {
    const messageContainer = document.querySelector('.message-container');

    if (messageContainer) {
      messageContainer.scrollTo(0, messageContainer.scrollHeight);
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-center items-center p-10 h-[100vh] text-[14px]">
      <div className="flex flex-col h-full w-full max-w-[700px] overflow-y-auto [&::-webkit-scrollbar]:hidden message-container">
        {messages.map((m) => (
          <div key={m.id} className="mb-10">
            <div className="flex w-full font-bold">
              {messageIdentifier[m.role]}
            </div>
            <Markdown content={m.content} />
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => handleSubmit(e, { prompt: input, id: Date.now() })}
        className="flex flex-col w-full max-w-[700px] mt-10 relative justify-center"
      >
        <label>
          <input
            autoFocus
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything"
            className="bg-transparent outline-0 text-gray-600 h-[50px] w-full rounded-md px-2 border-gray-300 border-[0.5px] dark:text-white"
          />
        </label>
        <button type="submit" className="absolute right-4">
          <FiSend size={24} />
        </button>
      </form>
    </div>
  );
}

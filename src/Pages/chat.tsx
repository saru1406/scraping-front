import React, { useState } from "react";

type Chat = {
    text: string
}

const ChatPage = () => {
    const [chat, setChat] = useState('');
    const [chatResponse, setChatResponse] = useState<Chat | null>(null);

    const postChat = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const url = 'http://localhost:80/prompts';
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: chat }),
        });
        if (response.ok) {
          const data: Chat = await response.json();
          setChatResponse(data);
          setChat(''); // Clear the input field
          console.log(chatResponse);
        } else {
          console.error('エラーが発生しました');
        }
      } catch (error) {
        console.error('ネットワークエラーが発生しました', error);
      }
    };

    return (
        <div className="flex flex-col h-screen">
          <div className="flex flex-1">
            <div className="w-64 bg-gray-800 text-white p-4">
              <h2 className="text-xl font-bold mb-4">Sidebar</h2>
              <ul>
                <li className="mb-2"><a href="#" className="hover:text-gray-300">Home</a></li>
                <li className="mb-2"><a href="#" className="hover:text-gray-300">Profile</a></li>
                <li className="mb-2"><a href="#" className="hover:text-gray-300">Settings</a></li>
              </ul>
            </div>
            <div className="flex-1 p-4 flex flex-col">
              <div className="container mx-auto mb-4 flex-1">
                <h1 className="text-2xl font-bold mb-4">Welcome to the Chat Page</h1>
                {chatResponse && (
                  <div className="mt-4 p-2 border border-gray-400 rounded">
                    <p>{chatResponse.text}</p>
                  </div>
                )}
              </div>
              <form className="flex" onSubmit={postChat}>
              <input
                type="text"
                className="flex-1 p-2 border border-gray-400 rounded mr-2"
                placeholder="Type your message..."
                value={chat}
                onChange={(e) => setChat(e.target.value)}
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
            </form>
            </div>
          </div>
        </div>
      );
    };

export default ChatPage;

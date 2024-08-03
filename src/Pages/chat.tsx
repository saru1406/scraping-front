import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

type Chat = {
    text: string;
    sender: 'user' | 'bot';
};

const ChatPage = () => {
    const [chat, setChat] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (chatHistory.length > 0) {
            let index = 0;
            let messageIndex = 0;
            setDisplayedText('');
            const interval = setInterval(() => {
                if (messageIndex < chatHistory.length) {
                    if (index < chatHistory[messageIndex].text.length) {
                        setDisplayedText(prev => prev + chatHistory[messageIndex].text.charAt(index));
                        index++;
                    } else {
                        index = 0;
                        messageIndex++;
                        setDisplayedText(prev => prev + '\n');
                    }
                } else {
                    clearInterval(interval);
                }
            }, 10);
            return () => clearInterval(interval);
        }
    }, [chatHistory]);
    

    const postChat = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const url = 'http://localhost:80/prompts';
        try {
            const userMessage: Chat = { text: chat, sender: 'user' };
            setChatHistory(prev => [...prev, userMessage]);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: chat }),
            });
            if (response.ok) {
                const data = await response.json();
                const botMessage: Chat = { text: data.text, sender: 'bot' };
                setChatHistory(prev => [...prev, botMessage]);
                setDisplayedText('');
                setChat('');
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
                    <div className="container mx-auto mb-4 flex-1 overflow-y-auto">
                        <h1 className="text-2xl font-bold mb-4">Welcome to the Chat Page</h1>
                        {chatHistory.map((message, index) => (
                            <div
                                key={index}
                                className={`mt-2 mb-2 p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-200 text-black ml-auto w-72' : 'bg-gray-100 text-black self-start'}`}
                                style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={coy}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        ))}
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

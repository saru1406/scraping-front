import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Link } from "react-router-dom";

type Chat = {
    text: string;
    role: 'user' | 'assistant';
};

const ChatPage = () => {
    const [chat, setChat] = useState('');
    const [chatHistory, setChatHistory] = useState<Chat[]>([]);
    console.log(chatHistory)

    useEffect(() => {
        if (chatHistory.length > 0) {
            let index = 0;
            let messageIndex = 0;
            const interval = setInterval(() => {
                if (messageIndex < chatHistory.length) {
                    if (index < chatHistory[messageIndex].text.length) {
                        index++;
                    } else {
                        index = 0;
                        messageIndex++;
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
        const url = import.meta.env.VITE_API_BASE_URL+'/prompts';
        try {
            const userMessage: Chat = { text: chat, role: 'user' };
            const updatedHistory = [...chatHistory, userMessage];
            setChatHistory(updatedHistory);
            setChat('');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: updatedHistory }),
            });
            if (response.ok) {
                // サーバーからの返信を履歴に追加
                const data = await response.json();
                const botMessage: Chat = { text: data.text, role: 'assistant' };
                setChatHistory(prev => [...prev, botMessage]);
                setChat('');
            } else {
                console.error('エラーが発生しました');
            }
        } catch (error) {
            console.error('ネットワークエラーが発生しました', error);
        }
    };

    return (
        <div className="flex">
            {/* サイドバー */}
            <div className="w-64 bg-gray-800 text-white p-4 h-screen fixed">
                <h2 className="text-xl font-bold mb-10">RagChat</h2>
                <ul>
                    <li className="mb-8">
                        <Link to="/" className="hover:text-gray-300 text-xl">案件検索</Link>
                    </li>
                    {/* <li className="mb-10">
                        <Link to="/custom" className="hover:text-gray-300 text-xl">カスタム</Link>
                    </li> */}
                </ul>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1 flex flex-col ml-64 p-4 h-screen">
                {/* チャット履歴 */}
                <div className="flex-1 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4">案件検索</h1>
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`mt-2 mb-2 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-200 text-black ml-auto w-72' : 'bg-gray-100 text-black self-start'}`}
                            style={{ maxWidth: '80%', whiteSpace: 'pre-wrap' }}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    code({
                                        inline,
                                        className,
                                        children,
                                        ...props
                                    }: {
                                        inline?: boolean;
                                        className?: string;
                                        children?: React.ReactNode;
                                    }) {
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

                {/* 入力フォーム */}
                <form className="flex mt-auto" onSubmit={postChat}>
                    <input
                        type="text"
                        className="flex-1 p-2 border border-gray-400 rounded mr-2"
                        placeholder="メッセージを入力してください"
                        value={chat}
                        onChange={(e) => setChat(e.target.value)}
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">送信</button>
                </form>
                <div>
                    <Link to="/index" className="text-blue-500 hover:text-blue-700">登録データ確認</Link>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
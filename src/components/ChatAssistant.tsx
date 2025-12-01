import React, { useState } from "react";

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    options?: string[];
}

export default function ChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "👋 ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            isBot: true,
        },
    ]);
    const [inputText, setInputText] = useState("");

    /** --------------------------
     *  🔥 Llamada a tu API real
     * --------------------------- */
    const askAI = async (question: string): Promise<string> => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || "";

            const res = await fetch(`${API_URL}/api/ia/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            return data.answer || "No pude procesar tu solicitud, intenta nuevamente.";
        } catch (err) {
            return "❌ Error al conectar con el servidor de IA.";
        }
    };

    /** --------------------------
     *  ✉ Enviar mensaje
     * --------------------------- */
    const handleSend = async (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText) return;

        const userMessage: Message = {
            id: Date.now(),
            text: messageText,
            isBot: false,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        const loadingMessage: Message = {
            id: Date.now() + 1,
            text: "Escribiendo...",
            isBot: true,
        };
        setMessages((prev) => [...prev, loadingMessage]);

        const aiResponse = await askAI(messageText);

        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === loadingMessage.id
                    ? { ...msg, text: aiResponse }
                    : msg
            )
        );
    };

    const handleOptionClick = (option: string) => {
        handleSend(option);
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50"
                    aria-label="Abrir asistente virtual"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                🤖
                            </div>
                            <div>
                                <h3 className="font-semibold">Asistente Virtual</h3>
                                <p className="text-xs text-blue-100">Siempre disponible</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-2 transition"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={msg.isBot ? "" : "flex justify-end"}>
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${
                                        msg.isBot
                                            ? "bg-white shadow-sm border border-gray-200"
                                            : "bg-blue-600 text-white"
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{msg.text}</p>

                                    {msg.options && msg.isBot && (
                                        <div className="mt-3 space-y-2">
                                            {msg.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleOptionClick(option)}
                                                    className="block w-full text-left text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition border border-blue-200"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Escribe tu pregunta..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

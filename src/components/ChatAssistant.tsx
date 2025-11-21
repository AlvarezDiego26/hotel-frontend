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
            options: [
                "Buscar hotel por ciudad",
                "Ver hoteles disponibles",
                "Información sobre reservas",
                "Ayuda con pagos",
            ],
        },
    ]);
    const [inputText, setInputText] = useState("");

    const getResponse = (userMessage: string): Message => {
        const lowerMsg = userMessage.toLowerCase();

        // Búsqueda por ciudad
        if (lowerMsg.includes("ciudad") || lowerMsg.includes("buscar")) {
            return {
                id: Date.now(),
                text: "¿En qué ciudad te gustaría hospedarte?",
                isBot: true,
                options: ["Arequipa", "Lima", "Cusco", "Ver todos"],
            };
        }

        // Específico Arequipa
        if (lowerMsg.includes("arequipa")) {
            return {
                id: Date.now(),
                text: "¡Excelente elección! Tenemos 58 hoteles en Arequipa. ¿Qué distrito prefieres?",
                isBot: true,
                options: ["Cayma", "Yanahuara", "Cercado", "Ver todos los distritos"],
            };
        }

        // Distritos específicos
        if (lowerMsg.includes("cayma")) {
            return {
                id: Date.now(),
                text: "En Cayma tenemos 2 hoteles disponibles con habitaciones desde $40/noche. ¿Quieres ver los detalles?",
                isBot: true,
                options: ["Sí, ver hoteles", "Cambiar distrito", "Volver al inicio"],
            };
        }

        // Información de disponibilidad
        if (lowerMsg.includes("disponible") || lowerMsg.includes("ver")) {
            return {
                id: Date.now(),
                text: "Actualmente tenemos más de 800 habitaciones disponibles. ¿Qué tipo de habitación buscas?",
                isBot: true,
                options: ["Individual ($40)", "Doble ($60)", "Suite ($120)", "Familiar ($90)"],
            };
        }

        // Información sobre reservas
        if (lowerMsg.includes("reserva") || lowerMsg.includes("reservar")) {
            return {
                id: Date.now(),
                text: "Para hacer una reserva:\n1. Selecciona un hotel\n2. Elige fechas (solo de lunes a viernes)\n3. Completa el pago\n\n¿Necesitas ayuda con algún paso?",
                isBot: true,
                options: ["Buscar hotel", "Ver mis reservas", "Políticas de cancelación"],
            };
        }

        // Información sobre pagos
        if (lowerMsg.includes("pago") || lowerMsg.includes("pagar")) {
            return {
                id: Date.now(),
                text: "Aceptamos los siguientes métodos de pago:\n💳 Tarjeta de crédito/débito\n🅿️ PayPal\n🏦 Transferencia bancaria\n💸 Culqi\n\n¿Con cuál prefieres pagar?",
                isBot: true,
                options: ["Tarjeta", "PayPal", "Transferencia", "Más información"],
            };
        }

        // Políticas
        if (lowerMsg.includes("cancelación") || lowerMsg.includes("política")) {
            return {
                id: Date.now(),
                text: "Puedes cancelar tu reserva en cualquier momento. Las solicitudes de reembolso son revisadas por nuestro equipo. ¿Necesitas cancelar una reserva?",
                isBot: true,
                options: ["Sí, cancelar", "Ver mis reservas", "Volver"],
            };
        }

        // Precios
        if (lowerMsg.includes("precio") || lowerMsg.includes("cuánto") || lowerMsg.includes("cuesta")) {
            return {
                id: Date.now(),
                text: "Nuestros precios varían según el tipo de habitación:\n\n💰 Individual: $40/noche\n💰 Doble: $60/noche\n💰 Suite: $120/noche\n💰 Familiar: $90/noche\n\n¿Qué tipo te interesa?",
                isBot: true,
                options: ["Individual", "Doble", "Suite", "Familiar"],
            };
        }

        // Hoteles con mejores calificaciones
        if (lowerMsg.includes("mejor") || lowerMsg.includes("recomend") || lowerMsg.includes("estrella")) {
            return {
                id: Date.now(),
                text: "Te recomiendo nuestros hoteles de 4-5 estrellas con las mejores ubicaciones. ¿En qué zona prefieres hospedarte?",
                isBot: true,
                options: ["Centro histórico", "Zona residencial", "Cerca de parques", "Cualquiera"],
            };
        }

        // Respuesta por defecto
        return {
            id: Date.now(),
            text: "Entiendo. ¿Cómo puedo ayudarte mejor?",
            isBot: true,
            options: [
                "Buscar hotel",
                "Ver disponibilidad",
                "Información de precios",
                "Hablar con soporte",
            ],
        };
    };

    const handleSend = (text?: string) => {
        const messageText = text || inputText.trim();
        if (!messageText) return;

        // Agregar mensaje del usuario
        const userMessage: Message = {
            id: Date.now(),
            text: messageText,
            isBot: false,
        };
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Simular delay de respuesta del bot
        setTimeout(() => {
            const botResponse = getResponse(messageText);
            setMessages((prev) => [...prev, botResponse]);
        }, 800);
    };

    const handleOptionClick = (option: string) => {
        handleSend(option);
    };

    return (
        <>
            {/* Botón flotante */}
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

            {/* Ventana de chat */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
                    {/* Header */}
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

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={msg.isBot ? "" : "flex justify-end"}>
                                <div
                                    className={`max-w-[80%] rounded-2xl p-3 ${msg.isBot
                                            ? "bg-white shadow-sm border border-gray-200"
                                            : "bg-blue-600 text-white"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{msg.text}</p>

                                    {/* Opciones de respuesta rápida */}
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

                    {/* Input */}
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

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Upload, FileText, ArrowLeft, Bot, User as UserIcon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [pdfUploading, setPdfUploading] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<{ subject: string } | null>(null);
    const [pdfCount, setPdfCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSession();
        // In a real app, we'd fetch previous messages here
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchSession = async () => {
        try {
            const response = await api.get("/session/current");
            if (!response.data) {
                navigate("/dashboard");
                return;
            }
            setSessionInfo(response.data);
        } catch (error) {
            console.error("Error fetching session", error);
            navigate("/dashboard");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            // Use params for message as per backend definition
            const response = await api.post("/chat/", null, {
                params: { message: userMsg }
            });

            const aiReply = response.data.answer;
            setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages((prev) => [...prev, { role: "ai", content: "Sorry, I encountered an error connecting to the AI." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        setPdfUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            await api.post("/pdf/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setPdfCount(prev => prev + 1);
            // Optional: Add a system message or toast
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setPdfUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    return (
        <div className="flex h-screen bg-black text-foreground overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="w-64 bg-zinc-900 border-r border-white/10 hidden md:flex flex-col p-4"
            >
                <div className="flex items-center gap-2 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="font-bold text-lg truncate">{sessionInfo?.subject || "Chat"}</h1>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Resources</h3>

                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="flex items-center text-zinc-400">
                                <FileText className="w-4 h-4 mr-2" /> PDFs Indexed
                            </span>
                            <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">{pdfCount}</span>
                        </div>

                        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-zinc-700 hover:border-primary/50 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors mt-4 group">
                            <div className="flex flex-col items-center pt-5 pb-6 text-center">
                                <Upload className="w-6 h-6 text-zinc-500 group-hover:text-primary mb-2 transition-colors" />
                                <p className="text-xs text-zinc-500 group-hover:text-zinc-300">Upload PDF</p>
                            </div>
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={pdfUploading} />
                        </label>
                        {pdfUploading && <p className="text-xs text-center mt-2 text-primary animate-pulse">Uploading...</p>}
                    </div>
                </div>
            </motion.aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative bg-zinc-950/50">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b border-white/10 bg-zinc-900">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="mr-2">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <span className="font-bold">{sessionInfo?.subject}</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <AnimatePresence initial={false}>
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50"
                            >
                                <Bot className="w-16 h-16 mb-4 text-zinc-700" />
                                <p className="text-xl font-medium text-zinc-500">How can I help you master {sessionInfo?.subject} today?</p>
                            </motion.div>
                        ) : (
                            messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex items-start max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary" : "bg-zinc-700"}`}>
                                            {msg.role === "user" ? <UserIcon className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-zinc-300" />}
                                        </div>

                                        <div className={`p-4 rounded-2xl ${msg.role === "user"
                                                ? "bg-primary text-white rounded-tr-sm"
                                                : "bg-zinc-800 text-zinc-100 rounded-tl-sm border border-white/5"
                                            }`}>
                                            {msg.role === "ai" ? (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p>{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-zinc-300" />
                                    </div>
                                    <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-sm border border-white/5 flex gap-1 items-center">
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-900 border-t border-white/10">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center gap-2">
                        {/* Mobile Upload Button */}
                        <div className="md:hidden">
                            <label className="cursor-pointer p-2 text-zinc-400 hover:text-white transition-colors">
                                <Upload className="w-5 h-5" />
                                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={pdfUploading} />
                            </label>
                        </div>

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask anything..."
                            className="flex-1 bg-black/50 border-zinc-700 focus:border-primary rounded-full px-6 py-6"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="rounded-full h-12 w-12 shrink-0 bg-primary hover:bg-primary/90"
                            disabled={!input.trim() || loading}
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                    <p className="text-center text-xs text-zinc-600 mt-2">
                        BackBencher AI can make mistakes. Check your notes.
                    </p>
                </div>
            </main>
        </div>
    );
}

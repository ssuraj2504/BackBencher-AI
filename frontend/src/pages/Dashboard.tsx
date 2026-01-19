import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import { LogOut, BookOpen, Plus, ArrowRight } from "lucide-react";

interface Session {
    id: number;
    subject: string;
    is_active: number;
}

export default function Dashboard() {
    const [session, setSession] = useState<Session | null>(null);
    const [subject, setSubject] = useState("");
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);

    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSession();
    }, []);

    const fetchSession = async () => {
        try {
            const response = await api.get("/session/current");
            setSession(response.data);
        } catch (error) {
            console.error("Failed to fetch session", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim()) return;

        setStarting(true);
        try {
            const response = await api.post("/session/start", { subject });
            setSession(response.data);
            navigate("/chat");
        } catch (error) {
            console.error("Failed to start session", error);
        } finally {
            setStarting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

            {/* Navbar */}
            <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <span className="text-primary">BackBencher</span> AI
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-white">
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-4">
                        What do you want to learn today?
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Master any subject with your personalized AI tutor.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Active Session Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                        <div className="relative h-full bg-zinc-900 border border-white/10 rounded-xl p-8 flex flex-col items-start">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-primary">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Continue Learning</h3>

                            {loading ? (
                                <div className="text-muted-foreground">Loading...</div>
                            ) : session ? (
                                <>
                                    <p className="text-muted-foreground mb-8">
                                        You have an active session for <span className="text-white font-medium">{session.subject}</span>.
                                    </p>
                                    <Button asChild className="w-full mt-auto" size="lg">
                                        <Link to="/chat">
                                            Resume Session <ArrowRight className="w-4 h-4 ml-2" />
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <p className="text-muted-foreground mb-8">No active session found. Start one to begin.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* New Session Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative h-full bg-zinc-900 border border-white/10 rounded-xl p-8 flex flex-col">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6 text-emerald-400">
                                <Plus className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">New Session</h3>
                            <p className="text-muted-foreground mb-6">Start learning a new subject from scratch.</p>

                            <form onSubmit={handleStartSession} className="mt-auto space-y-4">
                                <Input
                                    placeholder="Enter Subject (e.g., DBMS, Physics)"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                    className="bg-black/30 border-white/10"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    disabled={starting || !subject}
                                >
                                    {starting ? "Starting..." : "Start Learning"}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const setToken = useAuthStore((state) => state.setToken);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            setToken(response.data.access_token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black/95 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-md p-4"
            >
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            BackBencher AI
                        </h1>
                        <p className="text-muted-foreground mt-2">Welcome back, future genius.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-black/20 border-white/10 focus:border-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-black/20 border-white/10 focus:border-primary/50"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 transition-opacity" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

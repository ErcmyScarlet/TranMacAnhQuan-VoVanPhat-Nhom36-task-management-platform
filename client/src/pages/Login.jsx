import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignIn, UserCircle, LockKey, ArrowRight } from "@phosphor-icons/react";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await login({ email, password });
            const token = res?.token || res?.data?.token;
            const user = res?.user || res?.data?.user;

            if (!token) {
                throw new Error("Không nhận được token từ server");
            }

            loginUser(token, user);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Đăng nhập thất bại");
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-surface shadow-soft grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-accent to-blue-600 p-8 md:p-10 text-white flex items-center">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <SignIn size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold">TaskFlow</h1>
                            <p className="text-sm text-white/90 mt-2">Quản lý công việc thông minh và đơn giản.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-ink">Đăng nhập</h2>
                    <p className="text-sm text-muted mt-1">Chào mừng bạn trở lại</p>

                    <form onSubmit={handleLogin} className="mt-6 space-y-4">
                        <FormField label="Email" id="email">
                            <div className="relative">
                                <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <FormField label="Mật khẩu" id="password">
                            <div className="relative">
                                <LockKey size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <Button type="submit" className="w-full">
                            Đăng nhập <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="text-sm text-muted mt-6">
                        Chưa có tài khoản? <Link to="/register" className="text-accent font-medium">Đăng ký ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
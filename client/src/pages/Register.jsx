import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserCircle, LockKey, EnvelopeSimple, ArrowRight } from "@phosphor-icons/react";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { loginUser } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await register({ name, email, password });
            const token = res?.token || res?.data?.token;
            const user = res?.user || res?.data?.user;

            if (token) {
                loginUser(token, user);
                navigate("/dashboard", { replace: true });
            } else {
                alert("Đăng ký thành công, vui lòng đăng nhập");
                navigate("/");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-surface shadow-soft grid md:grid-cols-2">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 md:p-10 text-white flex items-center">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <UserCircle size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold">Tạo tài khoản</h1>
                            <p className="text-sm text-white/90 mt-2">Bắt đầu quản lý công việc cùng QP.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold text-ink">Đăng ký</h2>
                    <p className="text-sm text-muted mt-1">Điền thông tin để tạo tài khoản mới</p>

                    <form onSubmit={handleRegister} className="mt-6 space-y-4">
                        <FormField label="Họ và tên" id="name">
                            <div className="relative">
                                <UserCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Họ và tên"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <FormField label="Email" id="email">
                            <div className="relative">
                                <EnvelopeSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
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
                            Đăng ký <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="text-sm text-muted mt-6">
                        Đã có tài khoản? <Link to="/" className="text-accent font-medium">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
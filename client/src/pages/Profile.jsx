import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LockKey, PencilSimple, CheckCircle, ArrowLeft } from "@phosphor-icons/react";

import AppLayout from "../components/layout/AppLayout";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import FormField from "../components/common/FormField";
import Badge from "../components/common/Badge";

import { getProfile, updateProfile, changePassword } from "../services/userService";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [profileMsg, setProfileMsg] = useState("");
    const [profileErr, setProfileErr] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMsg, setPasswordMsg] = useState("");
    const [passwordErr, setPasswordErr] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getProfile();
            setUser(data);
            setName(data.name || "");
        } catch (err) {
            setProfileErr(err.response?.data?.message || "Không lấy được thông tin profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMsg("");
        setProfileErr("");

        if (!name.trim()) {
            setProfileErr("Tên không được để trống");
            return;
        }

        try {
            const data = await updateProfile({ name: name.trim() });
            setUser(data.user || { ...user, name: name.trim() });
            setEditMode(false);
            setProfileMsg("Cập nhật thông tin thành công");

            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            storedUser.name = name.trim();
            localStorage.setItem("user", JSON.stringify(storedUser));
        } catch (err) {
            setProfileErr(err.response?.data?.message || "Cập nhật thất bại");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMsg("");
        setPasswordErr("");

        if (!currentPassword || !newPassword) {
            setPasswordErr("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordErr("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordErr("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await changePassword({ currentPassword, newPassword });
            setPasswordMsg("Đổi mật khẩu thành công");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordErr(err.response?.data?.message || "Đổi mật khẩu thất bại");
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-muted text-sm">Đang tải thông tin...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <p className="text-sm font-medium text-muted">Cài đặt</p>
                        <h1 className="text-2xl font-semibold text-ink">Thông tin cá nhân</h1>
                    </div>
                </div>

                {/* Profile Info Card */}
                <Card className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                                <UserCircle size={32} className="text-accent" weight="duotone" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-ink">{user?.name || "Người dùng"}</h2>
                                <p className="text-sm text-muted">{user?.email}</p>
                            </div>
                        </div>
                        <Badge tone={user?.role === "admin" ? "high" : "medium"}>
                            {user?.role === "admin" ? "Admin" : "User"}
                        </Badge>
                    </div>

                    {profileMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                            <CheckCircle size={18} /> {profileMsg}
                        </div>
                    )}
                    {profileErr && (
                        <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                            {profileErr}
                        </div>
                    )}

                    {editMode ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <FormField label="Họ tên" id="profile-name">
                                <Input
                                    id="profile-name"
                                    type="text"
                                    placeholder="Nhập tên của bạn"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </FormField>

                            <FormField label="Email" id="profile-email">
                                <Input
                                    id="profile-email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="opacity-60 cursor-not-allowed"
                                />
                            </FormField>

                            <div className="flex gap-3">
                                <Button type="submit">
                                    <CheckCircle size={18} /> Lưu thay đổi
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setEditMode(false);
                                        setName(user?.name || "");
                                        setProfileErr("");
                                    }}
                                >
                                    Hủy
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-xl border border-border bg-bg px-4 py-3">
                                <div>
                                    <p className="text-xs text-muted">Họ tên</p>
                                    <p className="text-sm font-medium text-ink">{user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted">Email</p>
                                    <p className="text-sm font-medium text-ink">{user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted">Vai trò</p>
                                    <p className="text-sm font-medium text-ink capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => setEditMode(true)}>
                                <PencilSimple size={18} /> Chỉnh sửa thông tin
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Change Password Card */}
                <Card className="space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                            <LockKey size={22} className="text-warning" weight="duotone" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-ink">Đổi mật khẩu</h2>
                            <p className="text-sm text-muted">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                        </div>
                    </div>

                    {passwordMsg && (
                        <div className="flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 px-4 py-3 text-sm text-success">
                            <CheckCircle size={18} /> {passwordMsg}
                        </div>
                    )}
                    {passwordErr && (
                        <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger">
                            {passwordErr}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <FormField label="Mật khẩu hiện tại" id="current-password">
                            <div className="relative">
                                <LockKey size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="current-password"
                                    type="password"
                                    placeholder="Nhập mật khẩu hiện tại"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <FormField label="Mật khẩu mới" id="new-password">
                            <div className="relative">
                                <LockKey size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <FormField label="Xác nhận mật khẩu mới" id="confirm-password">
                            <div className="relative">
                                <LockKey size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </FormField>

                        <Button type="submit">
                            <LockKey size={18} /> Đổi mật khẩu
                        </Button>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}

export default Profile;

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { House, FolderSimple, ChartBar, SignOut } from "@phosphor-icons/react";

const navItems = [
  { icon: House, label: "Trang chủ", href: "/" },
  { icon: ChartBar, label: "Dashboard", href: "/dashboard" },
  { icon: FolderSimple, label: "Projects", href: "/projects" },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/", { replace: true });
  };

  return (
    <aside className="w-64 shrink-0 bg-ink text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6">
        <span className="font-display font-semibold text-lg">QP</span>
      </div>
      <nav className="px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <item.icon size={18} weight="regular" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors w-full"
        >
          <SignOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
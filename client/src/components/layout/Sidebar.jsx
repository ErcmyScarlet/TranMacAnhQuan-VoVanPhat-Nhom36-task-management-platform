import { Link } from "react-router-dom";
import { House, FolderSimple, ChartBar, SignOut } from "@phosphor-icons/react";

const navItems = [
  { icon: House, label: "Trang chủ", href: "/" },
  { icon: ChartBar, label: "Dashboard", href: "/dashboard" },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-ink text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6">
        <span className="font-display font-semibold text-lg">TaskFlow</span>
      </div>
      <nav className="flex-1 px-3 flex flex-col gap-1">
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
    </aside>
  );
}

export default Sidebar;
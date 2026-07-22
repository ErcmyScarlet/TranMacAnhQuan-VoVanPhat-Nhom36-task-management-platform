import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-8 py-8 max-w-[1400px] mx-auto w-full">{children}</main>
    </div>
  );
}

export default AppLayout;
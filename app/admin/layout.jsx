import Sidebar from "../(components)/Sidebar";

export default function AdminLayout({ children }) {
  return <div className="flex h-fit">
   <Sidebar />
  {children}
  </div>
}
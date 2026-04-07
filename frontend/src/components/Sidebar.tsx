import {
  LogOut,
  X
} from "lucide-react";
import { NavLink } from "react-router";
import { ButtonDanger } from "./Buttons";



interface SidebarProps {
  openSidebar: boolean;
  sidebars: any;
  handleToggleSidebar: () => void;
  handleHeaderContent?: (context: { title: string; description: string }) => void;
}

export default function Sidebar({ sidebars, openSidebar, handleToggleSidebar, handleHeaderContent }: SidebarProps) {
  return (
    <>
      {openSidebar && <div className="fixed inset-0 bg-black/50 z-40 block lg:hidden" onClick={() => handleToggleSidebar()}></div>}
      <aside className={`w-60 pt-10 bg-gray-100 dark:bg-background flex flex-col pl-2 pr-8 border-r border-gray-400 dark:border-gray-800 fixed top-0 h-screen transition-all duration-300 ${openSidebar ? 'left-0' : '-left-full lg:left-0'} z-50`}>
        <button onClick={() => handleToggleSidebar()} className="lg:hidden text-gray-400 absolute top-4 right-4">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-orange-500">Teamify</h1>
        </div>

        <nav className="space-y-6 h-[75%] overflow-y-auto scrollbar-hidden">
          {sidebars.map((item: any) => (
            item.label.toLowerCase() !== "line" ? <div key={item.id}>
              {item.type === "single" ? (
                <NavItem icon={item.icon} label={item.label} path={item.path} description={item.description} setHeaderContent={handleHeaderContent} />
              ) : (
                <div>
                  <div className="flex items-center gap-4 cursor-pointer transition text-gray-600 dark:text-gray-200">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="ml-2 mt-2 space-y-2">
                    {item.subMenu.map((subItem: any) => (
                      <NavItem key={subItem.id} icon={subItem.icon} label={subItem.label} path={subItem.path} description={subItem.description} setHeaderContent={handleHeaderContent} />
                    ))}
                  </div>
                </div>
              )}
            </div> : <hr className="border-gray-400 dark:border-gray-800 my-4" />
          ))}
        </nav>
        <ButtonDanger onClick={() => alert('Logout logic goes here!')}>
          <LogOut size={20} />
          Logout
        </ButtonDanger>
      </aside>
    </>
  )
}

const NavItem = ({ icon, label, path, setHeaderContent, description }: any) => (
  <NavLink to={path} end className={({ isActive }) => `flex items-center gap-4 cursor-pointer transition ${isActive ? 'text-gray-800 dark:text-text-primary' : 'text-gray-600 dark:text-text-secondary hover:text-gray-800 dark:hover:text-white'}`} onClick={() => setHeaderContent && setHeaderContent({ title: label, description })}>
    {icon}
    <span className="font-medium">{label}</span>
  </NavLink>
);
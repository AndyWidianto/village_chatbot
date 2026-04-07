import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';
import { Outlet } from 'react-router';
import {
  LayoutDashboard,
  CheckSquare, Settings,
  Box,
  TabletSmartphone,
  ClipboardList,
  CalendarCheck,
  CirclePlus,
} from "lucide-react";

export default function Layout() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const [headerContent, setHeaderContent] = useState({
    title: "Dashboard",
    description: ""
  });
  const sidebars = [
    {
      id: 1,
      type: "single",
      label: 'Dashboard',
      description: 'Overview statistik dan aktivitas sistem',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard'
    },

    {
      id: 2,
      type: "group",
      active: false,
      label: 'Auto Replies',
      description: 'Kelola balasan otomatis berdasarkan pesan masuk',
      subMenu: [
        {
          id: 21,
          label: 'AutoReply',
          description: 'Daftar aturan balasan otomatis',
          icon: <CheckSquare size={20} />,
          path: '/dashboard/autoreply'
        },
        {
          id: 22,
          label: 'Create AutoReply',
          description: 'Buat aturan balasan otomatis baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/autoreply/create'
        },
      ]
    },

    {
      id: 3,
      type: "group",
      active: false,
      label: 'Broadcasts',
      description: 'Kirim pesan massal ke banyak pengguna',
      subMenu: [
        {
          id: 31,
          label: 'Broadcasts',
          description: 'Daftar pesan broadcast',
          icon: <ClipboardList size={20} />,
          path: '/dashboard/broadcasts'
        },
        {
          id: 32,
          label: 'Create Broadcast',
          description: 'Buat dan kirim pesan broadcast baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/broadcasts/create'
        },
      ]
    },

    {
      id: 4,
      type: "group",
      active: false,
      label: 'Knowledge Base',
      description: 'Kelola data pengetahuan untuk chatbot AI',
      subMenu: [
        {
          id: 41,
          label: 'Knowledge Base',
          description: 'Daftar artikel pengetahuan',
          icon: <CalendarCheck size={20} />,
          path: '/dashboard/knowledge-base'
        },
        {
          id: 42,
          label: 'Create Knowledge Article',
          description: 'Tambah artikel pengetahuan baru',
          icon: <CirclePlus size={20} />,
          path: '/dashboard/knowledge-base/create'
        },
      ]
    },

    {
      id: 5,
      type: "single",
      active: false,
      label: 'Devices',
      description: 'Kelola perangkat yang terhubung ke sistem',
      icon: <TabletSmartphone size={20} />,
      path: '/dashboard/devices'
    },

    {
      id: 6,
      type: "single",
      label: 'Line',
      description: 'Integrasi layanan LINE messaging',
      icon: <Box size={20} />,
      path: '/dashboard/line'
    },

    {
      id: 8,
      type: "single",
      label: 'Settings',
      description: 'Pengaturan sistem dan preferensi pengguna',
      icon: <Settings size={20} />,
      path: '/dashboard/settings'
    }
  ];

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  }

  return (
    <div className="flex min-h-screen p-6 bg-gray-100 dark:bg-background dark:text-white w-full h-full">
      {/* Sidebar */}
      <Sidebar openSidebar={openSidebar} sidebars={sidebars} handleToggleSidebar={toggleSidebar} handleHeaderContent={setHeaderContent} />

      {/* Main Content */}
      <main className={`flex-1 min-w-0 md:pl-2 ${openSidebar ? 'lg:ml-55' : 'ml-0 lg:ml-55'} transition-all duration-300`}>
        <Header handleToggleSidebar={toggleSidebar} headerContent={headerContent} />
        <div className="mt-15"></div>
        <Outlet />
      </main>
    </div>
  );
};

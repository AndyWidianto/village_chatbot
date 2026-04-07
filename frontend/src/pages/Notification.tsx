import React from 'react';
import { Bell, File, MessageSquare, AtSign, UserPlus, MoreHorizontal } from 'lucide-react';

const notifications = [
  {
    id: 1,
    user: "Paul Svensson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paul",
    action: "invite you to",
    target: "Prototyping",
    time: "Now",
    category: "Courses",
    type: "invite",
    unread: true,
  },
  {
    id: 2,
    user: "Adam Nolan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Adam",
    action: "mentioned you in",
    target: "UX Basics",
    time: "9h ago",
    category: "Notes",
    unread: true,
  },
  {
    id: 3,
    user: "Paul Morgan",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan",
    action: "commented in",
    target: "UI Design",
    time: "9h ago",
    category: "Blog",
    unread: false,
  },
  {
    id: 4,
    user: "Anna Miller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    action: "upload a file",
    target: "",
    time: "9h ago",
    category: "Courses",
    file: { name: "Cover-Templates", size: "9mb" },
    unread: false,
  },
  {
    id: 5,
    user: "Robert Babiński",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    action: "said nothing important",
    target: "",
    time: "9h ago",
    category: "Spam",
    unread: false,
  },
];

export default function Notification() {
  return (
    <div className="min-h-screen dark:bg-background flex justify-center py-10 px-4">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800">
        
        {/* Header */}
        <div className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          
          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-100 dark:border-zinc-800">
            <button className="pb-3 border-b-2 border-red-500 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Unread <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
            </button>
            <button className="pb-3 text-sm font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-600">All</button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
          {notifications.map((item) => (
            <div 
              key={item.id} 
              className={`p-5 transition-colors ${item.unread ? 'bg-gray-50/50 dark:bg-zinc-800/30' : 'bg-white dark:bg-zinc-900'}`}
            >
              <div className="flex gap-4">
                <img 
                  src={item.avatar} 
                  alt={item.user} 
                  className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800"
                />
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span className="font-bold text-gray-900 dark:text-zinc-100">{item.user}</span>
                    <span className="text-gray-500 dark:text-zinc-400 text-sm">{item.action}</span>
                    {item.target && (
                      <span className="font-bold text-gray-900 dark:text-zinc-100 text-sm">{item.target}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{item.time}</span>
                    <span className="text-gray-300 dark:text-zinc-700">•</span>
                    <span className="text-xs text-gray-400 dark:text-zinc-500">{item.category}</span>
                  </div>

                  {/* Conditional Rendering for Invite Buttons */}
                  {item.type === 'invite' && (
                    <div className="flex gap-2 mt-3">
                      <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md transition-colors">
                        Join
                      </button>
                      <button className="px-4 py-1.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                        Decline
                      </button>
                    </div>
                  )}

                  {/* Conditional Rendering for File attachment */}
                  {item.file && (
                    <div className="mt-3 p-3 border border-gray-100 dark:border-zinc-800 rounded-lg flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm w-fit pr-8">
                      <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" className="w-4 h-4" alt="figma" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{item.file.name}</span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-500">{item.file.size}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { formatDistanceToNow } from "date-fns";
import useNotification from "../hooks/notification";
import { id } from "date-fns/locale";

export default function Notification() {
  const { notifications, hasMore, fetchNotifications, loading } = useNotification();
  return (
    <div className="min-h-screen dark:bg-background flex justify-center py-10 px-4">
      <div className="w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-zinc-800">

        {/* Header */}
        <div className="p-6 pb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>

          {/* Tabs */}
          <div className="flex gap-6 mt-6 border-b border-gray-100 dark:border-zinc-800">
            {/* <button className="pb-3 border-b-2 border-red-500 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Unread <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
            </button> */}
            <button className="pb-3 border-b-2 border-red-500 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">All</button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
          {notifications.map((item) => {
            let parsedContent: any = { message: "" };
            try {
              parsedContent = item.content ? JSON.parse(item.content) : {};
            } catch (e) {
              console.error("Gagal parse JSON content", e);
              parsedContent = { message: item.content };
            }

            return (
              <div
                key={item.id}
                className={`group relative p-5 transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 ${!item.isRead ? 'bg-blue-50/30 dark:bg-blue-500/5' : 'bg-white dark:bg-zinc-900'
                  }`}
              >
                {!item.isRead && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                )}

                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={item.user.profileUrl || "/default-avatar.png"}
                      alt={item.user.name}
                      className="w-12 h-12 rounded-full bg-slate-200 dark:bg-zinc-800 object-cover ring-2 ring-white dark:ring-zinc-900 shadow-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-baseline gap-1">
                        <span className="font-bold text-slate-900 dark:text-zinc-100">
                          {item.user.name}
                        </span>
                        <span className="text-slate-500 dark:text-zinc-400 text-sm">
                          {item.title}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 italic">
                        "{parsedContent.message || parsedContent.keyword || parsedContent.name}"
                      </p>

                      {/* Contoh jika ada data file di dalam JSON content */}
                      {/* {parsedContent.fileName && (
                        <div className="mt-3 p-2 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-100 dark:border-zinc-700 flex items-center gap-2 w-fit">
                          <span className="text-lg">📄</span>
                          <span className="text-xs font-medium text-slate-700 dark:text-zinc-300">{parsedContent.fileName}</span>
                        </div>
                      )} */}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-tight">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: id })}
                        </span>
                        <span className="text-slate-300 dark:text-zinc-700">•</span>
                        <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                          {item.type}
                        </span>
                      </div>

                      {/* Action Buttons berdasarkan Type */}
                      {item.type === 'invite' && (
                        <div className="flex gap-2 mt-4">
                          <button className="px-5 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
                            Accept
                          </button>
                          <button className="px-5 py-2 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all">
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {loading && <div className="flex w-full justify-center">
            <div className="w-8 h-8 rounded-full animate-spin border-3 border-gray-300 dark:border-gray-400 border-t-blue-600 dark:border-t-blue-600"></div>
            </div>}
          {hasMore && <div className="p-4 flex justify-center border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={fetchNotifications}
              className="w-full py-3 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-colors"
            >
              Tampilkan Lebih Banyak
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Search, Trash2, Edit3, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function Broadcast() {
  const initialData = [
    { id: 1, name: "Vincent Williamson", age: 31, job: "iOS Developer", location: "Washington" },
    { id: 2, name: "Tyler Reyes", age: 22, job: "UI/UX Designer", location: "New York" },
    { id: 3, name: "Justin Block", age: 26, job: "Front-End Developer", location: "Los Angeles" },
    { id: 4, name: "Sean Guzman", age: 25, job: "Web Designer", location: "San Francisco" },
    { id: 5, name: "Keith Carter", age: 20, job: "Graphic Designer", location: "New York, NY" },
    { id: 6, name: "Austin Medina", age: 32, job: "Photographer", location: "New York" },
    { id: 7, name: "Adam Henderson", age: 35, job: "UI/UX Designer", location: "Washington" },
  ];

  const [users, setUsers] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Logika Search & Filter ---
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.job.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Logika Pagination ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // --- Handlers ---
  const handleDelete = (id: number) => {
    if(window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUpdate = (name: string) => {
    alert(`Update logic for ${name} goes here!`);
  };

  return (
    <div className="md:p-8 min-h-screen dark:bg-background dark:text-white">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Toolbar: Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 dark:text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search name or job..."
              className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-500 dark:bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-300 dark:border-gray-800">
          <table className="w-full min-w-[1000px] text-left dark:border-collapse dark:bg-[#111827]">
            <thead>
              <tr className="bg-[#6366f1]">
                <th className="px-6 py-4 font-semibold text-sm">Full Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Age</th>
                <th className="px-6 py-4 font-semibold text-sm">Job Title</th>
                <th className="px-6 py-4 font-semibold text-sm">Location</th>
                <th className="px-6 py-4 font-semibold text-sm text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-400 dark:divide-gray-800">
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-300/40 hover:dark:bg-gray-800/40 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">{user.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">{user.job}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-400">{user.location}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => handleUpdate(user.name)}
                          className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500 hover:text-white transition"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Control */}
        <div className="flex justify-between items-center dark:bg-[#111827] p-4 rounded-xl border border-gray-300 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to <span className="text-gray-900 dark:text-white font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of <span className="text-white font-medium">{filteredUsers.length}</span> entries
          </p>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center px-4 text-sm font-medium">
              Page {currentPage} of {totalPages || 1}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
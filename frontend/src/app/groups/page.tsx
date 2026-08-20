"use client";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Users, ChevronRight, X, Trash2, Edit2, ShieldAlert } from "lucide-react";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";
import GroupModal from "@/components/groups/GroupModal";
import CountingNumber from "@/components/common/CountingNumber";

export default function GroupsPage() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const data = await apiCall("/groups");
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    apiCall('/users/me').then(setUser).catch(console.error);
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (groupId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this group? This cannot be undone.")) return;
    
    try {
      await apiCall(`/groups/${groupId}`, { method: "DELETE" });
      toast.success("Group deleted successfully");
      fetchGroups();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete group");
    }
  };

  const openEdit = (group: any, e: React.MouseEvent) => {
    e.preventDefault();
    setEditGroup(group);
    setIsModalOpen(true);
  };

  return (
    <main className="relative pt-28 md:pt-36 pb-16 px-6 md:px-12 max-w-7xl mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-medium text-text-primary tracking-tight">Groups</h1>
          <button
            onClick={() => { setEditGroup(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-medium rounded-none hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)]"
          >
            <Plus size={20} /> <span className="hidden sm:inline">New Group</span>
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface/50 border border-white/10 rounded-none py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-none flex items-center justify-center mb-4">
              <Users size={32} className="text-text-muted" />
            </div>
            <h3 className="text-xl text-white font-medium mb-2">No groups found</h3>
            <p className="text-text-secondary text-sm">Create a group to start splitting expenses.</p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredGroups.map((g) => {
                const isCreator = g.creatorId === user?.id;
                return (
                  <motion.div
                    key={g.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={`/groups/${g.id}`}
                      className="block p-6 bg-surface/50 border border-white/10 rounded-none hover:bg-white/5 transition-all group/card relative h-full flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-white/5 rounded-none flex items-center justify-center border border-white/10">
                          <span className="text-2xl">{g.name.charAt(0).toUpperCase()}</span>
                        </div>
                        {isCreator && (
                          <div className="flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <button onClick={(e) => openEdit(g, e)} className="p-2 text-text-secondary hover:text-white bg-white/5 rounded-none hover:bg-white/10 transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={(e) => handleDelete(g.id, e)} className="p-2 text-text-secondary hover:text-danger bg-white/5 rounded-none hover:bg-danger/10 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-medium text-white mb-2 group-hover/card:text-accent transition-colors">
                        {g.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
                        <Users size={16} />
                        {g.members?.length || 0} members
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-text-secondary text-xs uppercase tracking-wider">
                          Balance
                        </span>
                        <span className="text-white font-medium">
                          TBD
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <GroupModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => { setIsModalOpen(false); fetchGroups(); }}
            editGroup={editGroup}
            currentUser={user}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

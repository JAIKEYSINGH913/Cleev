"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Users } from "lucide-react";
import { apiCall } from "@/lib/api";
import { toast } from "sonner";

export default function GroupModal({ onClose, onSuccess, editGroup, currentUser }: any) {
  const [name, setName] = useState(editGroup?.name || "");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<any[]>(editGroup?.members?.filter((m:any) => m.id !== currentUser.id) || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.length >= 2) {
      const delay = setTimeout(async () => {
        try {
          const res = await apiCall(`/users/search?q=${search}`);
          setSearchResults(res);
        } catch (err) {
          console.error(err);
        }
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const toggleMember = (user: any) => {
    if (selectedMembers.find(m => m.id === user.id)) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== user.id));
    } else {
      setSelectedMembers([...selectedMembers, user]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const memberIds = selectedMembers.map(m => m.id);
      
      if (editGroup) {
        await apiCall(`/groups/${editGroup.id}`, {
          method: "PUT",
          body: JSON.stringify({ name, memberIds })
        });
        toast.success("Group updated!");
      } else {
        await apiCall("/groups", {
          method: "POST",
          body: JSON.stringify({ name, memberIds })
        });
        toast.success("Group created!");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to save group");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-surface/90 backdrop-blur-3xl border border-white/10 rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/20">
          <h2 className="text-xl font-medium text-white">{editGroup ? "Edit Group" : "Create Group"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <label className="block text-sm text-text-secondary mb-2">Group Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Goa Trip" 
              className="w-full bg-black/40 border border-white/10 rounded-none py-3 px-4 text-white focus:outline-none focus:border-accent transition-colors" 
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Add Members</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="text" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search by name or username..." 
                className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent transition-colors text-sm" 
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="mb-6 space-y-2 border border-white/10 bg-black/20 p-2 max-h-40 overflow-y-auto">
                {searchResults.map(user => {
                  const isSelected = selectedMembers.some(m => m.id === user.id);
                  return (
                    <div key={user.id} onClick={() => toggleMember(user)} className={`flex justify-between items-center p-2 cursor-pointer hover:bg-white/5 transition-colors ${isSelected ? 'border-l-2 border-accent bg-white/5' : ''}`}>
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-xs text-text-muted">@{user.username}</p>
                      </div>
                      {isSelected && <X size={16} className="text-text-muted hover:text-danger" />}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-xs text-text-muted uppercase tracking-wider mb-2">Selected Members ({selectedMembers.length + 1})</h4>
              <div className="flex items-center gap-3 p-2 bg-white/5 border border-white/5">
                <div className="w-8 h-8 bg-accent/20 text-accent flex items-center justify-center text-xs">YOU</div>
                <span className="text-sm text-white font-medium">{currentUser?.name} (Owner)</span>
              </div>
              {selectedMembers.map(m => (
                <div key={m.id} className="flex justify-between items-center p-2 bg-white/5 border border-white/5">
                  <span className="text-sm text-white">{m.name}</span>
                  <button type="button" onClick={() => toggleMember(m)} className="text-text-muted hover:text-danger">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <button type="submit" disabled={isLoading} onClick={handleSubmit} className="w-full bg-accent text-background font-medium py-3 rounded-none hover:bg-accent-2 transition-colors disabled:opacity-50">
            {isLoading ? "Saving..." : editGroup ? "Save Changes" : "Create Group"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

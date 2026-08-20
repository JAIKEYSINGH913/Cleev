"use client";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus, X, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const EMOJIS = ["🏖️", "🏠", "🍱", "🎉", "🚗", "✈️", "🎬", "🍕", "💼", "🎓"];

const MOCK_CONTACTS = [
  { id: 1, name: "Rohan Sharma", phone: "+91 9876543210" },
  { id: 2, name: "Kavya Patel", phone: "+91 9876543211" },
  { id: 3, name: "Aryan Singh", phone: "+91 9876543212" },
  { id: 4, name: "Priya Desai", phone: "+91 9876543213" },
  { id: 5, name: "Aditya Verma", phone: "+91 9876543214" },
];

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏖️");
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const filteredContacts = MOCK_CONTACTS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) && !selectedMembers.includes(c.id)
  );

  const toggleMember = (id: number) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((mId) => mId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    toast.success("Group created successfully!");
    router.push("/groups/1");
  };

  return (
    <main className="relative p-6 md:p-12 pb-32 max-w-container-max mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col space-y-8">
        <div className="flex items-center space-x-4">
          <Link href="/groups" className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Create Group</h1>
        </div>

        <form onSubmit={handleCreate} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col space-y-6">
          
          <div className="space-y-3">
            <label className="text-text-secondary font-medium">Group Details</label>
            <div className="flex space-x-4">
              <div className="w-16 h-[52px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                {emoji}
              </div>
              <input
                type="text"
                placeholder="Group name (e.g. Goa Trip)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                autoFocus
              />
            </div>
            
            <div className="flex gap-2 pt-2 overflow-x-auto pb-2 scrollbar-hide">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl shrink-0 transition-colors ${
                    emoji === e ? "bg-white/20 border-accent" : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-text-secondary font-medium flex justify-between items-center">
              <span>Add Members</span>
              <span className="text-text-muted text-sm">{selectedMembers.length} selected</span>
            </label>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <AnimatePresence>
              {selectedMembers.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {selectedMembers.map((id) => {
                    const member = MOCK_CONTACTS.find((c) => c.id === id)!;
                    return (
                      <motion.div
                        key={id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-accent/20 border border-accent/50 text-accent rounded-full py-1.5 pl-3 pr-2 flex items-center space-x-2 text-sm"
                      >
                        <span>{member.name}</span>
                        <button type="button" onClick={() => toggleMember(id)} className="hover:bg-accent/30 rounded-full p-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-black/20 border border-white/5 rounded-xl max-h-48 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => toggleMember(contact.id)}
                    className="w-full flex items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${contact.id}`}
                        alt={contact.name}
                        width={40}
                        height={40}
                        className="rounded-full bg-white/10"
                      />
                      <div>
                        <p className="text-text-primary font-medium">{contact.name}</p>
                        <p className="text-text-muted text-xs">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-text-muted" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-text-muted text-sm">
                  No contacts found.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-background font-bold py-3.5 rounded-full hover:bg-accent-2 transition-colors shadow-[0_0_15px_rgba(0,103,255,0.4)] mt-4"
          >
            Create Group
          </button>
        </form>
      </div>
    </main>
  );
}

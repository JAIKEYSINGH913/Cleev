"use client";
import ShaderBackground from "@/components/landing/ShaderBackground";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Archive, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const MOCK_MEMBERS = [
  { id: "u2", name: "Aryan Singh" },
  { id: "u3", name: "Rohan Sharma" },
  { id: "u4", name: "Kavya Patel" },
];

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const [name, setName] = useState("Goa Trip");
  const [emoji, setEmoji] = useState("🏖️");
  const [members, setMembers] = useState(MOCK_MEMBERS);

  const handleSave = () => {
    toast.success("Group settings updated");
    router.push(`/groups/${params.id}`);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success("Member removed");
  };

  const handleArchive = () => {
    toast.success("Group archived successfully");
    router.push("/groups");
  };

  const handleDelete = () => {
    toast.success("Group deleted forever");
    router.push("/groups");
  };

  return (
    <main className="relative p-6 md:p-12 pb-32 max-w-container-max mx-auto w-full min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col space-y-6">
        
        <div className="flex items-center space-x-4 mb-2">
          <Link href={`/groups/${params.id}`} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <h1 className="text-3xl font-bold text-text-primary">Group Settings</h1>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col space-y-6">
          <h2 className="text-lg font-semibold text-text-primary border-b border-white/10 pb-2">General</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="w-16 h-[52px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl shrink-0 cursor-pointer hover:bg-white/10 transition-colors">
                {emoji}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="w-full bg-white/5 border border-white/10 text-text-primary font-bold py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col space-y-4">
          <h2 className="text-lg font-semibold text-text-primary border-b border-white/10 pb-2">Manage Members</h2>
          
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center space-x-3">
                  <Image src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.id}`} width={36} height={36} alt={member.name} className="rounded-full bg-white/10" />
                  <p className="text-text-primary font-medium">{member.name}</p>
                </div>
                <button 
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-text-muted text-sm text-center py-4">No other members in this group.</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-danger/30 rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col space-y-6">
          <h2 className="text-lg font-semibold text-danger border-b border-danger/20 pb-2">Danger Zone</h2>
          
          <div className="flex flex-col space-y-3">
            <button onClick={handleArchive} className="w-full bg-white/5 border border-white/10 text-text-primary font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
              <Archive className="w-5 h-5 mr-2 text-text-muted" />
              Archive Group
            </button>
            <button onClick={handleDelete} className="w-full bg-danger/10 border border-danger/30 text-danger font-bold py-3.5 rounded-xl flex items-center justify-center hover:bg-danger/20 transition-colors">
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Group Forever
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}

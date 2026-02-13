/**
 * Dashboard Page
 * 
 * Main hub after login. Shows active streams, quick actions,
 * and navigation to create/join rooms.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Radio,
  Plus,
  LogOut,
  Users,
  Video,
  Mic,
  Moon,
  Sun,
  Settings,
  Play,
  Hash,
} from "lucide-react";
import { generateRoomId } from "@/lib/zegocloud";
import RoleBadge from "@/components/RoleBadge";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateRoom = () => {
    const roomId = generateRoomId();
    navigate(`/room/${roomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinRoomId.trim()) {
      navigate(`/room/${joinRoomId.trim()}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Mock active streams data
  const activeStreams = [
    { id: "stream1", title: "Gaming Night Live", viewers: 142, host: "Alex" },
    { id: "stream2", title: "Music Jam Session", viewers: 89, host: "Sam" },
    { id: "stream3", title: "Tech Talk: React 2025", viewers: 234, host: "Jordan" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/80 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Radio className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">StreamHub</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-primary-foreground">
                {user?.displayName?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">{user?.displayName || "User"}</p>
                <RoleBadge role={user?.role || "viewer"} />
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-1">
            Welcome back, {user?.displayName?.split(" ")[0] || "there"} 👋
          </h2>
          <p className="text-muted-foreground">Start or join a stream to begin broadcasting</p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-brand flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Create Stream</h3>
                <p className="text-sm text-muted-foreground">Start broadcasting to your audience</p>
              </div>
            </div>
            <Button
              onClick={handleCreateRoom}
              className="w-full gradient-brand text-primary-foreground font-semibold h-11 hover:opacity-90"
            >
              <Video className="w-4 h-4 mr-2" />
              New Stream Room
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Hash className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Join Stream</h3>
                <p className="text-sm text-muted-foreground">Enter a room code to watch or join</p>
              </div>
            </div>
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <Input
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter room code..."
                className="bg-secondary border-border flex-1"
              />
              <Button type="submit" variant="outline" className="border-border h-11 px-5">
                <Play className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: Video, label: "Active Streams", value: "3", color: "text-primary" },
            { icon: Users, label: "Online Users", value: "465", color: "text-accent" },
            { icon: Mic, label: "Broadcasting", value: "12", color: "text-live" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 shadow-card text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Active Streams List */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-live live-pulse" />
            Live Now
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreams.map((stream) => (
              <button
                key={stream.id}
                onClick={() => navigate(`/room/${stream.id}`)}
                className="bg-card border border-border rounded-xl p-4 shadow-card hover:border-primary/50 hover:shadow-glow transition-all duration-200 text-left group"
              >
                {/* Stream thumbnail placeholder */}
                <div className="aspect-video rounded-lg bg-secondary mb-3 flex items-center justify-center overflow-hidden relative">
                  <Video className="w-8 h-8 text-muted-foreground/30" />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-live text-live-foreground text-xs font-bold px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-live-foreground live-pulse" />
                    LIVE
                  </div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-background/80 text-foreground text-xs px-2 py-0.5 rounded">
                    <Users className="w-3 h-3" />
                    {stream.viewers}
                  </div>
                </div>
                <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {stream.title}
                </h4>
                <p className="text-sm text-muted-foreground">by {stream.host}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

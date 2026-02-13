/**
 * Stream Room Page
 * 
 * The main streaming interface with:
 * - ZegoCloud video/audio integration
 * - Real-time chat panel (Firestore)
 * - Participant list
 * - Stream controls
 */

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ZEGO_APP_ID, ZEGO_SERVER_SECRET } from "@/lib/zegocloud";
import ChatPanel from "@/components/ChatPanel";
import ParticipantList from "@/components/ParticipantList";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Copy,
  Check,
  Radio,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const StreamRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zegoLoaded, setZegoLoaded] = useState(false);

  /**
   * ZegoCloud Integration
   * 
   * The ZegoUIKitPrebuilt SDK is loaded dynamically.
   * It creates a video conference room with built-in controls for:
   * - Camera on/off
   * - Microphone on/off
   * - Screen sharing
   * - Speaker view / gallery view
   * 
   * Token generation uses the Kit Token approach for development.
   * In production, generate tokens on your server for security.
   */
  useEffect(() => {
    if (!videoContainerRef.current || !roomId || !user) return;

    const initZego = async () => {
      try {
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");

        // Generate a Kit Token for authentication
        // In production, this should be generated server-side
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          ZEGO_APP_ID,
          ZEGO_SERVER_SECRET,
          roomId,
          user.uid,
          user.displayName || "User"
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Join the room with video conference settings
        zp.joinRoom({
          container: videoContainerRef.current!,
          sharedLinks: [
            {
              name: "Copy Link",
              url: `${window.location.origin}/room/${roomId}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showScreenSharingButton: true,
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,
          showRemoveUserButton: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
        });

        setZegoLoaded(true);
      } catch (error) {
        console.error("Failed to initialize ZegoCloud:", error);
      }
    };

    initZego();
  }, [roomId, user]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Room Header */}
      <header className="h-14 border-b border-border bg-card/80 glass flex items-center justify-between px-4 z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-live live-pulse" />
            <span className="text-sm font-semibold text-foreground">Room: {roomId}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={copyRoomId}
            className="text-muted-foreground hover:text-foreground text-xs gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy ID"}
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            variant={showParticipants ? "secondary" : "ghost"}
            size="icon"
            onClick={() => { setShowParticipants(!showParticipants); if (!showParticipants) setShowChat(false); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Users className="w-4 h-4" />
          </Button>

          <Button
            variant={showChat ? "secondary" : "ghost"}
            size="icon"
            onClick={() => { setShowChat(!showChat); if (!showChat) setShowParticipants(false); }}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* ZegoCloud video container — the SDK renders its UI here */}
          <div
            ref={videoContainerRef}
            className="w-full h-full bg-secondary"
            style={{ minHeight: "300px" }}
          />

          {/* Loading overlay before ZegoCloud initializes */}
          {!zegoLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shadow-glow mb-4 animate-pulse">
                <Radio className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Connecting to stream...</p>
              <p className="text-muted-foreground/60 text-xs mt-2">
                Make sure ZegoCloud credentials are configured
              </p>
            </div>
          )}
        </div>

        {/* Side Panel — Chat or Participants */}
        <AnimatePresence>
          {(showChat || showParticipants) && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-border bg-card overflow-hidden shrink-0 hidden sm:block"
            >
              <div className="w-[360px] h-full">
                {showChat && <ChatPanel roomId={roomId || ""} />}
                {showParticipants && <ParticipantList roomId={roomId || ""} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Panel */}
      <AnimatePresence>
        {(showChat || showParticipants) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "50vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-card overflow-hidden sm:hidden"
          >
            {showChat && <ChatPanel roomId={roomId || ""} />}
            {showParticipants && <ParticipantList roomId={roomId || ""} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamRoom;

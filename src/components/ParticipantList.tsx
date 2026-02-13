/**
 * Participant List Component
 * 
 * Shows users currently in the stream room.
 * Reads from Firestore: rooms/{roomId}/participants
 * 
 * Displays role badges and online status indicators.
 */

import React from "react";
import { Users, Crown, Shield, Eye } from "lucide-react";
import RoleBadge from "@/components/RoleBadge";

interface ParticipantListProps {
  roomId: string;
}

// Mock participants for UI demonstration
const mockParticipants = [
  { uid: "1", displayName: "Alex Johnson", role: "broadcaster" as const, online: true },
  { uid: "2", displayName: "Sam Rivera", role: "moderator" as const, online: true },
  { uid: "3", displayName: "Jordan Lee", role: "viewer" as const, online: true },
  { uid: "4", displayName: "Casey Smith", role: "viewer" as const, online: true },
  { uid: "5", displayName: "Taylor Brown", role: "viewer" as const, online: false },
];

const ParticipantList: React.FC<ParticipantListProps> = ({ roomId }) => {
  const onlineCount = mockParticipants.filter((p) => p.online).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-card-foreground">Participants</h3>
        <span className="text-xs text-muted-foreground ml-auto">{onlineCount} online</span>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {mockParticipants.map((participant) => (
          <div
            key={participant.uid}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                {participant.displayName.charAt(0)}
              </div>
              {participant.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-online border-2 border-card" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {participant.displayName}
              </p>
              <RoleBadge role={participant.role} small />
            </div>

            {/* Role Icon */}
            {participant.role === "broadcaster" && <Crown className="w-4 h-4 text-primary" />}
            {participant.role === "moderator" && <Shield className="w-4 h-4 text-accent" />}
            {participant.role === "viewer" && <Eye className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;

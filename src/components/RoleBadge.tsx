/**
 * Role Badge Component
 * 
 * Displays a small colored badge indicating the user's role:
 * - Broadcaster: purple/primary
 * - Moderator: teal/accent
 * - Viewer: muted
 */

import React from "react";
import { UserRole } from "@/contexts/AuthContext";

interface RoleBadgeProps {
  role: UserRole;
  small?: boolean;
}

const roleConfig = {
  broadcaster: {
    label: "Broadcaster",
    className: "bg-primary/15 text-primary",
  },
  moderator: {
    label: "Moderator",
    className: "bg-accent/15 text-accent",
  },
  viewer: {
    label: "Viewer",
    className: "bg-muted text-muted-foreground",
  },
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, small }) => {
  const config = roleConfig[role] || roleConfig.viewer;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.className} ${
        small ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5"
      }`}
    >
      {config.label}
    </span>
  );
};

export default RoleBadge;

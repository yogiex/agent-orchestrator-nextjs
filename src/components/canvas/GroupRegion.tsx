"use client";

import { motion } from "framer-motion";
import { ACTIVE_STATUSES, type AgentNode } from "@/lib/simulation/types";
import { DEPARTMENTS } from "@/lib/simulation/teams";
import type { OrgGroup } from "./OrchestratorCanvas";

interface GroupRegionProps {
  group: OrgGroup;
  head: AgentNode;
  members: AgentNode[];
  lead: boolean;
}

export default function GroupRegion({ group, head, members, lead }: GroupRegionProps) {
  const dept = DEPARTMENTS[head.id];
  if (!dept) return null;

  const activeCount = members.filter((m) => ACTIVE_STATUSES.includes(m.status)).length;
  const labelX = group.x + 14;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <rect
        x={group.x}
        y={group.y}
        width={group.width}
        height={group.height}
        rx={14}
        fill={dept.color}
        fillOpacity={lead ? 0.06 : 0.035}
      />
      <motion.rect
        x={group.x}
        y={group.y}
        width={group.width}
        height={group.height}
        rx={14}
        fill="none"
        stroke={dept.color}
        strokeOpacity={lead ? 0.6 : 0.28}
        strokeWidth={lead ? 1.5 : 1}
        strokeDasharray="5 5"
        animate={lead ? { strokeOpacity: [0.35, 0.7, 0.35] } : undefined}
        transition={lead ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      />

      <text x={labelX} y={group.y + 19} fontSize={10} fontWeight={700} fill={dept.color}>
        {dept.emoji} {dept.label}
      </text>
      <text x={labelX} y={group.y + 34} fontSize={9} fill="#8b93a5" opacity={0.85}>
        {dept.tagline} · {members.length} members · {activeCount} active
      </text>

      {lead && (
        <g>
          <rect
            x={group.x + group.width - 48}
            y={group.y + 12}
            width={36}
            height={14}
            rx={7}
            fill={dept.color}
            fillOpacity={0.16}
          />
          <text
            x={group.x + group.width - 30}
            y={group.y + 22}
            textAnchor="middle"
            fontSize={7.5}
            fontWeight={800}
            fill={dept.color}
          >
            LEAD
          </text>
        </g>
      )}
    </motion.g>
  );
}

import { BookOpenCheck, FileEdit, UserPlus, type LucideIcon } from "lucide-react";
import type { SquadIconKey } from "@/lib/squads";

/**
 * Maps a serialisable `SquadIconKey` to its Lucide component. Used by both
 * server and client renderers — the lookup is pure data (no closures), so
 * it's safe on either side of the RSC boundary.
 */
const ICONS: Record<SquadIconKey, LucideIcon> = {
  "book-open-check": BookOpenCheck,
  "file-edit": FileEdit,
  "user-plus": UserPlus,
};

export function getSquadIcon(key: SquadIconKey): LucideIcon {
  return ICONS[key];
}

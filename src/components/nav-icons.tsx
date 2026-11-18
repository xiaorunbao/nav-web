import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Cloud,
  Flame,
  FlaskConical,
  Gamepad2,
  LayoutGrid,
  Link2,
  MessagesSquare,
  Palette,
  Sparkles,
  Users,
  WandSparkles,
  Wrench,
} from "lucide-react";

export const navIcons: Record<string, LucideIcon> = {
  Sparkles,
  Cloud,
  MessagesSquare,
  BookOpen,
  Gamepad2,
  FlaskConical,
  Wrench,
  Palette,
  Users,
  Link2,
  Flame,
  LayoutGrid,
  WandSparkles,
};

export function NavIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = navIcons[name] ?? Sparkles;
  return <Icon className={className} />;
}

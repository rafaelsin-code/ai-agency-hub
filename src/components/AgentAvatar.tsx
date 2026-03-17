import Image from "next/image";

interface AgentAvatarProps {
  agentId: string;
  name: string;
  color: string;
  size?: number;
  className?: string;
}

export default function AgentAvatar({ agentId, name, color, size = 64, className = "" }: AgentAvatarProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: `${color}20`,
      }}
    >
      <Image
        src={`/avatars/${agentId}.png`}
        alt={name}
        width={size}
        height={size}
        className="object-cover w-full h-full"
        unoptimized
      />
    </div>
  );
}

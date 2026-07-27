type MessageTone = "error" | "warning" | "success";

interface MessageBannerProps {
  children: string;
  tone: MessageTone;
  compact?: boolean;
}

const TONE_CLASSES: Record<MessageTone, string> = {
  error: "bg-red-50 text-red-600",
  warning: "bg-amber-50 text-amber-700",
  success: "bg-green-50 text-green-700",
};

export default function MessageBanner({
  children,
  tone,
  compact = false,
}: MessageBannerProps) {
  return (
    <p
      role={
        tone === "error" || tone === "warning" ? "alert" : undefined
      }
      className={`rounded ${TONE_CLASSES[tone]} ${compact ? "p-2" : "p-3"} text-sm`}
    >
      {children}
    </p>
  );
}

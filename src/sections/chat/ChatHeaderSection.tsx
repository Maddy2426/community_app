import { Header } from "@/components";

type ChatHeaderSectionProps = {
  username?: string;
};

export default function ChatHeaderSection({
  username,
}: ChatHeaderSectionProps) {
  return <Header title={username ?? "Community Chat"} />;
}
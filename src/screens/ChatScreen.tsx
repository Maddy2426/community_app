import { useAppSelector } from "@/hooks/useAppDispatch";
import { useTheme } from "@/hooks/useTheme";
import ChatBodySection from "@/sections/chat/ChatBodySection";
import ChatHeaderSection from "@/sections/chat/ChatHeaderSection";
import ChatLoadingSection from "@/sections/chat/ChatLoadingSection";
import { selectMessagesByAuthor } from "@/store/communitySlice";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function ChatScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams() as {
    username?: string;
    userId?: string;
  };
  const username = params.username ?? "Chat";
  const authorId = params.userId ?? "";

  const messagesForAuthor = useAppSelector((s) =>
    selectMessagesByAuthor(s, authorId),
  );
  const { posts, isLoading } = useAppSelector((state) => state.posts);

  if (isLoading && posts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ChatHeaderSection username={username} />
        <ChatLoadingSection />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ChatHeaderSection username={username} />
      <ChatBodySection
        authorId={authorId}
        initialMessages={messagesForAuthor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

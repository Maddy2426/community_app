import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { Post } from "@/types";
import { formatDateTime } from "@/utils/helpers";
import { BORDER_RADIUS } from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  isSaved: boolean;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (post: Post) => void;
}

const PostCardComponent: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  isSaved,
  onLike,
  onSave,
  onShare,
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  const likes = Array.isArray(post.likes) ? post.likes : [];
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const isLiked = currentUserId ? likes.includes(currentUserId) : false;

  const handleComment = useCallback(() => {
    router.push(`/comments/${post.id}`);
  }, [router, post.id]);

  const handleShare = useCallback(() => {
    onShare(post);
  }, [onShare, post]);

  const handleLike = useCallback(() => {
    onLike(post.id);
  }, [onLike, post.id]);

  const handleSave = useCallback(() => {
    onSave(post.id);
  }, [onSave, post.id]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/chat",
            params: {
              username: post.authorUsername,
              userId: post.authorId,
              postId: post.id,
            },
          })
        }
      >
        <View style={styles.header}>
          <Avatar
            name={post.authorUsername}
            uri={post.authorAvatar}
            size={44}
          />
          <View style={styles.headerText}>
            <Text style={[styles.username, { color: colors.textPrimary }]}>
              {post.authorUsername}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textMuted }]}>
              {formatDateTime(post.createdAt)}
            </Text>
          </View>
        </View>
      </Pressable>

      {post.imageUri && (
        <Image
          source={{ uri: post.imageUri }}
          style={styles.postImage}
          contentFit="cover"
          transition={300}
        />
      )}

      <Text style={[styles.description, { color: colors.textPrimary }]}>
        {post.description}
      </Text>

      <View style={styles.stats}>
        <Text style={[styles.statText, { color: colors.textSecondary }]}>
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </Text>
        <Text style={[styles.statText, { color: colors.textSecondary }]}>
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </Text>
      </View>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={22}
            color={isLiked ? colors.like : colors.textSecondary}
          />
          <Text
            style={[
              styles.actionText,
              { color: isLiked ? colors.like : colors.textSecondary },
            ]}
          >
            Like
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Comment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons
            name="share-outline"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Share
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isSaved ? colors.primary : colors.textSecondary}
          />
          <Text
            style={[
              styles.actionText,
              { color: isSaved ? colors.primary : colors.textSecondary },
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  postImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#E5E7EB",
    paddingBottom: 8,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export const PostCard = memo(PostCardComponent);

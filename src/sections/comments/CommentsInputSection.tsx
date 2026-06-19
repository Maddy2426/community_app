import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CustomInput, CustomButton } from '@/components';
import { usePosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';

interface CommentsInputSectionProps {
  postId: string;
}

export default function CommentsInputSection({ postId }: CommentsInputSectionProps) {
  const { colors } = useTheme();
  const { commentOnPost } = usePosts();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = useCallback(async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await commentOnPost(postId, message.trim());
      setMessage('');
    } catch {
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  }, [message, postId, commentOnPost]);

  return (
    <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      <CustomInput
        value={message}
        onChangeText={setMessage}
        placeholder="Write a comment..."
        style={styles.inputField}
        maxLength={300}
      />
      <CustomButton
        title="Send"
        onPress={handleAddComment}
        loading={loading}
        disabled={!message.trim()}
        style={styles.sendButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  inputField: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    minWidth: 80,
  },
});

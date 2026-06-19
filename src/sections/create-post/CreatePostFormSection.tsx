import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput, CustomButton } from '@/components';
import { usePosts } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS } from '@/utils/theme';

export default function CreatePostFormSection() {
  const { colors } = useTheme();
  const { createPost } = usePosts();
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const removeImage = useCallback(() => {
    setImageUri(undefined);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!description.trim()) {
      setError('Please write something to post');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await createPost(description, imageUri);
      setDescription('');
      setImageUri(undefined);
      Alert.alert('Success', 'Your post has been published!');
    } catch {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [description, imageUri, createPost]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <CustomInput
          label="What's on your mind?"
          value={description}
          onChangeText={setDescription}
          placeholder="Write your post here..."
          multiline
          numberOfLines={6}
          error={error}
          maxLength={500}
        />

        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
            <TouchableOpacity style={styles.removeImageBtn} onPress={removeImage}>
              <Ionicons name="close-circle" size={28} color={colors.error} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.uploadButton, { borderColor: colors.primary, backgroundColor: colors.primary + '10' }]}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Ionicons name="image-outline" size={24} color={colors.primary} />
            <Text style={[styles.uploadText, { color: colors.primary }]}>Add Photo</Text>
          </TouchableOpacity>
        )}

        <CustomButton
          title="Publish Post"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    padding: 16,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS,
    paddingVertical: 24,
    gap: 8,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 220,
    borderRadius: BORDER_RADIUS,
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
  },
  submitButton: {
    marginTop: 8,
  },
});

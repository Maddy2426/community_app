import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { getInitials } from '@/utils/helpers';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  onPress?: () => void;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 44,
  onPress,
}) => {
  const { colors } = useTheme();
  const initials = getInitials(name);

  const content = uri ? (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      contentFit="cover"
    />
  ) : (
    <View
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E7EB',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export const Avatar = memo(AvatarComponent);

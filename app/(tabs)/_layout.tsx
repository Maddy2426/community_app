import { useTheme } from "@/hooks/useTheme";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";

const TAB_ICON_COLOR = "#6B7280";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarActiveBackgroundColor: "transparent",
        tabBarInactiveBackgroundColor: "transparent",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarButton: ({
          children,
          onPress,
          style,
          accessibilityRole,
          accessibilityState,
          testID,
        }) => (
          <TouchableOpacity
            onPress={onPress}
            accessibilityRole={accessibilityRole}
            accessibilityState={accessibilityState}
            testID={testID}
            activeOpacity={1}
            style={[style, styles.tabButton]}
          >
            {children}
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name="home"
              size={size}
              color={focused ? colors.primary : TAB_ICON_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name="add-circle"
              size={size + 4}
              color={focused ? colors.primary : TAB_ICON_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name="bookmark"
              size={size}
              color={focused ? colors.primary : TAB_ICON_COLOR}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Saved",
          tabBarIcon: ({ size, focused }) => (
            <Entypo name="message" size={size} color={focused ? colors.primary : TAB_ICON_COLOR} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name="person"
              size={size}
              color={focused ? colors.primary : TAB_ICON_COLOR}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
  },
});

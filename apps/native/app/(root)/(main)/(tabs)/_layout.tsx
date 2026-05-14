import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "heroui-native";
import { TabBarIcon } from "@/components/tabbar-icon";
import { useTranslation } from "@/hooks/use-translation";

export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("border");
  const bottomPadding =
    Platform.OS === "android"
      ? Math.max(insets.bottom, 8)
      : Math.max(insets.bottom, 24);
  const tabBarHeight = 60 + bottomPadding + 8;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: mutedColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: borderColor,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="uploads"
        options={{
          title: t("tabs.uploads"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="uploads" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t("tabs.notifications"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="notifications" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t("tabs.account"),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="account" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

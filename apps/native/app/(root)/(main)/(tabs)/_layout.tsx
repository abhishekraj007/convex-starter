import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useThemeColor } from "heroui-native";
import { useTranslation } from "@/hooks/use-translation";

export default function TabsLayout() {
  const { t } = useTranslation();
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("border");

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={accentColor}
      iconColor={{ default: mutedColor, selected: accentColor }}
      labelStyle={{
        default: { color: mutedColor, fontSize: 11, fontWeight: "500" },
        selected: { color: accentColor, fontSize: 11, fontWeight: "600" },
      }}
      backgroundColor={backgroundColor}
      blurEffect="systemChromeMaterial"
      shadowColor={borderColor}
      indicatorColor={accentColor}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="uploads">
        <NativeTabs.Trigger.Label>{t("tabs.uploads")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{
            default: "icloud.and.arrow.up",
            selected: "icloud.and.arrow.up.fill",
          }}
          md="cloud_upload"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="notifications">
        <NativeTabs.Trigger.Label>
          {t("tabs.notifications")}
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "bell", selected: "bell.fill" }}
          md="notifications"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>{t("tabs.account")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

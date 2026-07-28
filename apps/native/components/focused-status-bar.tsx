import { StatusBar, StatusBarStyle } from "expo-status-bar";
import { useIsFocused } from "expo-router";

type FocusedStatusBarProps = {
  style: StatusBarStyle;
};

export function FocusedStatusBar({ style }: FocusedStatusBarProps) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return <StatusBar style={style} />;
}

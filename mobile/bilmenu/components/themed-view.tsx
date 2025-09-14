import { View, type ViewProps } from "react-native";

import { BilMenuTheme } from "@/constants/theme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  // Use BilMenuTheme colors directly, with fallback to provided colors
  const backgroundColor =
    lightColor || darkColor || BilMenuTheme.colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

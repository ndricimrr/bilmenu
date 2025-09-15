import React from "react";
import { StyleSheet, View, Switch } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { BilMenuTheme } from "@/constants/theme";

interface NotificationToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
}

export function NotificationToggle({
  title,
  description,
  enabled,
  onToggle,
}: NotificationToggleProps) {
  return (
    <View style={styles.settingCard}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <ThemedText type="default" style={styles.settingTitle}>
            {title}
          </ThemedText>
          <ThemedText style={styles.settingDescription}>
            {description}
          </ThemedText>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{
            false: BilMenuTheme.colors.switchTrack,
            true: BilMenuTheme.colors.secondary,
          }}
          thumbColor={
            enabled
              ? BilMenuTheme.colors.switchThumbActive
              : BilMenuTheme.colors.switchThumb
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingCard: {
    backgroundColor: BilMenuTheme.colors.surface,
    borderRadius: BilMenuTheme.borderRadius.medium,
    padding: BilMenuTheme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: BilMenuTheme.spacing.xs,
  },
  settingInfo: {
    flex: 1,
    marginRight: BilMenuTheme.spacing.sm,
  },
  settingTitle: {
    fontSize: BilMenuTheme.typography.body.fontSize,
    fontWeight: BilMenuTheme.typography.subtitle.fontWeight,
    color: BilMenuTheme.colors.text,
  },
  settingDescription: {
    fontSize: BilMenuTheme.typography.small.fontSize,
    color: BilMenuTheme.colors.textLight,
    lineHeight: BilMenuTheme.typography.small.lineHeight,
    marginTop: 2,
  },
});

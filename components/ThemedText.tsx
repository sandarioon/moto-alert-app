import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "error" | "link" | "label";
  onPress?: () => void;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  onPress,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "error" ? styles.error : undefined,
        type === "link" ? styles.link : undefined,
        type === "label" ? styles.label : undefined,
        style,
      ]}
      onPress={onPress}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    color: "#000",
    fontSize: 14,
  },
  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  link: {
    color: "blue",
    fontSize: 16,
  },
  label: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
  },
});

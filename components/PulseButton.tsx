import { Text, Animated, StyleSheet } from "react-native";
import React, { useState } from "react";

export function PulseButton({ onTouchStart }: { onTouchStart: () => void }) {
  const [scale] = useState(new Animated.Value(1));

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => pulse());
  };

  pulse();

  return (
    <Animated.View
      onTouchStart={onTouchStart}
      style={{
        backgroundColor: "#FF0000",
        borderRadius: "50%",
        padding: 20,
        width: 250,
        height: 250,
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scale }],
      }}
    >
      <Text style={styles.activeAccidentButtonTitle}>Отменить</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  activeAccidentButtonTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
});

import { router } from "expo-router";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

import { AuthContext } from "@/context/AuthContext";
import { ThemedButton } from "@/components/ThemedButton";

export default function HomeScreen() {
  const { authToken } = React.useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      router.push("/(tabs)");
    }
  }, [authToken]);

  const handleEnterPress = () => {
    router.push("/login");
  };

  const handleRegisterPress = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <ThemedButton
            type="default"
            title="У меня уже есть аккаунт"
            onPress={handleEnterPress}
          />
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            type="default"
            title="Зарегистрироваться"
            onPress={handleRegisterPress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginBottom: 15,
  },
});

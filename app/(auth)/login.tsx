import {
  View,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LOGIN } from "@/api/requests";
import { validateEmail } from "@/utils/utils";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { AUTH_TOKEN_KEY } from "@/context/constants";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { GeoLocationContext } from "@/context/GeoLocationContext";
import { PushNotificationsContext } from "@/context/PushNotificationsContext";

export default function LoginScreen() {
  const { updateAuthToken } = useContext(AuthContext);
  const { location } = useContext(GeoLocationContext);
  const { expoPushToken } = useContext(PushNotificationsContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(AUTH_TOKEN_KEY).then((authToken) => {
      if (authToken) {
        updateAuthToken(authToken);
      }
    });
  }, []);

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setError("Некорректный email");
      return;
    }

    const url = process.env.EXPO_PUBLIC_API_URL + LOGIN;
    const body = {
      email: email.trim(),
      password,
      expoPushToken,
      latitude: location ? location.coords.latitude : null,
      longitude: location ? location.coords.longitude : null,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.info(`${options.method} ${url} response:`, data);
        if (data.error) {
          setError(data.message);
          throw new Error(data.message);
        }
        AsyncStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
        updateAuthToken(data.data.token);
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      });
  };

  const handleForgotPassword = () => {
    router.push("/forgotPassword");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <ThemedTextInput
              type="active"
              value={email}
              editable={true}
              maxLength={50}
              onChangeText={(text) => setEmail(text)}
              placeholder="Email@gmail.com"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedTextInput
              type="active"
              value={password}
              editable={true}
              maxLength={50}
              onChangeText={(text) => setPassword(text)}
              placeholder="Пароль"
              secureTextEntry={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton type="default" title="Войти" onPress={handleLogin} />
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton
              type="clear"
              title="Забыли пароль?"
              onPress={handleForgotPassword}
            />
          </View>

          <View style={styles.errorContainer}>
            <ThemedText type="error">{error}</ThemedText>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  errorContainer: {},
});

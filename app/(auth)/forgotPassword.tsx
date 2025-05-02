import {
  View,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import React, { useState } from "react";

import {
  AUTH_FORGOT_PASSWORD,
  AUTH_FORGOT_PASSWORD_ERROR,
} from "@/api/requests";
import { validateEmail } from "@/utils/utils";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { showMessage } from "react-native-flash-message";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleReturn = () => {
    router.push("/login");
  };

  const handleForgotEmail = () => {
    if (!validateEmail(email)) {
      setError("Некорректный email");
      return;
    }

    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + AUTH_FORGOT_PASSWORD;
    const body = {
      email: email.trim(),
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
          showMessage({
            duration: 3000,
            message: AUTH_FORGOT_PASSWORD_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setEmailSent(true);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <ThemedText style={{ textAlign: "center" }} type="default">
            Мы отправили вам на почту ваш новый пароль. Используйте его для
            входа в приложение.
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            type="default"
            title="Вернуться к входу"
            onPress={handleReturn}
          />
        </View>
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.textContainer}>
            <ThemedText style={{ textAlign: "center" }} type="default">
              Укажите ваш email. Мы отправим вам на почту новый пароль для входа
              в приложение
            </ThemedText>
          </View>
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

          <View style={styles.buttonContainer}>
            <ThemedButton
              type="default"
              title="Далее"
              onPress={handleForgotEmail}
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
  textContainer: {
    marginBottom: 10,
  },
});

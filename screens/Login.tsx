import {
  View,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  PushNotificationsContext,
  PushNotificationsContextValue,
} from "@/context/PushNotificationsContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { GeoLocationContext } from "@/context/GeoLocationContext";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";

export default function Login() {
  const { login } = React.useContext(AuthContext) as AuthContextValue;
  const { location } = useContext(GeoLocationContext);
  const { expoPushToken } = useContext(
    PushNotificationsContext
  ) as PushNotificationsContextValue;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signUpActive, setSignUpActive] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        login(token);
      }
    });
  }, []);

  const handleSignUpActive = () => {
    setError(null);
    setSignUpActive(!signUpActive);
  };

  const handleLogin = () => {
    const url = "https://moto-alert.ru/auth/login";
    const body = {
      email: email.trim(),
      password,
      expoPushToken,
      latitude: location ? location.coords.latitude : null,
      longitude: location ? location.coords.longitude : null,
    };
    console.log("handleLogin");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw new Error(data.message);

        AsyncStorage.setItem("token", data.token);
        login(data.token);
      })
      .catch((error) => {
        console.log("Error:", error);
        setError(error.message);
      });
  };

  const handleCreate = () => {
    const url = "https://moto-alert.ru/auth/create";
    console.log("handleCreate");
    if (password !== repassword) {
      setError("Passwords do not match");
      return;
    }

    const body = {
      email: email.trim(),
      password,
      expoPushToken,
      latitude: location ? location.coords.latitude : null,
      longitude: location ? location.coords.longitude : null,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) throw new Error(data.message);

        AsyncStorage.setItem("token", data.token);
        login(data.token);
      })
      .catch((error) => {
        console.log("Error:", error);
        setError(error.message);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <ThemedTextInput
            type="active"
            value={email}
            editable={true}
            maxLength={50}
            onChangeText={(text) => setEmail(text)}
            placeholder="Email@gmail.com"
          />

          <ThemedTextInput
            type="active"
            value={password}
            editable={true}
            maxLength={50}
            onChangeText={(text) => setPassword(text)}
            placeholder="Пароль"
            secureTextEntry={true}
          />

          {signUpActive && (
            <ThemedTextInput
              type="active"
              value={repassword}
              editable={true}
              maxLength={50}
              onChangeText={(text) => setRepassword(text)}
              placeholder="Повторите пароль"
              secureTextEntry={true}
            />
          )}
          {error && <ThemedText type="error">{error}</ThemedText>}
          <ThemedButton
            type="default"
            title={signUpActive === true ? "Зарегистрироваться" : "Войти"}
            onPress={signUpActive === true ? handleCreate : handleLogin}
          />
          <ThemedButton
            type="clear"
            title={
              signUpActive === true
                ? "У меня уже есть аккаунт"
                : "Создать аккаунт"
            }
            onPress={handleSignUpActive}
          />
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
});

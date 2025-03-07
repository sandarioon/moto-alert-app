import {
  View,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "@/context/AuthContext";
import { AUTH_TOKEN_KEY } from "@/context/constants";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { GeoLocationContext } from "@/context/GeoLocationContext";
import { PushNotificationsContext } from "@/context/PushNotificationsContext";

export default function LoginScreen() {
  const { updateAuthToken } = React.useContext(AuthContext);
  const { location } = useContext(GeoLocationContext);
  const { expoPushToken } = useContext(PushNotificationsContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(AUTH_TOKEN_KEY).then((authToken) => {
      if (authToken) {
        updateAuthToken(authToken);
      }
    });
  }, []);

  const handleLogin = () => {
    const url = "https://moto-alert.ru/auth/login";
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

        AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
        updateAuthToken(data.token);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  // const handleCreate = () => {
  //   const url = "https://moto-alert.ru/auth/create";
  //   console.log("handleCreate");
  //   if (password !== repassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   const body = {
  //     email: email.trim(),
  //     password,
  //     expoPushToken,
  //     latitude: location ? location.coords.latitude : null,
  //     longitude: location ? location.coords.longitude : null,
  //   };

  //   fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(body),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.error) throw new Error(data.message);

  //       AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token);
  //       updateAuthToken(data.token);
  //     })
  //     .catch((error) => {
  //       console.log("Error:", error);
  //       setError(error.message);
  //     });
  // };

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

          <ThemedButton type="default" title="Войти" onPress={handleLogin} />
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

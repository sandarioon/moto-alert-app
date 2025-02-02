import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";

import { GeoLocationContext } from "@/context/GeoLocationContext";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import {
  PushNotificationsContext,
  PushNotificationsContextValue,
} from "@/context/PushNotificationsContext";

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
        <TextInput
          style={styles.input}
          placeholder="Email@gmail.com"
          placeholderTextColor="#787878"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor="#787878"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {signUpActive && (
          <TextInput
            style={styles.input}
            placeholder="Повторите пароль"
            placeholderTextColor="#787878"
            secureTextEntry={true}
            value={repassword}
            onChangeText={(text) => setRepassword(text)}
          />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
        <Button
          buttonStyle={styles.loginButtonContainer}
          titleStyle={styles.loginButton}
          title={signUpActive === true ? "Зарегистрироваться" : "Войти"}
          onPress={signUpActive === true ? handleCreate : handleLogin}
        />
        <Button
          buttonStyle={styles.signUpSwitchButton}
          titleStyle={styles.signUpSwitchButtonText}
          title={
            signUpActive === true
              ? "У меня уже есть аккаунт"
              : "Создать аккаунт"
          }
          onPress={handleSignUpActive}
        />
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
    marginBottom: 80,
    backgroundColor: "#fff",
  },
  input: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#eceef5",
    marginBottom: 15,
    padding: 20,
    paddingLeft: 20,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  loginButtonContainer: {
    width: "100%",
    backgroundColor: "#25a9e2",
    borderRadius: 10,
    marginTop: 25,
    padding: 10,
  },
  loginButton: {
    color: "#fff",
    width: "100%",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto",
  },
  signUpSwitchButton: {
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "white",
  },
  signUpSwitchButtonText: {
    color: "#25a9e2",
    fontSize: 16,
  },
});

import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-native-elements";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { LocationContext } from "@/app/_layout";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Login() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  const { location } = useContext(LocationContext);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [signUpActive, setSignUpActive] = useState(false);
  const { login } = React.useContext(AuthContext) as AuthContextValue;

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (token) {
        login(token);
      }
    });

    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleSignUpActive = () => {
    setError(null);
    setSignUpActive(!signUpActive);
  };

  const handleLogin = () => {
    const url = process.env.EXPO_PUBLIC_API_URL + "/auth/login";
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
    const url = process.env.EXPO_PUBLIC_API_URL + "/auth/create";
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

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

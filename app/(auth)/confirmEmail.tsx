import {
  View,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { useContext, useEffect, useState } from "react";

import {
  AUTH_RESEND_CODE,
  AUTH_VERIFY_CODE,
  AUTH_RESEND_CODE_ERROR,
  AUTH_VERIFY_CODE_ERROR,
} from "@/api/requests";
import { log } from "@/utils/utils";
import { UserContext } from "@/context/UserContext";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { AUTH_TOKEN_KEY } from "@/context/constants";
import { showMessage } from "react-native-flash-message";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConfirmEmailScreen() {
  const { updateAuthToken } = useContext(AuthContext);
  const { user } = useContext(UserContext);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(11);
  const [timerActive, setTimerActive] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          setTimerActive(false);
          setError("");
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  const handleVerifyCode = () => {
    if (code.length < 6) {
      setError("Код должен содержать 6 символов");
      return;
    }

    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + AUTH_VERIFY_CODE;
    const body = {
      email: user.email?.trim(),
      code,
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
        log(options.method, url, data);
        if (data.error) {
          setTimerActive(true);
          setIsCodeSent(true);
          setMinutes(1);
          setSeconds(0);
          setError(data.message);
          showMessage({
            duration: 3000,
            message: AUTH_VERIFY_CODE_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          AsyncStorage.setItem(AUTH_TOKEN_KEY, data.data.token);
          updateAuthToken(data.data.token);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResendCode = () => {
    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + AUTH_RESEND_CODE;
    const body = {
      email: user.email?.trim(),
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
        log(options.method, url, data);
        if (data.error) {
          setError(data.message);
          showMessage({
            duration: 3000,
            message: AUTH_RESEND_CODE_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setMinutes(1);
          setSeconds(0);
          setTimerActive(true);
          setIsCodeSent(true);
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.textContainer}>
            <ThemedText style={{ textAlign: "center" }} type="default">
              Для завершения регистрации введите код подтверждения, который мы
              отправили на ваш email. Если письмо не приходит, проверьте папку
              &quot;Спам&quot;
            </ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedTextInput
              type="active"
              value={code}
              editable={true}
              maxLength={6}
              onChangeText={(text) => {
                setCode(text);
              }}
              keyboardType="phone-pad"
              placeholder="839746"
            />
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton
              type={timerActive ? "inactive" : "default"}
              title="Готово"
              onPress={handleVerifyCode}
            />
          </View>

          <View style={styles.errorContainer}>
            {timerActive && (
              <ThemedText type="default">
                {`Отправить повторно через: ${
                  minutes < 10 ? `0${minutes}` : minutes
                }:${seconds < 10 ? `0${seconds}` : seconds}`}
              </ThemedText>
            )}
            {!timerActive && isCodeSent && (
              <ThemedButton
                type="clear"
                title="Отправить повторно"
                onPress={handleResendCode}
              />
            )}
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
  textContainer: {
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  errorContainer: {},
});

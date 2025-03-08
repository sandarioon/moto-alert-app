import {
  View,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { useContext, useState } from "react";

import { validateEmail } from "@/utils/utils";
import { UserContext } from "@/context/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function RegisterScreen() {
  const { updateUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");

  const handleRegisterPress = () => {
    if (validateEmail(email) === false) {
      setError("Некорректный email");
    } else if (password.length < 8 || repassword.length < 8) {
      setError("Пароль должен содержать не менее 8 символов");
    } else if (password !== repassword) {
      setError("Пароли не совпадают");
    } else {
      updateUser({ email, password });
      router.push("/fillData");
    }
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
              maxLength={25}
              onChangeText={(text) => {
                setError("");
                setPassword(text);
              }}
              placeholder="Пароль"
              secureTextEntry={true}
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedTextInput
              type="active"
              value={repassword}
              editable={true}
              maxLength={25}
              onChangeText={(text) => {
                setError("");
                setRepassword(text);
              }}
              placeholder="Повторите пароль"
              secureTextEntry={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <ThemedButton
              type="default"
              title="Далее"
              onPress={handleRegisterPress}
            />
          </View>
          <View style={styles.buttonContainer}>
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
    marginBottom: 15,
  },
});

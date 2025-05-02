import {
  View,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import { useContext, useState } from "react";

import { UserGender } from "@/context/types";
import { validatePhone } from "@/utils/utils";
import { UserContext } from "@/context/UserContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { showMessage } from "react-native-flash-message";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { AUTH_CREATE, AUTH_CREATE_ERROR } from "@/api/requests";
import { GeoLocationContext } from "@/context/GeoLocationContext";
import { PushNotificationsContext } from "@/context/PushNotificationsContext";

export default function FillDataScreen() {
  const { user, updateUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [nameInputError, setNameInputError] = useState("");
  const [gender, setGender] = useState(UserGender.MALE);
  const [phone, setPhone] = useState("");
  const [phoneInputError, setPhoneInputError] = useState("");
  const [bikeModel, setBikeModel] = useState("");
  const [bikeModelInputError, setBikeModelInputError] = useState("");
  const { expoPushToken } = useContext(PushNotificationsContext);
  const { location } = useContext(GeoLocationContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSetUserData = () => {
    if (name.length < 2) {
      setNameInputError("Имя должно содержать не менее двух символов");
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneInputError("Формат номера: +79001234567");
      return;
    }
    if (bikeModel.length < 4) {
      setBikeModelInputError("Не менее трех символов");
      return;
    }
    updateUser({ name, gender, phone, bikeModel });
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + AUTH_CREATE;
    const body = {
      email: user.email?.trim(),
      password: user.password,
      expoPushToken,
      name,
      gender,
      phone,
      bikeModel,
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
          showMessage({
            duration: 3000,
            message: AUTH_CREATE_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          router.push("/confirmEmail");
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
          <View style={styles.labelContainer}>
            <ThemedText type="label">Имя</ThemedText>
          </View>
          <ThemedTextInput
            type="active"
            value={name}
            editable={true}
            maxLength={25}
            onChangeText={(text) => {
              setName(text);
              if (text.length < 2) {
                setNameInputError(
                  "Имя должно содержать не менее двух символов"
                );
              } else {
                setNameInputError("");
              }
            }}
            placeholder="Иван Иванов"
          />
          {nameInputError && (
            <View>
              <ThemedText type="error">{nameInputError}</ThemedText>
            </View>
          )}

          <View style={styles.labelContainer}>
            <ThemedText type="label">Пол</ThemedText>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxItem}>
              <Checkbox
                style={styles.checkbox}
                disabled={false}
                value={gender === UserGender.MALE}
                onValueChange={() => setGender(UserGender.MALE)}
              />
              <ThemedText type="default">Мужской</ThemedText>
            </View>
            <View style={styles.checkboxItem}>
              <Checkbox
                style={styles.checkbox}
                disabled={false}
                value={gender === UserGender.FEMALE}
                onValueChange={() => setGender(UserGender.FEMALE)}
              />
              <ThemedText type="default">Женский</ThemedText>
            </View>
          </View>

          <View style={styles.labelContainer}>
            <ThemedText type="label">Телефон</ThemedText>
          </View>
          <ThemedTextInput
            type="active"
            value={phone}
            editable={true}
            maxLength={12}
            onChangeText={(text) => {
              setPhone(text);
              if (!validatePhone(text)) {
                setPhoneInputError("Формат номера: +79001234567");
              } else {
                setPhoneInputError("");
              }
            }}
            placeholder="+79001234567"
            keyboardType="phone-pad"
          />
          {phoneInputError && (
            <View>
              <ThemedText type="error">{phoneInputError}</ThemedText>
            </View>
          )}

          <View style={styles.labelContainer}>
            <ThemedText type="label">Марка и модель мотоцикла</ThemedText>
          </View>
          <ThemedTextInput
            type="active"
            value={bikeModel}
            editable={true}
            maxLength={50}
            onChangeText={(text) => {
              setBikeModel(text);
              if (text.length < 4) {
                setBikeModelInputError("Не менее трех символов");
              } else {
                setBikeModelInputError("");
              }
            }}
            placeholder="Yamaha R1"
          />
          {bikeModelInputError && (
            <View>
              <ThemedText type="error">{bikeModelInputError}</ThemedText>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <ThemedButton
              type="default"
              title="Далее"
              onPress={handleSetUserData}
            />
          </View>
          <View>
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
  labelContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    marginHorizontal: 5,
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
  },
  buttonContainer: {
    marginTop: 15,
  },
});

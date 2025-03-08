import {
  View,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";

import { validatePhone } from "@/utils/utils";
import { User, UserGender } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { GET_PROFILE, UPDATE_USER } from "@/api/requests";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function ProfileScreen() {
  const route = useRoute();
  const params = route.params;

  const { removeAuthToken } = React.useContext(AuthContext);
  const { authToken } = useContext(AuthContext);

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nameInputError, setNameInputError] = useState("");
  const [phoneInputError, setPhoneInputError] = useState("");
  const [bikeModelInputError, setBikeModelInputError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    console.log("Profile Screen reloaded");
    fetchUser();
  }, [params]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + GET_PROFILE;
    const options = {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.info(`${options.method} ${url} response:`, data);
        if (data.error) {
          showMessage({
            duration: 3000,
            message: "Не удалось загрузить данные о пользователе",
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setUser(data.data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEditMode = () => {
    setNameInputError("");
    setPhoneInputError("");
    setBikeModelInputError("");
    setIsEditMode(!isEditMode);
  };

  const updateUser = () => {
    if (!user || (!user.name && !user.phone && !user.bikeModel && !user.gender))
      return;
    if (nameInputError || phoneInputError || bikeModelInputError) return;
    if (!authToken || !user) return;

    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + UPDATE_USER;
    const body: Partial<User> = {};
    if (user.name) body.name = user.name;
    if (user.phone) body.phone = user.phone;
    if (user.bikeModel) body.bikeModel = user.bikeModel;
    if (user.gender) body.gender = user.gender;
    const options = {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.info(`${options.method} ${url} response:`, data);
        if (data.error) {
          showMessage({
            duration: 3000,
            message: "Не удалось обновить данные пользователя",
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setUser(data.data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Персональные данные</ThemedText>
        </View>

        <View style={styles.labelContainer}>
          <ThemedText type="label">Имя и фамилия</ThemedText>
        </View>
        <ThemedTextInput
          type={isEditMode ? "active" : "inactive"}
          value={user.name}
          editable={isEditMode}
          maxLength={50}
          onChangeText={(text) => {
            setUser({ ...user, name: text });
            if (text.length < 2) {
              setNameInputError("Имя должно содержать не менее двух символов");
            } else {
              setNameInputError("");
            }
          }}
          placeholder="Иван Иванов"
        />
        {nameInputError && (
          <View style={styles.errorTextContainer}>
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
              disabled={!isEditMode}
              value={user.gender === "MALE"}
              onValueChange={() =>
                setUser({ ...user, gender: UserGender.MALE })
              }
            />
            <ThemedText type="default">Мужской</ThemedText>
          </View>
          <View style={styles.checkboxItem}>
            <Checkbox
              style={styles.checkbox}
              disabled={!isEditMode}
              value={user.gender === "FEMALE"}
              onValueChange={() =>
                setUser({ ...user, gender: UserGender.FEMALE })
              }
            />
            <ThemedText type="default">Женский</ThemedText>
          </View>
        </View>

        <View style={styles.labelContainer}>
          <ThemedText type="label">Телефон</ThemedText>
        </View>
        <ThemedTextInput
          type={isEditMode ? "active" : "inactive"}
          value={user.phone}
          editable={isEditMode}
          maxLength={12}
          onChangeText={(phone) => {
            setUser({ ...user, phone: phone });
            if (validatePhone(phone)) {
              setPhoneInputError("");
            } else {
              setPhoneInputError("Укажите номер телефона");
            }
          }}
          placeholder="8XXXXXXXXXX"
          keyboardType="phone-pad"
        />
        {phoneInputError && (
          <View style={styles.errorTextContainer}>
            <ThemedText type="error">{phoneInputError}</ThemedText>
          </View>
        )}

        <View style={styles.labelContainer}>
          <ThemedText type="label">Марка и модель мотоцикла</ThemedText>
        </View>
        <ThemedTextInput
          type={isEditMode ? "active" : "inactive"}
          value={user.bikeModel}
          editable={isEditMode}
          maxLength={50}
          onChangeText={(bikeModel) => {
            setUser({ ...user, bikeModel: bikeModel });
            if (bikeModel.length < 4) {
              setBikeModelInputError("Не менее трех символов");
            } else {
              setBikeModelInputError("");
            }
          }}
          placeholder="Yamaha R1"
        />
        {bikeModelInputError && (
          <View style={styles.errorTextContainer}>
            <ThemedText type="error">{bikeModelInputError}</ThemedText>
          </View>
        )}
        {isEditMode ? (
          <View style={{ flex: 1, marginTop: 15 }}>
            <ThemedButton
              type="default"
              title="Сохранить"
              onPress={updateUser}
            />

            <ThemedButton
              buttonStyle={{ marginTop: 15 }}
              type="inactive"
              title="Отменить"
              onPress={handleEditMode}
            />
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: 15 }}>
            <ThemedButton
              type="default"
              title="Редактировать"
              onPress={handleEditMode}
            />
          </View>
        )}
        <ThemedButton type="error" title="Выйти" onPress={removeAuthToken} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    marginTop: 30,
    marginBottom: 10,
  },
  labelContainer: {
    width: "100%",
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
  errorTextContainer: {
    marginBottom: 10,
  },
});

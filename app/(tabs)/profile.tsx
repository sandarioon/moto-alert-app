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
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";

export default function ProfileScreen() {
  const route = useRoute();
  const params = route.params;

  const { logout } = React.useContext(AuthContext) as AuthContextValue;
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nameInputError, setNameInputError] = useState<string | null>(null);
  const [phoneInputError, setPhoneInputError] = useState<string | null>(null);
  const [bikeModelInputError, setBikeModelInputError] = useState<string | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    console.log("Profile Screen reloaded");
    fetchUser();
  }, [params]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch("https://moto-alert.ru/user/", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("Fetched user", data);

      setUser(data);
    } catch (error) {
      console.log("Error:", error);
      showMessage({
        duration: 3000,
        message: "Не удалось загрузить данные о пользователе",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMode = () => {
    setNameInputError(null);
    setPhoneInputError(null);
    setBikeModelInputError(null);
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    if (!user || (!user.name && !user.phone && !user.bikeModel && !user.gender))
      return;
    if (nameInputError || phoneInputError || bikeModelInputError) return;
    if (!token || !user) return;

    const body: Partial<User> = {};
    if (user.name) body.name = user.name;
    if (user.phone) body.phone = user.phone;
    if (user.bikeModel) body.bikeModel = user.bikeModel;
    if (user.gender) body.gender = user.gender;

    try {
      setIsLoading(true);
      const response = await fetch("https://moto-alert.ru/user/update", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("User data updated successfully", JSON.stringify(data));

      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      showMessage({
        duration: 3000,
        message: "Не удалось сохранить данные о пользователе",
        type: "danger",
      });
    } finally {
      setIsLoading(false);
    }
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
              setNameInputError(null);
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
              value={user.gender === "male"}
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
              value={user.gender === "female"}
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
          maxLength={11}
          onChangeText={(phone) => {
            setUser({ ...user, phone: phone });

            if (validatePhone(phone)) {
              setPhoneInputError(null);
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
              setBikeModelInputError(null);
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
          <View style={{ flex: 1 }}>
            <ThemedButton
              type="default"
              title="Сохранить"
              onPress={handleSave}
            />

            <ThemedButton
              type="inactive"
              title="Отменить"
              onPress={handleEditMode}
            />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ThemedButton
              type="default"
              title="Редактировать"
              onPress={handleEditMode}
            />
          </View>
        )}
        <ThemedButton type="error" title="Выйти" onPress={logout} />
        <View style={{ height: 100 }}></View>
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
    marginTop: 50,
    marginBottom: 20,
  },
  labelContainer: {
    width: "100%",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 25,
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

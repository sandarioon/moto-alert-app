import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { Button } from "react-native-elements";
import React, { useContext, useEffect, useState } from "react";

import { User } from "@/context/types";
import { AuthContext, AuthContextValue } from "@/context/AuthContext";
import { validatePhone } from "@/utils/utils";

export default function TabThreeScreen() {
  const { logout } = React.useContext(AuthContext) as AuthContextValue;
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneInputError, setPhoneInputError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/users/",
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("Fetched user", data);

      setUser(data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = async () => {
    if (!token || !user) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/users/update",
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            bikeModel: user.bikeModel,
            gender: user.gender,
          }),
        }
      );

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("User data updated successfully", JSON.stringify(data));

      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
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
        <Text style={styles.title}>Персональные данные</Text>

        <Text style={styles.label}>Имя и фамилия</Text>
        <TextInput
          style={isEditMode ? styles.inputEnabled : styles.inputDisabled}
          value={user.name}
          editable={isEditMode}
          maxLength={50}
          onChangeText={(text) => setUser({ ...user, name: text })}
          placeholder="Иван Иванов"
          placeholderTextColor={"#ccc"}
        />

        <Text style={styles.label}>Пол</Text>
        <View style={styles.checkbox}>
          <View style={styles.checkboxItem}>
            <Checkbox
              disabled={!isEditMode}
              value={user.gender === "male"}
              onValueChange={() => setUser({ ...user, gender: "male" })}
            />
            <Text style={styles.checkBoxText}>Мужской</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Checkbox
              disabled={!isEditMode}
              value={user.gender === "female"}
              onValueChange={() => setUser({ ...user, gender: "female" })}
            />
            <Text style={styles.checkBoxText}>Женский</Text>
          </View>
        </View>

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={isEditMode ? styles.inputEnabled : styles.inputDisabled}
          value={user.phone}
          editable={isEditMode}
          maxLength={11}
          onChangeText={(phone) => {
            setUser({ ...user, phone: phone });

            if (validatePhone(phone)) {
              setPhoneInputError(null);
            } else {
              setPhoneInputError("Номер должен содержать 11 цифр");
            }
          }}
          placeholder="89191234567"
          placeholderTextColor={"#ccc"}
          keyboardType="phone-pad"
        />
        {phoneInputError && (
          <Text style={styles.inputError}>{phoneInputError}</Text>
        )}

        <Text style={styles.label}>Марка и модель мотоцикла</Text>
        <TextInput
          style={isEditMode ? styles.inputEnabled : styles.inputDisabled}
          value={user.bikeModel}
          editable={isEditMode}
          maxLength={50}
          onChangeText={(bikeModel) =>
            setUser({ ...user, bikeModel: bikeModel })
          }
          placeholder="Yamaha R1"
          placeholderTextColor={"#ccc"}
        />
        <Button
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title={isEditMode ? "Сохранить" : "Редактировать"}
          onPress={isEditMode ? handleSave : handleEditMode}
        />
        <Button
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
          title={"Выйти"}
          onPress={logout}
        />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  inputEnabled: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eceef5",
    marginBottom: 15,
    padding: 20,
    paddingLeft: 20,
  },
  inputDisabled: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#eceef5",
    borderWidth: 1,
    borderColor: "#eceef5",
    marginBottom: 15,
    padding: 20,
    paddingLeft: 20,
  },
  checkbox: {
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
  checkBoxText: {
    marginLeft: 10,
  },
  button: {
    width: "100%",
    backgroundColor: "#25a9e2",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputError: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

import { Checkbox } from "expo-checkbox";
import { useLocalSearchParams } from "expo-router";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import {
  USER_GET_PROFILE_BY_ID,
  USER_GET_PROFILE_BY_ID_ERROR,
} from "@/api/requests";
import { log } from "@/utils/utils";
import { User } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function UserScreen() {
  const { id } = useLocalSearchParams();

  const { authToken, removeAuthToken } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleFetchUserById(id);
  }, []);

  const handleFetchUserById = (id: string | string[]) => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + USER_GET_PROFILE_BY_ID + id;
    const options = {
      method: "GET",
      headers: {
        Authorization: authToken,
      },
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        log(options.method, url, data);
        if (data.status === 401) {
          removeAuthToken();
        }
        if (data.error) {
          showMessage({
            duration: 3000,
            message: USER_GET_PROFILE_BY_ID_ERROR,
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  if (!isLoading && user === null) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText type="title">
          Не удалось получить данные пользователя
        </ThemedText>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Профиль</ThemedText>
        </View>

        <View style={styles.labelContainer}>
          <ThemedText type="label">Имя и фамилия</ThemedText>
        </View>
        <ThemedTextInput
          type={"inactive"}
          value={user?.name as string}
          editable={false}
          maxLength={50}
          onChangeText={() => {}}
          placeholder=""
        />
        <View style={styles.labelContainer}>
          <ThemedText type="label">Пол</ThemedText>
        </View>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxItem}>
            <Checkbox
              style={styles.checkbox}
              disabled={true}
              value={(user?.gender as string) === "MALE"}
            />
            <ThemedText type="default">Мужской</ThemedText>
          </View>
          <View style={styles.checkboxItem}>
            <Checkbox
              style={styles.checkbox}
              disabled={true}
              value={(user?.gender as string) === "FEMALE"}
            />
            <ThemedText type="default">Женский</ThemedText>
          </View>
        </View>

        <View style={styles.labelContainer}>
          <ThemedText type="label">Телефон</ThemedText>
        </View>
        <ThemedTextInput
          type={"inactive"}
          value={user?.phone as string}
          editable={false}
          maxLength={12}
          onChangeText={() => {}}
          placeholder=""
        />

        <View style={styles.labelContainer}>
          <ThemedText type="label">Марка и модель мотоцикла</ThemedText>
        </View>
        <ThemedTextInput
          type={"inactive"}
          value={user?.bikeModel as string}
          editable={false}
          maxLength={50}
          onChangeText={() => {}}
          placeholder=""
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
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

import { useLocalSearchParams } from "expo-router";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";
import { Clipboard, View, StyleSheet, ActivityIndicator } from "react-native";

import { log } from "@/utils/utils";
import { Accident } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ACCIDENTS_GET_BY_ID, ACCIDENTS_GET_BY_ID_ERROR } from "@/api/requests";

export default function AccidentScreen() {
  const { id } = useLocalSearchParams();

  const { authToken, removeAuthToken } = useContext(AuthContext);
  const [accident, setAccident] = useState<Accident | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleAccidentById(id);
  }, []);

  const handleCopyCoordinates = () => {
    Clipboard.setString(`${accident?.latitude}, ${accident?.longitude}`);
    showMessage({
      duration: 3000,
      message: "Координаты скопированы",
      type: "success",
    });
  };

  const handleAccidentById = (id: string | string[]) => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + ACCIDENTS_GET_BY_ID + id;
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
            message: ACCIDENTS_GET_BY_ID_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setAccident(data.data);
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

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">ДТП</ThemedText>
      </View>

      <View style={styles.labelContainer}>
        <ThemedText type="label">ID</ThemedText>
      </View>
      <ThemedTextInput
        type={"inactive"}
        value={String(accident?.id) as string}
        editable={false}
        maxLength={50}
        onChangeText={() => {}}
        placeholder=""
      />
      <View style={styles.labelContainer}>
        <ThemedText type="label">Координаты</ThemedText>
      </View>
      <View style={{ flexDirection: "row" }}>
        <ThemedTextInput
          type={"inactive"}
          value={
            String(accident?.latitude + ", " + accident?.longitude) as string
          }
          editable={false}
          maxLength={50}
          onChangeText={() => {}}
          placeholder=""
        />
        <FontAwesome
          onPress={handleCopyCoordinates}
          name="copy"
          style={{ marginLeft: 10 }}
          size={44}
          color={"#25a9e2"}
        />
      </View>

      <View style={styles.labelContainer}>
        <ThemedText type="label">Дата</ThemedText>
      </View>
      <ThemedTextInput
        type={"inactive"}
        value={accident?.createdAt as string}
        editable={false}
        maxLength={50}
        onChangeText={() => {}}
        placeholder=""
      />
    </View>
  );
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

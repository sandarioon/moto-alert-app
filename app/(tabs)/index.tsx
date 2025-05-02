import { Linking } from "react-native";
import { Button } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import {
  ACCIDENTS_CANCEL,
  ACCIDENTS_CREATE,
  ACCIDENTS_GET_CURRENT,
  ACCIDENTS_CANCEL_ERROR,
  ACCIDENTS_CREATE_ERROR,
  ACCIDENTS_GET_CURRENT_ERROR,
} from "@/api/requests";
import { Accident } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { PulseButton } from "@/components/PulseButton";
import { showMessage } from "react-native-flash-message";
import { ThemedButton } from "@/components/ThemedButton";
import { GeoLocationContext } from "@/context/GeoLocationContext";

export default function HomeScreen() {
  const route = useRoute();
  const params = route.params;

  const { authToken, removeAuthToken } = useContext(AuthContext);

  const { location, locationErrMsg, updateLocation } =
    useContext(GeoLocationContext);

  const [currentAccident, setCurrentAccident] = useState<Accident | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Home Screen reloaded");
  }, [params]);

  useEffect(() => {
    fetchCurrentAccident();
  }, []);

  const fetchCurrentAccident = () => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + ACCIDENTS_GET_CURRENT;
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
        if (data.status === 401) {
          removeAuthToken();
        }
        if (data.error) {
          showMessage({
            duration: 3000,
            message: ACCIDENTS_GET_CURRENT_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setCurrentAccident(data.accident);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateAccident = async () => {
    if (!location) return;

    updateLocation();
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + ACCIDENTS_CREATE;
    const body = {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    };
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
        if (data.status === 401) {
          removeAuthToken();
        }
        if (data.error) {
          showMessage({
            duration: 3000,
            message: ACCIDENTS_CREATE_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setCurrentAccident(data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelAccident = async () => {
    if (!authToken) return;

    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + ACCIDENTS_CANCEL;
    const options = {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json",
      },
    };

    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        console.info(`${options.method} ${url} response:`, data);
        if (data.status === 401) {
          removeAuthToken();
        }
        if (data.error) {
          showMessage({
            duration: 3000,
            message: ACCIDENTS_CANCEL_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setCurrentAccident(null);
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
    <View style={styles.container}>
      {currentAccident ? (
        <PulseButton onTouchStart={handleCancelAccident} />
      ) : (
        <Button
          buttonStyle={
            locationErrMsg
              ? styles.disabledAccidentButton
              : styles.inactiveAccidentButton
          }
          titleStyle={styles.inactiveAccidentButtonTitle}
          title="Сообщить о ДТП"
          onPress={handleCreateAccident}
        />
      )}
      <View>
        <ThemedButton
          type="default"
          title="Позвонить 112"
          onPress={() => Linking.openURL("tel:112")}
        />
      </View>
      {currentAccident && (
        <ThemedText
          style={{ textAlign: "center", fontWeight: "bold" }}
          type="default"
        >
          Вы сообщили об аварии. Push-уведомления были отправлены всем в радиусе
          50 км от вас. Если вы случайно нажали на кнопку, отмените свой запрос
          о помощи.
        </ThemedText>
      )}
      <ThemedText
        style={{ textAlign: "center", fontWeight: "bold" }}
        type="default"
      >
        {locationErrMsg
          ? "Для того, чтобы сообщить об аварии вы должны включить геолокацию"
          : ""}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  activeAccidentButton: {
    backgroundColor: "#FF0000",
    borderRadius: "50%",
    padding: 20,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledAccidentButton: {
    backgroundColor: "#eceef5",
    borderRadius: "50%",
    padding: 20,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveAccidentButton: {
    backgroundColor: "#25a9e2",
    borderRadius: "50%",
    padding: 20,
    width: 250,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveAccidentButtonTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
  },
});

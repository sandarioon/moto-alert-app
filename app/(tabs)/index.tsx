import {
  Text,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Linking } from "react-native";
import * as Location from "expo-location";
import { Button } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";

import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

export default function HomeScreen() {
  const route = useRoute();
  const params = route.params;

  const authContext = useContext(AuthContext);

  const [scale] = useState(new Animated.Value(1));
  const [accident, setAccident] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = authContext?.token;

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationErrMsg, setLocationErrMsg] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log("Home Screen reloaded");
  }, [params]);

  useEffect(() => {
    fetchCurrentAccident();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    console.log("Geo location status", status);
    if (status !== "granted") {
      // Permission is not granted, ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrMsg("Permission to access location was denied");
        return;
      }
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("Location updated");
    setLocation(location);
  };

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => pulse());
  };

  pulse();

  const fetchCurrentAccident = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const response = await fetch(`https://moto-alert.ru/accidents/current`, {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("Fetched current accident", data);

      setAccident(data.accident);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccident = async () => {
    if (location && token) {
      try {
        getCurrentLocation();
        setIsLoading(true);
        const response = await fetch("https://moto-alert.ru/accidents/create", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          }),
        });

        const data = await response.json();
        if (data.error) throw new Error(JSON.stringify(data));
        console.log("Created accident", data);

        setAccident(data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelAccident = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const response = await fetch("https://moto-alert.ru/accidents/cancel", {
        method: "POST",
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("Canceled accident", data);

      setAccident(null);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
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
      {accident ? (
        <TouchableOpacity>
          <Animated.View
            onTouchStart={handleCancelAccident}
            style={{
              backgroundColor: "#FF0000",
              borderRadius: "50%",
              padding: 20,
              width: 250,
              height: 250,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ scale }],
            }}
          >
            <Text style={styles.activeAccidentButtonTitle}>Отменить</Text>
          </Animated.View>
        </TouchableOpacity>
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
      {accident && (
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
  activeAccidentButtonTitle: {
    fontWeight: "bold",
    color: "white",
    fontSize: 24,
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

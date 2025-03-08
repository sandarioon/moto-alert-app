import {
  View,
  Modal,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import MapView, { Callout, Marker } from "react-native-maps";
import React, { useContext, useEffect, useState } from "react";

import { Accident } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";
import { GeoLocationContext } from "@/context/GeoLocationContext";

export default function MapScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { location, locationErrMsg } = useContext(GeoLocationContext);
  const { authToken } = useContext(AuthContext);

  const route = useRoute();
  const params = route.params;

  useEffect(() => {
    console.log("Map Screen reloaded");
  }, [params]);

  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccidents = async () => {
    if (!authToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL + "/accidents/",
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(JSON.stringify(data));
      console.log("Fetched accidents", data);

      setAccidents(data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHelpInAccident = async (accidentId: number | undefined) => {
    if (location && authToken && accidentId) {
      try {
        setIsLoading(true);
        const response = await fetch(
          process.env.EXPO_PUBLIC_API_URL + "/accidents/help/" + accidentId,
          {
            method: "POST",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data.error) throw new Error(JSON.stringify(data));
        console.log("Helped in accident", data);
      } catch (error) {
        console.log("Error:", error);
        showMessage({
          duration: 3000,
          message: "Вы не можете отозваться на собственный запрос о помощи",
          type: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchAccidents();
    }, [authToken])
  );

  if (!location || locationErrMsg) {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  }

  const initialRegion = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  console.log("selectedAccident", selectedAccident);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
      >
        {accidents.length > 0 &&
          accidents.map((accident, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: Number(accident.latitude),
                longitude: Number(accident.longitude),
              }}
              title={accident.title || "No title"}
              description={accident.description || "No description"}
            >
              <Callout
                onPress={() => {
                  setSelectedAccident(accident);
                  setModalVisible(true);
                }}
              >
                <View>
                  <ThemedText type="label">{accident.title}</ThemedText>
                  <ThemedText type="default">{accident.description}</ThemedText>
                  <ThemedButton
                    type="default"
                    title="Подробнее"
                    onPress={() => {}}
                  />
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.textContainer}>
              <ThemedText type="label">ID: </ThemedText>
              <ThemedText type="default">{selectedAccident?.id}</ThemedText>
            </View>

            <View style={styles.textContainer}>
              <ThemedText type="label">Имя: </ThemedText>
              <ThemedText type="default">{selectedAccident?.name}</ThemedText>
            </View>

            {selectedAccident?.phone ? (
              <View style={styles.textContainer}>
                <ThemedText type="label">Телефон: </ThemedText>
                <ThemedText
                  type="link"
                  onPress={() =>
                    Linking.openURL(`tel:${selectedAccident?.phone}`)
                  }
                >
                  {selectedAccident.phone}
                </ThemedText>
              </View>
            ) : (
              <View style={styles.textContainer}>
                <ThemedText type="label">Телефон: </ThemedText>
                <ThemedText type="default">Не указан</ThemedText>
              </View>
            )}

            <View style={styles.textContainer}>
              <ThemedText type="label">Пол: </ThemedText>
              <ThemedText type="default">
                {selectedAccident?.gender === "MALE" ? "Мужской" : "Женский"}
              </ThemedText>
            </View>

            <View style={styles.textContainer}>
              <ThemedText type="label">Мотоцикл: </ThemedText>
              <ThemedText type="default">
                {selectedAccident?.bikeModel || "Не указан"}
              </ThemedText>
            </View>

            <ThemedButton
              type="default"
              title="Отозваться на помощь"
              onPress={() => handleHelpInAccident(selectedAccident?.id)}
            />
            <ThemedButton
              type="default"
              title="Закрыть"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
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
  textContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
});

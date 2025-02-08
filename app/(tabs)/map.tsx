import {
  Text,
  View,
  Modal,
  Linking,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Button } from "react-native-elements";
import React, { useContext, useState } from "react";
import { showMessage } from "react-native-flash-message";
import MapView, { Callout, Marker } from "react-native-maps";

import { Accident } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { GeoLocationContext } from "@/context/GeoLocationContext";

export default function TabTwoScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { location, locationErrMsg } = useContext(GeoLocationContext);
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccidents = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://moto-alert.ru/accidents/`, {
        headers: {
          Authorization: token,
        },
      });
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
    if (location && token && accidentId) {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://moto-alert.ru/accidents/help/" + accidentId,
          {
            method: "POST",
            headers: {
              Authorization: token,
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
    }, [token])
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
                  <Text style={styles.calloutTextTitle}>{accident.title}</Text>
                  <Text style={styles.calloutTextDescription}>
                    {accident.description}
                  </Text>
                  <Button
                    buttonStyle={styles.calloutButton}
                    titleStyle={styles.calloutButtonTitle}
                    title="Подробнее"
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
              <Text style={styles.modalTextTitle}>ID: </Text>
              <Text style={styles.modalTextDescription}>
                {selectedAccident?.id}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.modalTextTitle}>Имя: </Text>
              <Text style={styles.modalTextDescription}>
                {selectedAccident?.name}
              </Text>
            </View>

            {selectedAccident?.phone ? (
              <View style={styles.textContainer}>
                <Text style={styles.modalTextTitle}>Телефон: </Text>
                <Text
                  style={styles.calloutPhone}
                  onPress={() =>
                    Linking.openURL(`tel:${selectedAccident?.phone}`)
                  }
                >
                  {selectedAccident.phone}
                </Text>
              </View>
            ) : (
              <View style={styles.textContainer}>
                <Text style={styles.modalTextTitle}>Телефон: </Text>
                <Text style={styles.modalTextDescription}>Не указан</Text>
              </View>
            )}

            <View style={styles.textContainer}>
              <Text style={styles.modalTextTitle}>Пол: </Text>
              <Text style={styles.modalTextDescription}>
                {selectedAccident?.gender === "male" ? "Мужской" : "Женский"}
              </Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.modalTextTitle}>Мотоцикл: </Text>
              <Text style={styles.modalTextDescription}>
                {selectedAccident?.bikeModel || "Не указан"}
              </Text>
            </View>

            <Button
              buttonStyle={styles.modalHelpButton}
              titleStyle={styles.modalHelpButtonTitle}
              title="Отозваться на помощь"
              onPress={() => handleHelpInAccident(selectedAccident?.id)}
            />

            <Button
              buttonStyle={styles.modalCloseButton}
              titleStyle={styles.modalCloseButtonTitle}
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
  textContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  calloutTextTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  calloutTextDescription: {
    marginTop: 5,
    fontSize: 16,
  },
  modalTextTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  modalTextDescription: {
    fontSize: 16,
  },
  calloutPhone: {
    color: "blue",
    fontSize: 16,
  },
  calloutButton: {
    marginTop: 20,
  },
  calloutButtonTitle: {},
  modalHelpButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  modalHelpButtonTitle: {},
  modalCloseButton: {
    marginTop: 10,
    borderRadius: 10,
  },
  modalCloseButtonTitle: {},
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

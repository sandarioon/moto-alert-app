import { useFocusEffect } from "expo-router";
import { Button } from "react-native-elements";
import React, { useContext, useState } from "react";
import MapView, { Callout, Marker } from "react-native-maps";
import { Text, View, StyleSheet, ActivityIndicator, Modal } from "react-native";

import { Accident } from "@/context/types";
import { AuthContext } from "@/context/AuthContext";
import { GeoLocationContext } from "@/context/GeoLocationContext";
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks";

export default function TabTwoScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { location, locationErrMsg } = useContext(GeoLocationContext);
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [selectedAccident, setSelectedAccident] = useState<Accident | null>(
    null
  );
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccidents = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://moto-alert.ru/accidents/`, {
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
          "http://moto-alert.ru/accidents/help/" + accidentId,
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
                  <Text style={styles.calloutTitle}>{accident.title}</Text>
                  <Text style={styles.calloutDescription}>
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
            <Text>ID: {selectedAccident?.id}</Text>
            <Text>USER ID: {selectedAccident?.userId}</Text>
            <Text>TITLE: {selectedAccident?.title}</Text>
            <Text>DESCRIPTION: {selectedAccident?.description}</Text>
            <Text>CREATED AT: {selectedAccident?.createdAt}</Text>
            <Text>PUSH RECIPIENTS: {selectedAccident?.pushRecipients}</Text>
            <Text>{}</Text>
            <Button
              title="Отозваться на помощь"
              onPress={() => handleHelpInAccident(selectedAccident?.id)}
            />
            <Button
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
  map: {
    width: "100%",
    height: "100%",
  },
  calloutTitle: {},
  calloutDescription: {},
  calloutButton: {},
  calloutButtonTitle: {},
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

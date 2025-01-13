import { useFocusEffect } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import React, { useContext, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";

import { LocationContext } from "../_layout";
import { AuthContext } from "@/context/AuthContext";

export default function TabTwoScreen() {
  const { location, locationErrMsg } = useContext(LocationContext);
  const [accidents, setAccidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const fetchAccidents = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/accidents/`,
        {
          headers: {
            Authorization: token,
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
  } else {
    console.log("location", location);
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button title="" onPress={fetchAccidents} />
        </View>
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
              />
            ))}
        </MapView>
      </View>
    );
  }
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
  buttonContainer: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    zIndex: 1,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

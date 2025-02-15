import { createContext, useEffect, useState } from "react";
import * as Location from "expo-location";

export interface GeoLocationContextValue {
  location: Location.LocationObject | null;
  locationErrMsg: string | null;
  updateLocation: () => void;
}

const GeoLocationContext = createContext<GeoLocationContextValue>({
  location: null,
  locationErrMsg: null,
  updateLocation: () => {},
});

const GeoLocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationErrMsg, setLocationErrMsg] = useState<string | null>(null);

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

  const updateLocation = async () => {
    getCurrentLocation();
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <GeoLocationContext.Provider
      value={{ location, locationErrMsg, updateLocation }}
    >
      {children}
    </GeoLocationContext.Provider>
  );
};

export { GeoLocationProvider, GeoLocationContext };

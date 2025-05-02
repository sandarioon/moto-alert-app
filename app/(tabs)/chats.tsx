import { Link } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { log } from "@/utils/utils";
import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { CHATS_GET_ALL, CHATS_GET_ALL_ERROR } from "@/api/requests";

export default function ChatsScreen() {
  const route = useRoute();
  const params = route.params;

  const { authToken, removeAuthToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState<{ id: number }[]>([]);

  useEffect(() => {
    console.log("Chats Screen reloaded");
    fetchChats();
  }, [params]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = () => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + CHATS_GET_ALL;
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
            message: CHATS_GET_ALL_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setChats(data.data);
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
      {chats.length > 0 ? (
        <FlatList
          data={chats}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/chat/[id]",
                params: { id: item.id },
              }}
            >
              <View style={styles.chatItem}>
                <ThemedText type="title">{item.id}</ThemedText>
                <ThemedText type="title">Название</ThemedText>
                <ThemedText type="default">Последнее сообщение</ThemedText>
              </View>
            </Link>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <ThemedText type="title">У вас пока нет активных чатов</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 20,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

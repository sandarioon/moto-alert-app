import { Link } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, FlatList } from "react-native";

import { AuthContext } from "@/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { GET_CHATS } from "@/api/requests";

export default function ChatsScreen() {
  const route = useRoute();
  const params = route.params;

  const { authToken } = useContext(AuthContext);
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
    const url = process.env.EXPO_PUBLIC_API_URL + GET_CHATS;
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
        if (data.error) {
          showMessage({
            duration: 3000,
            message: "Не удалось загрузить чаты пользователя",
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          // setChats([
          //   { id: 1 },
          //   { id: 2 },
          //   { id: 3 },
          //   { id: 4 },
          //   { id: 5 },
          //   { id: 6 },
          //   { id: 7 },
          //   { id: 8 },
          //   { id: 9 },
          //   { id: 10 },
          //   { id: 11 },
          //   { id: 12 },
          //   { id: 13 },
          //   { id: 14 },
          //   { id: 15 },
          // ]);
          setChats(data);
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

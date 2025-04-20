import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { showMessage } from "react-native-flash-message";
import React, { useContext, useEffect, useState } from "react";

import { User } from "@/context/types";
import { IChatMessage } from "./models";
import { useSocket } from "@/hooks/useSocket";
import ChatMessage from "@/components/ChatMessage";
import { AuthContext } from "@/context/AuthContext";
import { GET_CHAT, GET_PROFILE } from "@/api/requests";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function ChatScreen() {
  let scrollViewRef: ScrollView | null = null;

  const { id } = useLocalSearchParams();
  const { authToken } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const { socketData, sendChatMessage, isConnected } = useSocket({ authToken });

  const [isLoading, setIsLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<
    { userId: number; message: string; timestamp: number }[]
  >([]);

  useEffect(() => {
    if (socketData) setMessages([...messages, socketData]);
  }, [socketData]);

  useEffect(() => {
    fetchChat(Number(id));
    fetchUser();
  }, []);

  const fetchUser = () => {
    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + GET_PROFILE;
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
            message: "Не удалось загрузить данные о пользователе",
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setUser(data.data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchChat = (id: number) => {
    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + GET_CHAT + id;
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
            message: `Не удалось загрузить чат с id ${id}`,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setMessages(data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatInputMessage = (message: string): IChatMessage => {
    return {
      chatId: Number(id),
      message,
    };
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          marginTop: 60,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ alignItems: "center" }}>Чат id: {id}</Text>
      </View>

      <ScrollView
        style={{
          flex: 1,
          padding: 16,
        }}
        ref={(ref) => {
          scrollViewRef = ref;
        }}
        onContentSizeChange={() => {
          if (scrollViewRef) {
            scrollViewRef.scrollToEnd({ animated: true });
          }
        }}
      >
        {messages
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((message, index) => (
            <ChatMessage
              key={index}
              user={user}
              message={message}
              index={index}
            />
          ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 10,
        }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: isConnected ? "#34C759" : "#FF3B30",
            marginRight: 10,
          }}
        />
        <ThemedTextInput
          type={"active"}
          value={inputMessage}
          editable={true}
          maxLength={500}
          onChangeText={(inputMessage) => {
            setInputMessage(inputMessage);
          }}
          placeholder="Введите сообщение"
          style={{ flex: 1, marginRight: 10 }}
        />
        <TouchableOpacity
          onPress={() => {
            console.log("Send message:", inputMessage);
            sendChatMessage(formatInputMessage(inputMessage));
            setInputMessage("");
          }}
        >
          <FontAwesome
            name="send"
            style={{ marginRight: 10 }}
            size={24}
            color={"#25a9e2"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

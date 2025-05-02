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

import {
  CHATS_GET_CHAT,
  USER_GET_PROFILE,
  CHATS_GET_CHAT_ERROR,
  USER_GET_PROFILE_ERROR,
} from "@/api/requests";
import { log } from "@/utils/utils";
import { User } from "@/context/types";
import { useSocket } from "@/hooks/useSocket";
import { AuthContext } from "@/context/AuthContext";
import ChatMessageItem from "@/components/ChatMessage";
import { ChatMessage, InputChatMessage } from "./models";
import { ThemedTextInput } from "@/components/ThemedTextInput";

export default function ChatScreen() {
  let scrollViewRef: ScrollView | null = null;

  const { id } = useLocalSearchParams();
  const { authToken, removeAuthToken } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const { socketData, sendChatMessage, isConnected } = useSocket({ authToken });

  const [isLoading, setIsLoading] = useState(true);
  const [inputChatMessage, setInputChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (socketData) setChatMessages([...chatMessages, socketData]);
  }, [socketData]);

  useEffect(() => {
    handleFetchChat(Number(id));
    handleFetchUser();
  }, []);

  const handleFetchUser = () => {
    setIsLoading(true);
    const url = process.env.EXPO_PUBLIC_API_URL + USER_GET_PROFILE;
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
            message: USER_GET_PROFILE_ERROR,
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

  const handleFetchChat = (id: number) => {
    setIsLoading(true);

    const url = process.env.EXPO_PUBLIC_API_URL + CHATS_GET_CHAT + id;
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
            message: CHATS_GET_CHAT_ERROR,
            type: "danger",
          });
          throw new Error(data.message);
        } else {
          setChatMessages(data.data);
        }
      })
      .catch((error) => {
        console.error(`${options.method} ${url} error:`, error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatInputChatMessage = (message: string): InputChatMessage => {
    return {
      chatId: Number(id),
      userId: Number(user?.id),
      message,
    };
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
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
        {chatMessages.length > 0 ? (
          chatMessages
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message, index) => (
              <ChatMessageItem
                key={index}
                user={user}
                message={message}
                index={index}
              />
            ))
        ) : (
          <Text style={{ alignItems: "center" }}>Нет сообщений</Text>
        )}
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
          value={inputChatMessage}
          editable={true}
          maxLength={500}
          onChangeText={(inputMessage) => {
            setInputChatMessage(inputMessage);
          }}
          placeholder="Введите сообщение"
          style={{ flex: 1, marginRight: 10 }}
        />
        <TouchableOpacity
          onPress={() => {
            console.log("Send message:", inputChatMessage);
            sendChatMessage(formatInputChatMessage(inputChatMessage));
            setInputChatMessage("");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
});

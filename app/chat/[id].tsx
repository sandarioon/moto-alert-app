import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25a9e2" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.chatIdContainer}>
        <Text style={styles.chatIdText}>Чат id: {id}</Text>

        <Link
          href={{
            pathname: "/accident/[id]",
            params: { id: String(id) },
          }}
        >
          <FontAwesome
            name="info-circle"
            style={styles.infoButton}
            size={44}
            color={"#25a9e2"}
          />
        </Link>
      </View>

      <ScrollView
        style={styles.chatArea}
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
      </ScrollView>
      <View style={styles.inputContainer}>
        <View style={isConnected ? styles.online : styles.offline} />
        <TextInput
          value={inputChatMessage}
          editable={true}
          maxLength={500}
          onFocus={() => {
            if (scrollViewRef) {
              scrollViewRef.scrollToEnd({ animated: true });
            }
          }}
          onChangeText={(inputMessage) => {
            setInputChatMessage(inputMessage);
          }}
          placeholder="Введите сообщение"
          placeholderTextColor="#ccc"
          style={styles.input}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            console.log("Send message:", inputChatMessage);
            sendChatMessage(formatInputChatMessage(inputChatMessage));
            setInputChatMessage("");
          }}
        >
          <FontAwesome
            name="send"
            style={styles.sendButton}
            size={24}
            color={"#25a9e2"}
          />
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  chatIdContainer: {
    marginTop: 50,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  chatIdText: {
    alignItems: "center",
    marginLeft: 150,
  },
  chatArea: {
    flex: 1,
  },
  online: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#34C759",
    marginRight: 10,
  },
  offline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#959595",
    padding: 15,
    paddingLeft: 20,
  },
  sendButton: {},
  infoButton: {},
});

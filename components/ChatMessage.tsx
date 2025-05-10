import { View, Text, StyleSheet } from "react-native";

import { User } from "@/context/types";
import ChatMessageAvatar from "./ChatMessageAvatar";

export default function ChatMessageItem({
  user,
  message,
  index,
}: {
  user: User | null;
  message: { userId: number; name: string; message: string; timestamp: number };
  index: number;
}) {
  if (!user) return;
  if (!message || !message.userId) return;

  const isMyMessage = message.userId === user?.id;

  return (
    <View
      key={index}
      style={
        message.userId === user?.id
          ? styles.messageContainerRight
          : styles.messageContainerLeft
      }
    >
      {isMyMessage ? (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={
              message.userId === user.id
                ? styles.bubbleTextMyUser
                : styles.bubbleTextOtherUser
            }
          >
            {message.message}
          </Text>
          <ChatMessageAvatar
            name={message.name}
            userId={message.userId}
            isMyMessage={isMyMessage}
          />
        </View>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <ChatMessageAvatar
            name={message.name}
            userId={message.userId}
            isMyMessage={isMyMessage}
          />
          <Text
            style={
              message.userId === user.id
                ? styles.bubbleTextMyUser
                : styles.bubbleTextOtherUser
            }
          >
            {message.message}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainerLeft: {
    borderRadius: 16,
    paddingVertical: 5,
    flexDirection: "row",
    alignSelf: "flex-start",
  },
  messageContainerRight: {
    borderRadius: 16,
    paddingVertical: 5,
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  bubbleTextMyUser: {
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 5,
    backgroundColor: "#25a9e2",
  },
  bubbleTextOtherUser: {
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#25a111",
  },
});

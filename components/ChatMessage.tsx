import { View, Text } from "react-native";

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
      style={[
        {
          borderRadius: 16,
          paddingVertical: 5,
          flexDirection: "row",
          alignSelf: message.userId === user?.id ? "flex-end" : "flex-start",
        },
      ]}
    >
      {isMyMessage ? (
        <View style={{ flexDirection: "row" }}>
          <Text
            style={[
              {
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
                backgroundColor:
                  message.userId === user.id ? "#25a9e2" : "#25a111",
              },
              {
                color: "#fff",
              },
            ]}
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
            style={[
              {
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
                backgroundColor:
                  message.userId === user.id ? "#25a9e2" : "#25a111",
              },
              {
                color: "#fff",
              },
            ]}
          >
            {message.message}
          </Text>
        </View>
      )}
    </View>
  );
}

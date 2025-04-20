import { View, Text } from "react-native";

import { User } from "@/context/types";

export default function ChatMessage({
  user,
  message,
  index,
}: {
  user: User | null;
  message: { userId: number; message: string; timestamp: number };
  index: number;
}) {
  return (
    <View
      key={index}
      style={[
        {
          borderRadius: 16,
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginBottom: 8,
        },

        message.userId === user?.id
          ? {
              backgroundColor: "#25a9e2",
              alignSelf: "flex-end",
            }
          : {
              backgroundColor: "#25a111",
              alignSelf: "flex-start",
            },
      ]}
    >
      {user ? (
        <Text
          style={[
            {
              backgroundColor:
                message.userId === user.id ? "#25a9e2" : "#25a111",
              alignSelf: message.userId === user.id ? "flex-end" : "flex-start",
            },
            {
              color: "#fff", // or any other color value
            },
          ]}
        >
          {message.message}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
}

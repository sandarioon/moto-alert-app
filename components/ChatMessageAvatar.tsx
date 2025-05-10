import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function ChatMessageAvatar({
  userId,
  name,
  isMyMessage,
}: {
  userId: number;
  name: string;
  isMyMessage: boolean;
}) {
  const getRandomColor = (userId: number) => {
    const seed = 123456789; // a random seed value
    const hash = (userId * 123123123 + seed) % 16777215; // a simple hash function
    const r = (hash >> 16) & 255;
    const g = (hash >> 8) & 255;
    const b = hash & 255;
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Link
      href={{
        pathname: "/user/[id]",
        params: { id: userId },
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: getRandomColor(userId),
          justifyContent: "center",
          alignItems: "center",
          marginRight: isMyMessage ? 0 : 5,
          marginLeft: isMyMessage ? 5 : 0,
        }}
      >
        <Text style={{ fontSize: 14, color: "#fff" }}>
          {name.charAt(0).toUpperCase()}
        </Text>
      </View>
    </Link>
  );
}

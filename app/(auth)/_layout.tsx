import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="index"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackVisible: true,
          headerTitle: "",
          headerBackTitle: "Назад",
          headerShown: true,
        }}
        name="register"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackVisible: true,
          headerTitle: "",
          headerBackTitle: "Назад",
          headerShown: true,
        }}
        name="login"
      />
    </Stack>
  );
}

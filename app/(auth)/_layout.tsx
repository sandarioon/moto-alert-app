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
        name="login"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackVisible: true,
          headerTitle: "",
          headerBackTitle: "Назад",
          headerShown: true,
        }}
        name="forgotPassword"
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
        name="fillData"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackVisible: true,
          headerTitle: "",
          headerBackTitle: "Назад",
          headerShown: true,
        }}
        name="policy"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackVisible: true,
          headerTitle: "",
          headerBackTitle: "Назад",
          headerShown: true,
        }}
        name="confirmEmail"
      />
    </Stack>
  );
}

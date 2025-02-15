import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

type ThemedButtonProps = {
  type: "default" | "success" | "error" | "inactive" | "clear";
  title: string;
  buttonStyle?: any;
  titleStyle?: any;
  onPress: () => void;
};

export const ThemedButton = ({
  buttonStyle,
  titleStyle,
  type,
  title,
  onPress,
}: ThemedButtonProps) => {
  return (
    <Button
      title={title}
      buttonStyle={[
        type === "default" ? styles.default : undefined,
        type === "success" ? styles.success : undefined,
        type === "error" ? styles.error : undefined,
        type === "inactive" ? styles.inactive : undefined,
        type === "clear" ? styles.clear : undefined,
        buttonStyle,
      ]}
      titleStyle={[
        type === "default" ? styles.titleDefault : undefined,
        type === "success" ? styles.titleSuccess : undefined,
        type === "error" ? styles.titleError : undefined,
        type === "inactive" ? styles.titleInactive : undefined,
        type === "clear" ? styles.titleClear : undefined,
        titleStyle,
      ]}
      onPress={onPress}
    />
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: "#25a9e2",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  success: {
    backgroundColor: "#2d9717",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  error: {
    backgroundColor: "#FF0033",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  inactive: {
    backgroundColor: "#808080",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
  },
  clear: {
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "white",
  },
  titleDefault: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleSuccess: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleError: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleInactive: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  titleClear: {
    color: "#25a9e2",
    fontSize: 16,
    fontWeight: "bold",
  },
});

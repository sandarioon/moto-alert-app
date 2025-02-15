import { TextInput, StyleSheet, KeyboardTypeOptions } from "react-native";

type ThemedTextInputProps = {
  type: "active" | "inactive";
  value: string;
  editable: boolean;
  maxLength: number;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: any;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
};

export const ThemedTextInput = ({
  type,
  style,
  value,
  editable,
  maxLength,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
}: ThemedTextInputProps) => {
  const placeholderTextColor = type === "active" ? "#ccc" : "#000000";

  return (
    <TextInput
      style={[
        type === "active" ? styles.active : undefined,
        type === "inactive" ? styles.inactive : undefined,
        style,
      ]}
      value={value}
      editable={editable}
      maxLength={maxLength}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  active: {
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#959595",
    marginBottom: 15,
    padding: 20,
    paddingLeft: 20,
  },
  inactive: {
    borderRadius: 10,
    backgroundColor: "#eceef5",
    borderWidth: 1,
    borderColor: "#eceef5",
    marginBottom: 15,
    padding: 20,
    paddingLeft: 20,
  },
});

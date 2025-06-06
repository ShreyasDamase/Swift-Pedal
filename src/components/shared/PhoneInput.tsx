import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { FC } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
}) => {
  return (
    <View style={style.container}>
      <CustomText>❤️ +91</CustomText>
      <TextInput
        placeholder="0000000000"
        keyboardType="phone-pad"
        value={value}
        maxLength={10}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={"#ccc"}
        style={style.input}
      />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 0,
    paddingHorizontal: 10,
  },
  input: {
    fontSize: RFValue(13),
    fontFamily: "Medium",
    height: 45,
    width: "90%",
  },
  test: {
    fontSize: RFValue(13),
    top: -1,
    fontFamily: "Medium",
  },
});
export default PhoneInput;

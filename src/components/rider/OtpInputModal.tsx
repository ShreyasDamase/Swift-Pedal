import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { memo, useRef, useState } from "react";
import { modalStyles } from "@/styles/modalStyles";

interface OtpInputModalProp {
  visible: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (otp: string) => void;
}
const OtpInputModal: React.FC<OtpInputModalProp> = ({
  visible,
  onClose,
  title,
  onConfirm,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<Array<any>>([]);
  const handleOtpChange = (value: string, index: number) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < inputs.current.length - 1) {
        inputs.current[index + 1].focus();
      }
      if (!value && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleConfirm = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 4) {
      onConfirm(otpValue);
    } else alert("please enter a 4-digit OTP");
  };
  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalContainer}>
        <Text style={modalStyles.centerText}>{title}</Text>

        <View style={style.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              style={style.otpInput}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>
        <TouchableOpacity style={style.confirmButton} onPress={handleConfirm}>
          <Text style={style.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
const style = StyleSheet.create({
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#d3d3d3",
    textAlign: "center",
    fontSize: 18,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default memo(OtpInputModal);

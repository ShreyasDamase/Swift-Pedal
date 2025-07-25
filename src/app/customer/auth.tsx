import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { authStyles } from "@/styles/authStyles";
import { commonStyles } from "@/styles/commonStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useWS } from "@/service/WSProvider";
import PhoneInput from "@/components/shared/PhoneInput";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { signin } from "@/service/authService";

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");
  const handleNext = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert("Please enter valid phone number");
      return;
    }
    signin({ role: "customer", phone }, updateAccessToken);
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            style={authStyles.logo}
            source={require("@/assets/images/logo_t.png")}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color="grey" />
            <CustomText fontFamily="Medium" variant="h7">
              Help
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Medium" variant="h6">
          What's your number?
        </CustomText>
        <CustomText
          fontFamily="Regular"
          variant="h7"
          style={commonStyles.lightText}
        >
          Enter your phone number to proceed
        </CustomText>
        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>
      <View style={authStyles.footerContainer}>
        <CustomText
          fontFamily="Regular"
          variant="h8"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 20 },
          ]}
        >
          By continuing, you agree to the terms and privacy policy of shift
          pedal app
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleNext}
          loading={false}
          disabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Auth;

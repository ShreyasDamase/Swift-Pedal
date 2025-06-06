import { View, Text, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { tokenStorage } from "@/store/storage";
import { resetAndNavigate } from "@/utils/Helpers";
import { refresh_tokens } from "@/service/apiInterceptor";
import { jwtDecode } from "jwt-decode";
import { logOut } from "@/service/authService";

interface DecodedToken {
  exp: number;
}
const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    SemiBold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  });

  const { user } = useUserStore();
  const [hasNavigated, setHasNavigated] = useState(false);




  const tokenCheck = async () => {
    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;
    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);
      const currentTime = Date.now() / 1000;

      if (decodedAccessToken?.exp < currentTime) {
        resetAndNavigate("/role");
        Alert.alert("Session Expired, please login again");
        logOut();
      }
      if (decodedRefreshToken?.exp < currentTime) {
        try {
          refresh_tokens();
        } catch (err) {
          console.log(err);
          Alert.alert("Refresh Token Error");
        }
      }
      if (user) {
        resetAndNavigate("./customer/home");
      } else {
        resetAndNavigate("./rider/home");
      }
    }
    resetAndNavigate("/role");
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeout = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      });
      return () => clearTimeout(timeout);
    }
  }, [loaded, hasNavigated]);


  
  return (
    <View style={commonStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />

      <CustomText variant="h5" fontFamily="Medium" style={splashStyles.text}>
        Welcome to SwiftPedal
      </CustomText>
    </View>
  );
};

export default Main;

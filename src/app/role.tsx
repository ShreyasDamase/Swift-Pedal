import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { roleStyles } from "@/styles/roleStyles";
import CustomText from "@/components/shared/CustomText";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import { useRiderStore } from "@/store/riderStore";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };
  const handleRiderPress = () => {
    router.navigate("/rider/auth");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = tokenStorage.getString("access_token");
        const userStr = tokenStorage.getString("user");

        console.log("🔑 Token from storage:", token);
        console.log("👤 User string from storage:", userStr);

        if (token && userStr) {
          const user = JSON.parse(userStr);
          console.log("✅ Parsed user object:", user);

          if (user.role === "customer") {
            console.log("➡ Navigating to Customer Home");
            useUserStore.getState().setUser(user);
            resetAndNavigate("/customer/home");
          } else if (user.role === "rider") {
            console.log("➡ Navigating to Rider Home");
            useRiderStore.getState().setUser(user);
            resetAndNavigate("/rider/home");
          } else {
            console.warn("⚠️ Unknown role:", user.role);
            setLoading(false);
          }
        } else {
          console.warn("❌ Token or user not found, showing role selector");
          setLoading(false);
        }
      } catch (err) {
        console.error("💥 Error in checkLogin:", err);
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={roleStyles.container}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }
  return (
    <View style={roleStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={roleStyles.logo}
      />
      <CustomText fontFamily="Medium" variant="h6">
        Choose your user type
      </CustomText>
      <TouchableOpacity style={roleStyles.card} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Customer</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a Rider? Join us to drive and deliverier.
          </CustomText>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={roleStyles.card} onPress={handleRiderPress}>
        <Image
          source={require("@/assets/images/rider.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Rider</CustomText>
          <CustomText style={roleStyles.description}>
            Are you a Rider? Join us to drive and deliverier.
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;

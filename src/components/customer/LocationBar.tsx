import { logOut } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { useUserStore } from "@/store/userStore";
import { uiStyles } from "@/styles/uiStyles";
import { Colors } from "@/utils/Constants";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import CustomText from "../shared/CustomText";
const LocationBar = () => {
  const { location } = useUserStore();
  const { disconnect } = useWS();
  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView style={uiStyles.container}>
        <TouchableOpacity
          style={uiStyles.btn}
          onPress={() => logOut(disconnect)}
        >
          <AntDesign
            name="poweroff"
            size={RFValue(15)}
            color={Colors.text}
            style={{ padding: 4 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={uiStyles.locationBar}
          onPress={() => router.navigate("/customer/selectedLocation")}
        >
          <View style={uiStyles.dot} />
          <CustomText numberOfLines={1} style={uiStyles.locationText}>
            {location?.address || "Getting address..."}
          </CustomText>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default LocationBar;

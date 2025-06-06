import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { rideStyles } from "@/styles/rideStyles";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { resetAndNavigate } from "@/utils/Helpers";
import { StatusBar } from "expo-status-bar";
import RiderLiveTracking from "@/components/rider/RiderLiveTracking";
import { updateRideStatus } from "@/service/rideService";
import RiderActionButton from "@/components/rider/RiderActionButton";
import OtpInputModal from "@/components/rider/OtpInputModal";
const Liveride = () => {
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const { setLocation, location, setOnDuty } = useRiderStore();

  const { emit, on, off } = useWS();
  const [rideData, setRideData] = useState<any>(null);
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;
  console.log("otp", rideData?.otp);

  useEffect(() => {
    let locationsSubsription: any;
    const startLocationUpdate = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationsSubsription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 200,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "Somewhere",
              heading: heading as number,
            });
            setOnDuty(true);
            emit("goOnDuty", {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              heading: heading as number,
            });
            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
            console.log(
              `Location updated: Lat ${latitude}, long ${longitude} , Heading ${heading}`
            );
          }
        );
      } else {
        console.log("Location permission denied");
      }
    };
    startLocationUpdate();
    return () => {
      if (locationsSubsription) {
        locationsSubsription.remove();
      }
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);
      on("rideData", (data) => {
        setRideData(data);
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });
      on("rideCanceled", (error) => {
        resetAndNavigate("/rider/home");
        Alert.alert("Ride Canceld");
      });
      on("error", (error) => {
        console.log("Ride error", error);
        resetAndNavigate("/rider/home");
        Alert.alert("no ride found");
      });
    }
    return () => {
      off("rideData");
      off("rideUpdate");
      off("rideCanceled");
      off("error");
    };
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={true} />
      {rideData && (
        <RiderLiveTracking
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          rider={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            heading: location?.heading,
          }}
        />
      )}
      <RiderActionButton
        ride={rideData}
        title={
          rideData?.status === "START"
            ? "ARRIVED"
            : rideData?.status === "ARRIVED"
            ? "COMPLETED"
            : "SUCCESS"
        }
        onPress={async () => {
          console.log("Swipe pressed - current status:", rideData?.status);

          if (rideData?.status === "START") {
            setOtpModalVisible(true);
            return;
          }

          const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED");
          if (isSuccess) {
            Alert.alert("Congratulations! you rock🎉");
            resetAndNavigate("/rider/home");
          } else {
            Alert.alert("There was an error");
          }
        }}
        color="#228B22"
      />
      {isOtpModalVisible && (
        <OtpInputModal
          visible={isOtpModalVisible}
          onClose={() => setOtpModalVisible(false)}
          title="Enter OTP Below"
          onConfirm={async (otp) => {
            if (otp === rideData?.otp) {
              const isSuccess = await updateRideStatus(
                rideData?._id,
                "ARRIVED"
              );
              if (isSuccess) {
                setOtpModalVisible(false);
              } else {
                Alert.alert("Technical Error");
              }
            } else {
              Alert.alert("Wrong OTP");
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Liveride;

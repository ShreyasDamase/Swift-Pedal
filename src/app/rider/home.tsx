import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { getMyRides } from "@/service/rideService";
import RiderHeader from "@/components/rider/RiderHeader";
import CustomText from "@/components/shared/CustomText";
import { riderStyles } from "@/styles/riderStyles";
import RiderRidesItem from "@/components/rider/RiderRidesItem";
const RiderHome = () => {
  const isFocused = useIsFocused();
  const { emit, on, off } = useWS();
  const { onDuty, setLocation } = useRiderStore();
  const [rideOffers, setRideOffers] = useState<any[]>([]);

  useEffect(() => {
    getMyRides(false);
  }, []);

  useEffect(() => {
    let locationsSubsription: any;
    const startLocationUpdate = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationsSubsription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "Somewhere",
              heading: heading as number,
            });
            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
          }
        );
      }
    };

    if (onDuty && isFocused) {
      startLocationUpdate();
    }
    return () => {
      if (locationsSubsription) {
        locationsSubsription.remove();
      }
    };
  }, [onDuty, isFocused]);

  useEffect(() => {
    if (onDuty && isFocused) {
      on("rideOffer", (rideDetails: any) => {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?._id));
          if (!existingIds.has(rideDetails?._id)) {
            return [...prevOffers, rideDetails];
          }
          return prevOffers;
        });
      });
    }
    return () => {
      off("rideOffer");
    };
  }, [onDuty, on, off, isFocused]);

  const removeRide = (id: string) => {
    setRideOffers((prevOffers) =>
      prevOffers.filter((offer) => offer._id !== id)
    );
  };
  const renderRides = ({ item }: any) => {
    return <RiderRidesItem removeIt={() => removeRide(item._id)} item={item} />;
  };
  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      <RiderHeader />
      <FlatList
        data={!onDuty ? [] : rideOffers}
        renderItem={renderRides}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={riderStyles?.emptyContainer}>
            <Image
              source={require("@/assets/icons/ride.jpg")}
              style={riderStyles?.emptyImage}
            />
            <CustomText
              fontSize={12}
              style={{ textAlign: "center", flexWrap: "wrap" }}
            >
              {onDuty
                ? "There are no available rides! Stay Active"
                : "You're currently OFF-DUTY, please go ON-DUTY to start earning"}
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default RiderHome;

import { mapStyles } from "@/styles/mapStyles";
import { Colors } from "@/utils/Constants";
import { customMapStyle, indiaIntialRegion } from "@/utils/CustomMap";
import { getPoints } from "@/utils/mapUtils";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "../shared/CustomText";
const apiKey = process.env.EXPO_PUBLIC_MAP_API_KEY || "";
const RiderLiveTracking: FC<{
  drop: any;
  pickup: any;
  rider: any;
  status: string;
}> = ({ drop, status, pickup, rider }) => {
  const mapRef = useRef<MapView>(null);
  const [isUserInteracting, setIsInteracting] = useState(false);
  const fitToMarkers = async () => {
    if (isUserInteracting) return;
    const coordinates = [];
    if (pickup?.latitude && pickup?.longitude && status === "START") {
      coordinates.push({
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      });
    }
    if (drop?.latitude && pickup?.longitude && status === "ARRIVED") {
      coordinates.push({
        latitude: drop.latitude,
        longitude: drop.longitude,
      });
    }
    if (rider?.latitude && rider?.longitude) {
      coordinates.push({
        latitude: rider.latitude,
        longitude: rider.longitude,
      });
    }
    if (coordinates.length === 0) return;
    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    } catch (error) {
      console.log("Erron in fiiting of markers", error);
    }
  };

  const fitToMarkersWithDelay = () => {
    setTimeout(() => {
      fitToMarkers();
    }, 500);
  };

  const calculateInitialRegion = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;
      return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }
    return indiaIntialRegion;
  };
  useEffect(() => {
    if (pickup?.latitude && drop?.latitude) fitToMarkersWithDelay();
  }, [drop?.latitude, pickup?.latitude, rider?.latitude]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <MapView
        ref={mapRef}
        followsUserLocation
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        onRegionChange={() => setIsInteracting(true)}
        onRegionChangeComplete={() => setIsInteracting(false)}
      >
        {rider?.latitude && pickup?.latitude && (
          <MapViewDirections
            origin={rider}
            destination={status === "START" ? pickup : drop}
            onReady={fitToMarkers}
            apikey={apiKey}
            strokeColor={Colors.iosColor}
            strokeColors={[Colors.iosColor]}
            strokeWidth={5}
            precision="high"
            onError={(error) => console.log("Direction Error", error)}
          />
        )}
        {drop?.latitude && (
          <Marker
            coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {pickup?.latitude && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}
        {rider?.latitude && (
          <Marker
            coordinate={{
              latitude: rider.latitude,
              longitude: rider.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <View style={{ transform: [{ rotate: `${rider?.heading}deg` }] }}>
              <Image
                source={require("@/assets/icons/cab_marker.png")}
                style={{ height: 40, width: 40, resizeMode: "contain" }}
              />
            </View>
          </Marker>
        )}
        {drop && pickup && (
          <Polyline
            coordinates={getPoints([drop, pickup])}
            strokeColor={Colors.text}
            strokeWidth={2}
            geodesic={true}
            lineDashPattern={[12, 10]}
          />
        )}
      </MapView>

      <TouchableOpacity style={mapStyles.gpsLiveButton} onPress={() => {}}>
        <CustomText fontFamily="SemiBold" fontSize={10}>
          Open Live GPS
        </CustomText>
        <FontAwesome6 name="location-arrow" size={RFValue(12)} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3c75be"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default memo(RiderLiveTracking);

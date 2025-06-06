import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import { commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/utils/Constants";
import CustomText from "@/components/shared/CustomText";
import { uiStyles } from "@/styles/uiStyles";
import LocationInput from "@/components/customer/LocationInput";
import {
  calculateDistance,
  getLatLong,
  getPlacesSuggestions,
} from "@/utils/mapUtils";
import { locationStyles } from "@/styles/locationStyles";
import LocationItem from "@/components/customer/LocationItem";
import MapPickerModal from "@/components/customer/MapPickerModal";

const LocationSelection = () => {
  const { location, setLocation } = useUserStore();

  const [pickup, setPickup] = useState("");
  const [pickupCoords, setPickupCoords] = useState<any>(null);
  const [dropCoords, setDropCoords] = useState<any>(null);
  const [drop, setDrop] = useState("");
  const [locations, setLocations] = useState([]);
  const [focusedInput, setFocusedInput] = useState("drop");
  const [modalTitle, setModalTitle] = useState("drop");
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  const fetchLocation = async (query: string, type: "pickup" | "drop") => {
    if (query?.length > 4) {
      const data = await getPlacesSuggestions(query);

      // Based on input type, set location for pickup or drop
      if (type === "pickup") {
        setPickup(data?.address); // For pickup location
      } else if (type === "drop") {
        setDrop(data?.address); // For drop location
      }
      setLocations(data);
    }
  };

  const addLocation = async (id: string) => {
    const data = await getLatLong(id);
    if (data) {
      if (focusedInput === "drop") {
        console.log("drop set", data);
        setDrop(data?.address);
        setDropCoords(data);
      } else {
        console.log("pickup set", data);

        setLocation(data);

        setPickupCoords(data);
        setPickup(data?.address);
      }
    }
  };
  useEffect(() => {
    console.log("Location updated in select location :", location);
  }, [location]);

  const renderLocations = ({ item }: any) => {
    return (
      <LocationItem item={item} onPress={() => addLocation(item?.place_id)} />
    );
  };
  const checkDistance = async () => {
    if (!pickupCoords || !dropCoords) {
      console.log("Missing coordinates");
      return;
    }
    const { latitude: lat1, longitude: long1 } = pickupCoords;
    const { latitude: lat2, longitude: long2 } = dropCoords;
    if (isNaN(lat1) || isNaN(long1) || isNaN(lat2) || isNaN(long2)) {
      console.log("Invalid coordinates", { lat1, long1, lat2, long2 });
      return;
    }
    if (lat1 === lat2 && long1 === long2) {
      alert(
        "Pickup and drop location cannot be the same. Please select different locations"
      );

      return;
    }
    const distance = calculateDistance(lat1, long1, lat2, long2);
    // Validate distance result
    if (isNaN(distance)) {
      console.log("Invalid distance calculation", distance);
      return;
    }
    const minDistance = 0.5;
    const maxDistance = 50;
    if (distance < minDistance) {
      alert(
        "The selected location are too close location that are further apart"
      );
    } else if (distance > maxDistance) {
      alert(
        "The slected location are too far apart. Please select a closer drop location"
      );
    } else {
      setLocations([]);
      router.navigate({
        pathname: "/customer/RideBooking",
        params: {
          distanceInKm: distance.toFixed(2),
          drop_latitude: dropCoords?.latitude,
          drop_longitude: dropCoords?.longitude,
          drop_address: drop,
        },
      });
      console.log(`Distance is valid : ${distance.toFixed(2)} km`);
    }
  };
  useEffect(() => {
    if (
      dropCoords &&
      pickupCoords &&
      dropCoords.latitude &&
      dropCoords.longitude &&
      pickupCoords.latitude &&
      pickupCoords.longitude
    ) {
      checkDistance();
    } else {
      setLocations([]);
      setMapModalVisible(false);
    }
  }, [dropCoords, pickupCoords]);

  useEffect(() => {
    if (location) {
      setPickupCoords(location);
      setPickup(location?.address);
    }
  }, []);
  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />\
      <SafeAreaView />
      <TouchableOpacity
        style={commonStyles.flexRow}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.iosColor} />
        <CustomText fontFamily="Regular" style={{ color: Colors.iosColor }}>
          Back
        </CustomText>
      </TouchableOpacity>
      <View style={uiStyles.locationInputs}>
        <LocationInput
          placeholder="Search Pickup Location"
          type="pickup"
          value={pickup}
          onChangeText={(text) => {
            setPickup(text);
            fetchLocation(text, "pickup"); // Fetch pickup location
          }}
          onFocus={() => setFocusedInput("pickup")}
        />
        <LocationInput
          placeholder="Search Drop Location"
          type="drop"
          value={drop}
          onChangeText={(text) => {
            setDrop(text);
            fetchLocation(text, "drop"); // Fetch drop location
          }}
          onFocus={() => setFocusedInput("drop")}
        />
        <CustomText
          fontFamily="Medium"
          fontSize={10}
          style={uiStyles.suggestionText}
        >
          {focusedInput} suggestions
        </CustomText>
      </View>
      <FlatList
        data={locations}
        renderItem={renderLocations}
        keyExtractor={(item: any) => item?.place_id}
        initialNumToRender={5}
        windowSize={5}
        ListFooterComponent={
          <TouchableOpacity
            style={[commonStyles.flexRow, locationStyles.container]}
            onPress={() => {
              setModalTitle(focusedInput);
              setMapModalVisible(true);
            }}
          >
            <Image
              source={require("@/assets/icons/map_pin.png")}
              style={uiStyles.mapPinIcon}
            />
            <CustomText fontFamily="Medium" fontSize={12}>
              Select from map
            </CustomText>
          </TouchableOpacity>
        }
      />
      {isMapModalVisible && (
        <MapPickerModal
          selectedLocation={{
            latitude:
              focusedInput === "drop"
                ? dropCoords?.latitude
                : pickupCoords?.latitude,

            longitude:
              focusedInput === "drop"
                ? dropCoords?.longitude
                : pickupCoords?.longitude,
            address: focusedInput === "drop" ? drop : pickup,
          }}
          title={modalTitle}
          visible={isMapModalVisible}
          onClose={() => setMapModalVisible(false)}
          onselectedLocation={(data) => {
            if (data) {
              if (modalTitle === "drop") {
                setDrop(data.address);
                setDropCoords({
                  latitude: data.latitude,
                  longitude: data.longitude,
                  address: data.address,
                });
              } else {
                setLocation(data);
                setPickupCoords({
                  latitude: data.latitude,
                  longitude: data.longitude,
                  address: data.address,
                });
                setPickup(data.address);
              }
            }
          }}
        />
      )}
    </View>
  );
};

export default LocationSelection;

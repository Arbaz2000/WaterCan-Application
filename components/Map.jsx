// Latest version

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { Ionicons } from "@expo/vector-icons"; // Assuming you have Ionicons installed
import EditTransactionScreen from "./EditTransactionScreen"; // Import your edit transaction screen component
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "../contexts/RouteContext";
import * as Location from "expo-location";
// const Map = ({markers,admin}) => {
const Map = ({ routeStart, setRouteStart }) => {
  const {
    markerStatus,
    setMarkerStatus,
    location,
    setLocation,
    orderedClick,
    setOrderedClick,
    selectedRoute, //markers
    admin,
  } = useRoute();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markerPress, setMarkerPress] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [routeDirection, setRouteDirection] = useState({
    latitude: 28.21185895002364,
    longitude: 74.94994783048074,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  // const [routeStart, setRouteStart] = useState(false);

  const routeFun = () => {
    setMarkerPress(false);
    setRouteStart(true);
    setRouteDirection({
      latitude: selectedMarker?.coordinates?.latitude,
      longitude: selectedMarker?.coordinates?.longitude,
    });
  };

  const isDateChanged = (date1, date2) => {
    return date1.toDateString() !== date2.toDateString();
  };

console.log('------------------' , JSON.stringify(selectedRoute))

// selectedRoute.map((marker) => {
//     console.log("selectedMarker=====" , marker )
//   });
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }
    };
    const adminSetter = async () => {
      await AsyncStorage.setItem("adminId", admin);
      const adminId = await AsyncStorage.getItem("adminId");
      console.log("Admin ID :", adminId);
    };
    getPermission();
    adminSetter();
  }, [orderedClick]);

  const handleMarkerPress = (marker) => {
    setMarkerPress(true);
    setSelectedMarker(marker);
    setSelectedCustomer(marker.details); // Set selected customer details
  };

  const openEditTransactionModal = () => {
    setMarkerPress(false);
    setIsEditModalVisible(true);
    setOrderedClick(false);
  };

  const closeModal = () => {
    setMarkerPress(false);
    setSelectedMarker(null);
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS == 'android' ?  PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={{
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {selectedRoute &&
          selectedRoute.map((marker) => {
            console.log(
              "Selected Marker Color : ",
              marker.details.customer,
              " = ",
              new Date().toLocaleDateString()
            );
            return marker.details.customer.txnDate ===
              new Date().toLocaleDateString() ? (
              <Marker
                key={Math.random()}
                coordinate={{
                  latitude: marker.coordinates.latitude,
                  longitude: marker.coordinates.longitude,
                }}
                title={marker.title}
                pinColor="green"
                onPress={() => handleMarkerPress(marker)}
              >
                <Callout>
                  <View>
                    <Text>{marker.title}</Text>
                    <Text>Address: {marker.details.address}</Text>
                    <Text>Phone: {marker.details.phone}</Text>
                    <Text>Email: {marker.details.email}</Text>
                  </View>
                </Callout>
              </Marker>
            ) : (
              <Marker
                key={Math.random()}
                coordinate={{
                  latitude: marker.coordinates.latitude,
                  longitude: marker.coordinates.longitude,
                }}
                title={marker.title}
                pinColor="red"
                onPress={() => handleMarkerPress(marker)}
              >
                <Callout>
                  <View>
                    <Text>{marker.title}</Text>
                    <Text>Address: {marker.details.address}</Text>
                    <Text>Phone: {marker.details.phone}</Text>
                    <Text>Email: {marker.details.email}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}

        {routeStart ? (
          <MapViewDirections
            origin={{
              latitude: location?.coords?.latitude,
              longitude: location?.coords?.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            destination={{
              latitude: routeDirection.latitude,
              longitude: routeDirection.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            apikey={"AIzaSyDNtMhAj4UVyV4nfS9NV5JC9qBTcFYxgOc"}
            mode="DRIVING"
            lineDashPhase={2}
            splitWaypoints={true}
            strokeWidth={4}
            strokeColor="blue"
            optimizeWaypoints={true}
            tappable={true}
          />
        ) : null}
      </MapView>

      {/* Modal for displaying customer details */}
      <Modal
        visible={markerPress}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedMarker?.title}</Text>

            <Text>Name: {selectedMarker?.details.name}</Text>
            <Text>Address: {selectedMarker?.details.address}</Text>
            <Text>Phone: {selectedMarker?.details.phone}</Text>
            <Text>Email: {selectedMarker?.details.email}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={routeFun}
              style={{
                backgroundColor: "red",
                marginVertical: 20,
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Start route
              </Text>
            </TouchableOpacity>

            <Button
              title="Open Edit Transaction"
              onPress={openEditTransactionModal}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <EditTransactionScreen
          closeModal={closeModal}
          customerDetails={selectedCustomer} // Pass selected customer details
          // updateMarkerStatus={updateMarkerStatus}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default Map;

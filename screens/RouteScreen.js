import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "../contexts/RouteContext";
import Map from "../components/Map";
import * as Location from "expo-location";
import { ScrollView } from "react-native-gesture-handler";
import { Plane, Flow } from "react-native-animated-spinkit";

const RouteScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const {
    markerStatus,
    location,
    setLocation,
    setMarkerStatus,
    orderedClick,
    routesData,
    setRoutesData,
    selectedRoute,
    setSelectedRoute,
    routeName,
    setRouteName,
    admin,
    setAdmin,
  } = useRoute();
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      console.log("Current Location :", currentLocation);
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const driverId = await AsyncStorage.getItem("driverId");
        const response = await axios.get(
          `https://watercan.onrender.com/api/route/${driverId}`
        );
        setLoading(false);
        setRoutesData(response.data.customersByRoute);
      } catch (error) {
        console.log("Error Fetching data :", error);
      }
    };
    setRefresh(false);
    fetchData();
    getPermission();
  }, [orderedClick, refresh]);

  const [routeStart, setRouteStart] = useState(false);

  console.log("Refresh :", refresh);
  const handlePress = async (route, marker, markerStatus, admin) => {
    setRouteStart(false)
    setSelectedRoute(marker);
    setRouteName(route.name);
    setMarkerStatus(markerStatus);
    setAdmin(admin);
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1000);
    await AsyncStorage.setItem("routeId", route._id);
  };
  const renderRouteCard = (route, marker, markerStatus, admin) => {
    return (
      <View key={Math.random()}>
        {route.customers.length !== 0 ? (
          <TouchableOpacity
            key={route._id}
            style={styles.routeCard}
            onPress={() => handlePress(route, marker, markerStatus, admin)}
          >
            <Text style={styles.routeName}>{`${route.name}`}</Text>
            <Text style={styles.routeName}>{`Admin ID :${admin}`}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity key={Math.random()} style={styles.routeCard}>
            <Text style={styles.routeName}>
              Add Customer first to this route
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {routesData.map((e) =>
            renderRouteCard(e.route, e.marker, e.markerStatus, e.admin)
          )}
        </ScrollView>
      ) : (
        <>
          <Text style={styles.loadingText}>Routes Loading, Please wait...</Text>
          <Flow />
        </>
      )}
      {selectedRoute && (
        <View style={styles.container}>
          <Map  routeStart={routeStart} setRouteStart={setRouteStart}/>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 100,
    // justifyContent: 'center', // Center vertically
    // alignItems: 'center', // Center horizontally
    // padding: 16,
    width: "100%",
    // height:"100%",
    // backgroundColor:'red'
  },
  routesSlider: {
    // flex:1,
    // backgroundColor:'red',
    flexDirection: "row",
  },
  routeCard: {
    // width:'40%',
    height: 60,
    marginLeft: 10,
    backgroundColor: "#f5f0e5",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
  },
  routeName: {
    fontSize: 12,
    fontWeight: "bold",
    // color:"white",
  },
});

export default RouteScreen;

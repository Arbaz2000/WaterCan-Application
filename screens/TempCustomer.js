import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
const TempCustomer = () => {
  const [customerName, setCustomerName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [adminOptions, setAdminOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [adminRoutes, setAdminRoutes] = useState();
  const [selectedRoute, setSelectedRoute] = useState();
  const [successAddedCustomer, setSuccessAddedCustomer] = useState(false);
  const [notifyErr, setNotifyErr] = useState(false);
  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    const fetchAdminOptions = async () => {
      try {
        const driverId = await AsyncStorage.getItem("driverId");
        const response = await axios.get(
          `https://watercan.onrender.com/api/get-all-admin-assigned/to/${driverId}`
        );
        setAdminOptions(response.data.users);
      } catch (error) {
        console.error("Error fetching admin options:", error);
      }
    };

    getPermission();
    fetchAdminOptions();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        name: customerName,
        address: address,
        mobileNo: mobileNo,
        email: email,
        location: `${location && location?.coords?.latitude},${
          location && location?.coords?.longitude
        }`,
        route: selectedRoute,
      };
      console.log("payload---", payload);
      console.log("selectedAdmin---", selectedAdmin);
      const response = await axios.post(
        `https://watercan.onrender.com/api/customers/to/${selectedAdmin}`,
        payload
      );

      console.log("response---", response);
      if (response.data.success) {
        console.log("Customer Added ✅");
        setSuccessAddedCustomer(true);
        setTimeout(() => {
          setSuccessAddedCustomer(false);
        }, 3000);
      } else {
        console.log("Customer not added ❌");
      }
    } catch (err) {
      console.log("Error adding customer from mobile :", err.response);
      setNotifyErr(true);
      setTimeout(() => {
        setNotifyErr(false);
      }, 4000);
    }
    // console.log('Form submitted');
  };
  const handleSelectedRoutes = async (admin) => {
    try {
      console.log("ADMIN", admin);
      const response = await axios.post(
        `https://watercan.onrender.com/api/get-route`,
        { userId: admin }
      );
      setAdminRoutes(response.data.routes);
    } catch (err) {
      console.log("Err selecting route", err);
    }
  };

  const renderRoutesItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        setSelectedRoute(item._id);
        setModal2Visible(false);
      }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        setSelectedAdmin(item._id);
        handleSelectedRoutes(item._id);
        setModalVisible(false);
      }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile No"
        value={mobileNo}
        onChangeText={setMobileNo}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text>{`Current Location : ${location && location.coords.latitude},${
        location && location.coords.longitude
      }`}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedAdmin ? `Selected Admin: ${selectedAdmin}` : "Select Admin"}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalView}>
          <FlatList
            data={adminOptions}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal2Visible}
        onRequestClose={() => {
          setModal2Visible(false);
        }}
      >
        <View style={styles.modalView}>
          <FlatList
            data={adminRoutes}
            renderItem={renderRoutesItem}
            keyExtractor={(item) => item._id.toString()}
          />
          <Button title="Close" onPress={() => setModal2Visible(false)} />
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModal2Visible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedRoute ? `Selected Route: ${selectedRoute}` : "Select Route"}
        </Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Add Customer" onPress={handleSubmit} />
      </View>
      {successAddedCustomer && (
        <View style={styles.success}>
          <Text style={styles.successText}>{`${customerName} added ✅`}</Text>
        </View>
      )}
      {notifyErr && (
        <View style={styles.error}>
          <Text
            style={styles.error}
          >{`Customer with ${email} already Existed,try with different Email Id.`}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  success: {
    backgroundColor: "#22ca5d",
    marginTop: 50,

    width: "60%",
    // color:'white'
  },
  error: {
    backgroundColor: "red",
    marginTop: 50,

    width: "60%",
    // color:'white'
  },
  successText: {
    padding: 10,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  dropdownButtonText: {
    color: "#333",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: "40%",
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  buttonContainer: {
    width: "50%",
    marginTop: 20,
  },
});

export default TempCustomer;

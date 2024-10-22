import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

import { Card } from "react-native-paper";
import { useRoute } from "../contexts/RouteContext";

const EditTransactionScreen = ({ closeModal, customerDetails }) => {
  const [products, setProducts] = useState();
  const [productType, setProductType] = useState();
  const [bottlesReceived, setBottlesReceived] = useState("");
  const [bottlesDelivered, setBottlesDelivered] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [combo, setCombo] = useState([]);
  const [showTxnData, setShowTxnData] = useState(false);
  // const [amountPaid, setAmountPaid] = useState('');
  // const [selectedItem, setSelectedItem] = useState('');
  // const [chips, setChips] = useState([]);
  const currentDate = new Date().toLocaleDateString();
  console.log("Details :", customerDetails);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [chips, setChips] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [delieverdAmt, setDelieverdAmt] = useState(0);
  const [dueAmt, setDueAmt] = useState(customerDetails.customer.dueAmt);
  const [bottleReturn, setBottleReturn] = useState(
    customerDetails.customer.bottlesLeft
  );
  const { orderedClick, setOrderedClick } = useRoute();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminId = await AsyncStorage.getItem("adminId");
        const response = await axios.get(
          `https://watercan.onrender.com/api/users/${adminId}/products`
        );

        console.log("Products : ", response.data.products);
        setProducts(response.data.products);
      } catch (err) {
        console.log("Error fetching Product :", err);
      }
    };
    fetchData();
  }, []);
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item.name + "-" + item.price + "-" + item.description);
    setCurrentPrice(parseFloat(item.price));
    setIsDropdownOpen(false);
  };

  const handleAddChip = () => {
    if (selectedItem) {
      setCombo([
        ...combo,
        {
          type: selectedItem,
          bottlesDelivered: bottlesDelivered,
          bottlesReceived: bottlesReceived,
        },
      ]);
      const totalPrice =
        parseFloat(currentPrice) * parseFloat(bottlesDelivered);
      const newDelieverdAmt = delieverdAmt + totalPrice;
      setChips([...chips, selectedItem]);
      setDelieverdAmt(newDelieverdAmt);
      setSelectedItem(""); // Reset the selected item after adding chip
    }
  };

  const handleSave = async () => {
    // Handle saving changes, e.g., send data to backend API
    // You can also update local state or context here
    try {
      setShowTxnData(true);
      const newDueAmt =
        parseFloat(delieverdAmt) + parseFloat(dueAmt) - parseFloat(amountPaid);
      setDueAmt(newDueAmt);
      const driverId = await AsyncStorage.getItem("driverId");
      const adminId = await AsyncStorage.getItem("adminId");

      const payload = {
        customerId: customerDetails.customer._id,
        combo: combo,
        driverId: driverId,
        paymentTaken: amountPaid,
        dueAmount: newDueAmt,
        dateTime: currentDate,
      };
      console.log("Payload---- :", payload);
      const response = await axios.post(
        `https://watercan.onrender.com/api/customers/${customerDetails.customer._id}/due-amount-update`,
        { newDueAmt }
      );
      const txnResponse = await axios.post(
        `https://watercan.onrender.com/api/transaction/${adminId}`,
        payload
      );

      console.log("response---- :", response);
      console.log("txnResponse---- :", txnResponse);

      if (txnResponse.data.success) {
        setOrderedClick(true);

        // updateMarkerStatus(customerDetails.customer._id, new Date());
        console.log("Transaction Successful.");
      } else {
        console.log("Error while transaction");
      }
      if (response.data.success) {
        console.log("due amt updated successfully");
        setDueAmt(response.data.dueAmount);
        setAmountPaid(0);
        setDelieverdAmt(0);
        setBottlesDelivered("");
        setBottlesReceived("");
        // setChips('')
      } else {
        console.log("some err while updating due amount");
      }
      console.log("Save button pressed");
      closeModal(); // Close the modal after saving changes
    } catch (err) {
      setShowTxnData(false);
      console.log("Error while delivery Done : ", err);
    }
  };

  console.log("customerDetails---->", customerDetails);

  return (
    <ScrollView>
      {!showTxnData ? (
        <View style={styles.container}>
          <Text style={styles.title}>Edit Transaction</Text>
          <Card>
            <Card.Title title="Customer Details" />
            <Card.Content>
              <Text style={styles.customerDetails}>
                Customer:{" "}
                {customerDetails ? customerDetails.name : "Customer A"}
              </Text>
              <Text style={styles.customerDetails}>
                Address:{" "}
                {customerDetails
                  ? customerDetails.address
                  : "H Block South Delhi, India"}
              </Text>
              <Text style={styles.customerDetails}>
                Phone: {customerDetails ? customerDetails.phone : "9876543219"}
              </Text>
              <Text style={styles.customerDetails}>
                Email:{" "}
                {customerDetails ? customerDetails.email : "example@gmail.com"}
              </Text>
              <Text style={{ marginBottom: 8 }}>
                Last Delivered:{" "}
                {customerDetails?.customer?.txnDate
                  ? customerDetails?.customer?.txnDate
                  : "-"}
              </Text>

              <Text style={styles.date}>Date: {currentDate}</Text>
              <Text style={[styles.date, { marginVertical: 10 }]}>
                Bottles Left:{" "}
                {customerDetails?.customer?.bottlesLeft
                  ? customerDetails?.customer?.bottlesLeft
                  : "0"}
              </Text>
            </Card.Content>
          </Card>
          <Text style={styles.left}>Select Product Type</Text>

          <TouchableOpacity style={styles.input} onPress={handleToggleDropdown}>
            <Text>{selectedItem || "Select product type"}</Text>
          </TouchableOpacity>

          {isDropdownOpen && (
            <View style={styles.dropdownContainer}>
              {products &&
                products.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <Text>{`${item.name} - ${item.price} - ${item.description}`}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          <Text style={styles.label}>Bottles Received:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bottles Received"
            value={bottlesReceived.toString()}
            onChangeText={setBottlesReceived}
            keyboardType="numeric"
          />
          {/* </View> */}
          {/* <View style={styles.rowContainer}> */}
          <Text style={styles.label}>Bottles Delivered:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bottles Delivered"
            value={bottlesDelivered.toString()}
            onChangeText={setBottlesDelivered}
            keyboardType="numeric"
          />
          {/* </View> */}
          {/* </View> */}
          <View style={styles.buttonContainer}>
            <Button title="Add Combo" onPress={handleAddChip} />
          </View>
          <View style={styles.chipsContainer}>
            {chips.map((chip, index) => (
              <View key={index} style={styles.chip}>
                <Text>{chip}</Text>
              </View>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Amount Recieved"
            value={amountPaid.toString()}
            onChangeText={setAmountPaid}
            keyboardType="numeric"
          />
          <Text>Price :{delieverdAmt}</Text>
          <Text>Last Due Amount :{dueAmt}</Text>
          <Text>
            Total Payable Amount :
            {parseFloat(delieverdAmt) + parseFloat(dueAmt)}
          </Text>
          {/* <Text>Bottles To be Return : {bottleReturn}</Text> */}
          <Text>{`Current Due : ${
            parseFloat(delieverdAmt) +
            parseFloat(dueAmt) -
            parseFloat(amountPaid)
          }`}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Order Delivered"
              color="green"
              onPress={handleSave}
            ></Button>
            <Button title="Cancel" onPress={closeModal} color="red" />
          </View>
        </View>
      ) : (
        <View style={styles.processTxn}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Transaction processing.....</Text>
          {orderedClick ?? <Text>Transaction Successful ✅</Text>}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: 'center',
    backgroundColor: "#fff",
    padding: 20,
  },
  dropdownContainer: {
    position: "absolute",
    top: 350, // Adjust as needed
    left: 20, // Adjust as needed
    width: "100%",
    backgroundColor: "white",
    elevation: 4, // Add elevation for shadow
    zIndex: 1, // Ensure the dropdown appears above other elements
  },
  left: {
    textAlign: "left",
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  customerDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
  processTxn: {
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    width: "100%",
    height: 150,
    maxHeight: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default EditTransactionScreen;

import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
import LogoutScreen from './LogoutScreen';
const Dashboard = () => {
  const navigation = useNavigation();
  const [driver,setDriver]=useState();


  useEffect(() => {
    const getPermission = async()=>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status!=='granted'){
        console.log("Please grant location permissions");
        return;
      }
    }
    const fetchData = async () => {
      try {
        const driverId = await AsyncStorage.getItem('driverId');
        const response = await axios.get(`http://192.168.0.161:9000/api/driver/${driverId}`);
           if (response.data) {
          setDriver(response.data);
          console.log("Driver Data :", response.data);
        } else {
          console.log("some error in else condition of driver fetch");
        }
      } catch (err) {
        console.log("Error from fetching Driver Details :", err);
      }
    };
    getPermission();
    fetchData();
  }, []);
  const navigateToRoutes = () => {
    navigation.navigate('RoutesScreen');
  };

  const navigateToAddCustomer = () => {
    navigation.navigate('AddCustomer');
  };

  return (
    <View style={styles.container}>
      <View style={styles.driverCard}>
        <View>
        <Image source={require('../assets/truck-icon.png')} style={styles.cardImage} />
        </View>
        <View style={styles.driverDetailCard}>
        <Text style={styles.driverCardText}>Driver Name : {driver&&driver.name}</Text>
        <Text style={styles.driverCardText}>Driver ID : {driver&&driver._id}</Text>
        <Text style={styles.driverCardText}>Driver Email ID : {driver&&driver.email}</Text>
        </View>
      </View>
      <View style={styles.containerChild}>
      <TouchableOpacity style={styles.card} onPress={navigateToRoutes}>
        <Image source={require('../assets/routes-icon.png')} style={styles.cardImage} />
        <Text style={styles.cardText}>Routes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={navigateToAddCustomer}>
        <Image source={require('../assets/customer-icon.png')} style={styles.cardImage} />
        <Text style={styles.cardText}>Add Customer</Text>
      </TouchableOpacity>
    </View>
    <LogoutScreen/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
  },
  containerChild:{
    flex:1,
    marginBottom:150,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:"center",
    // backgroundColor:'green'
  },
  driverCard: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 20,
    // flex:1,
    flexDirection:'row',
    borderRadius: 10,
    elevation: 5,
    width: "100%", // Set the width of the card
    // alignItems: 'center',
  },
  driverDetailCard:{
    backgroundColor: 'red',
    margin: 5,
    padding: 5,
    // :'white',
    flexDirection:'column',
    borderRadius: 10,
    elevation: 5,
    width: "78%",
  },
  card: {
    backgroundColor: '#f0f0f0',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: 160, // Set the width of the card
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
  },
  driverCardText: {
    fontSize: 13,
    color:'white'
  },
});

export default Dashboard;

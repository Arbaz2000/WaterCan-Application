import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '../contexts/RouteContext';
const LogoutScreen = ({  }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const { markerStatus,location,setLocation,setMarkerStatus,orderedClick,routesData, setRoutesData, selectedRoute, setSelectedRoute, routeName, setRouteName, admin, setAdmin } = useRoute();
  useEffect(() => {
    // Clear relevant data from AsyncStorage upon component mount (logout)
    // AsyncStorage.removeItem('driverId');
  }, []);

  const handleLogout = async() => {
    // Clear relevant data from AsyncStorage upon button press (logout)
    await AsyncStorage.removeItem('driverId');
    // setLocation('')
    setRoutesData([])
    setSelectedRoute(null)
    // Navigate to the login screen or any other screen after logout
    navigation.replace('Login');
  };

  const handlePress = () => {
    // Open the modal when the button is pressed
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    // Close the modal when the user cancels or confirms logout
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" color="#FF6347" onPress={handlePress} style={styles.btn} />

      {/* Modal */}
      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.text}>Are you sure you want to logout?</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Cancel" color="#FF6347" onPress={handleCloseModal} />
              </View>
              <View style={styles.button}>
                <Button title="Logout" color="#FF6347" onPress={handleLogout} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    width:150,
    // backgroundColor: 'white',
  },
  btn:{
    backgroundColor:"red",
    width:"90%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    // backgroundColor: 'red',
    borderRadius: 5,
    width: '40%',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    // backgroundColor:'red'
  },
});

export default LogoutScreen;

import React, { useEffect, useState } from 'react';
import { View, TextInput,Text, Button, StyleSheet,Image, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import authIcon from '../assets/auth.png'
import authIcon from '../assets/icon.png'
const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);


useEffect(() => {
  getLoginData();
}, [])
  const getLoginData =  async() => {
   let driverID =  await AsyncStorage.getItem('driverId')
   console.log('driverID--' , driverID)
   if(driverID){
    navigation.navigate('Dashboard');
   }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
      <Image
        style={styles.tinyLogo}
        source={authIcon}/>
        <Text style={styles.text}>Water Cans Delivery App</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            setLoading(true); // Set loading to true on form submission
            const payload = {
              email: values.email,
              password: values.password,
            };

            try {
              const res = await axios.post("https://watercan.onrender.com/api/verify-driver", payload);
              if (res.data.success) {
                await AsyncStorage.setItem('driverId', res.data.driver._id);
                setTimeout(() => {
                  setLoading(false); // Set loading to false on successful login
                  navigation.navigate('Dashboard');
                }, 2000);
              } else {
                setLoading(false); // Set loading to false on login error
                console.log("Error in authentication");
              }
            } catch (error) {
              setLoading(false); // Set loading to false on backend error
              console.log("Some error occurred in authentication backend:", error);
            }
          }}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.formContainer}>
              <TextInput
                placeholder="Email"
                onChangeText={handleChange('email')}
                value={values.email}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                value={values.password}
                secureTextEntry
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <View style={styles.button}>
                  <Button title="Login" color="#83CEDF" onPress={handleSubmit} />
                </View>
                <View style={styles.button}>
                  <Button title="Register" color="#1E4D91" onPress={() => navigation.navigate('Register')} />
                </View>
              </View>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor:'white'
  },
  formContainer:{
    // backgroundColor:'red',
    marginBottom:60
  },
  text:{
    fontSize: 20,
    // fontWeight: 'bold',
    color: 'grey',  
  },
  tinyLogo: {
    width: 120,
    height: 120,
    // paddingLeft:59,
  },
  imgContainer:{
    // backgroundColor:'green',
    alignItems:'center',
    paddingTop:50,
    marginBottom:10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#83CEDF',
    padding: 10,
    marginBottom: 10,
    width: 300,
  },
  button: {
    // paddingHorizontal: 40,
    // backgroundColor:'red',
    // paddingLeft:50,
    backgroundColor:'red',
    borderRadius: 5,
    marginHorizontal: 5,
    width:'40%',
    // textTransform: 'none'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
});

export default LoginScreen;


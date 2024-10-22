import React,{useState} from 'react';
import { View,Text, TextInput, Button, StyleSheet,ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const RegisterScreen = ({ navigation }) => {
  const [loading,setLoading] = useState()
  const [notify,setNotify] = useState(false)
  const [notifyErr,setNotifyErr] = useState(false)
  return (
    <View style={styles.container}>
            {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
      <Formik
        initialValues={{ name: '', email: '', address: '', mobileNo: '', password: '', confirmPassword: '' }}
        onSubmit={async(values) => {
          // Handle registration logic here
          console.log(values);
          const payload = {
            name : values.name,
            email : values.email,
            address:values.address,
            mobileNo:values.mobileNo,
            password:values.password
          }
          try{
            const res = await axios.post("https://watercan.onrender.com/api/new-driver",payload)
            await AsyncStorage.setItem('driverId', res.data.driver._id);
            console.log("Driver Response :",res.data)
            setNotify(true);
            setTimeout(() => {
              setNotify(false); // Set loading to false on successful login
              navigation.navigate('Login');
            }, 2000);
          }
          catch(error){
            setNotifyErr(true);
            setTimeout(() => {
              setNotifyErr(false);
            }, 4000);
            console.log("some error occurred :",error)
          }

        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View>
            
            {notifyErr && <View style={styles.success}><Text style={styles.successText}>{`driver With ${values.email} already exists.Try with different email`}</Text></View> }
            {notify && <View style={styles.successRegister}><Text style={styles.successText}>{`${values.email} Registered Successfully ✅`}</Text></View> }

            <TextInput
              placeholder="Name"
              onChangeText={handleChange('name')}
              value={values.name}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              onChangeText={handleChange('email')}
              value={values.email}
              style={styles.input}
            />
            <TextInput
              placeholder="Address"
              onChangeText={handleChange('address')}
              value={values.address}
              style={styles.input}
            />
            <TextInput
              placeholder="Mobile No"
              onChangeText={handleChange('mobileNo')}
              value={values.mobileNo}
              style={styles.input}
              keyboardType="numeric" // This will show numeric keyboard
            />
            <TextInput
              placeholder="Password"
              onChangeText={handleChange('password')}
              value={values.password}
              secureTextEntry
              style={styles.input}
            />
            <TextInput
              placeholder="Confirm Password"
              onChangeText={handleChange('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
            <View style={styles.button}>
                  <Button title="Register" color="#1E4D91" onPress={handleSubmit} />
                </View>
                <View style={styles.button}>
                  <Button title="Back to Login" color="#83CEDF" onPress={() => navigation.navigate('Login')} />
                </View>

            </View>
          </View>
        )}
      </Formik>)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  success:{
    backgroundColor:'red',
    marginBottom:50,
    
    width:"60%"
    // color:'white'
  },
  successRegister:{
    backgroundColor:'#22ca5d',
    marginBottom:50,
    
    width:"60%"
    // color:'white'
  },
  successText:{
    padding:10,
    color:'white'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
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
    // backgroundColor:'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '100%',
    
    // paddingHorizontal: 20,
  },
});

export default RegisterScreen;

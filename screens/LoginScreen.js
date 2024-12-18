// import React, { useEffect, useState } from 'react';
// import { View, TextInput,Text, Button, StyleSheet,Image, ActivityIndicator } from 'react-native';
// import { Formik } from 'formik';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // import authIcon from '../assets/auth.png'
// import authIcon from '../assets/icon.png'
// const LoginScreen = ({ navigation }) => {
//   const [loading, setLoading] = useState(false);


// useEffect(() => {
//   getLoginData();
// }, [])
//   const getLoginData =  async() => {
//    let driverID =  await AsyncStorage.getItem('driverId')
//    console.log('driverID--' , driverID)
//    if(driverID){
//     navigation.navigate('Dashboard');
//    }
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.imgContainer}>
//       <Image
//         style={styles.tinyLogo}
//         source={authIcon}/>
//         <Text style={styles.text}>Water Cans Delivery App</Text>
//       </View>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <Formik
//           initialValues={{ email: '', password: '' }}
//           onSubmit={async (values) => {
//             setLoading(true);
//             const payload = {
//               email: values.email,
//               password: values.password,
//             };
//             console.log("payload", payload)
//             try {
//               const res = await axios.post("http://localhost:9000/api/verify-driver", payload);
//               console.log("response -------- driver login", res)
//               if (res.data.success) {
//                 await AsyncStorage.setItem('driverId', res.data.driver._id);
//                 setTimeout(() => {
//                   setLoading(false); // Set loading to false on successful login
//                   navigation.navigate('Dashboard');
//                 }, 2000);
//               } else {
//                 setLoading(false); // Set loading to false on login error
//                 navigation.navigate('Dashboard');
//                 console.log("Error in authentication");
//               }
//             } catch (error) {
//               setLoading(false); // Set loading to false on backend error
//               navigation.navigate('Dashboard');
//               console.log("Some error occurred in authentication backend:", error);
//             }
//           }}
//         >
//           {({ handleChange, handleSubmit, values }) => (
//             <View style={styles.formContainer}>
//               <TextInput
//                 placeholder="Email"
//                 onChangeText={handleChange('email')}
//                 value={values.email}
//                 style={styles.input}
//               />
//               <TextInput
//                 placeholder="Password"
//                 onChangeText={handleChange('password')}
//                 value={values.password}
//                 secureTextEntry
//                 style={styles.input}
//               />
//               <View style={styles.buttonContainer}>
//                 <View style={styles.button}>
//                   <Button title="Login" color="#83CEDF" onPress={handleSubmit} />
//                 </View>
//                 <View style={styles.button}>
//                   <Button title="Register" color="#1E4D91" onPress={() => navigation.navigate('Register')} />
//                 </View>
//               </View>
//             </View>
//           )}
//         </Formik>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor:'white'
//   },
//   formContainer:{
//     // backgroundColor:'red',
//     marginBottom:60,
//     justifyContent:'center',
//     alignItems:'center'
//   },
//   text:{
//     fontSize: 20,
//     // fontWeight: 'bold',
//     color: 'grey',  
//   },
//   tinyLogo: {
//     width: 120,
//     height: 120,
//     // paddingLeft:59,
//   },
//   imgContainer:{
//     // backgroundColor:'green',
//     alignItems:'center',
//     paddingTop:50,
//     marginBottom:10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#83CEDF',
//     padding: 10,
//     marginBottom: 10,
//     width: 300,
//   },
//   button: {
//     // paddingHorizontal: 40,
//     // backgroundColor:'red',
//     // paddingLeft:50,
//     backgroundColor:'red',
//     borderRadius: 5,
//     marginHorizontal: 5,
//     width:'40%',
//     // textTransform: 'none'
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 30,
//   },
// });

// export default LoginScreen;



import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authIcon from '../assets/icon.png';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getLoginData();
    // const checkLogin = async () => {
    //   const myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");

    //   const raw = JSON.stringify({
    //     "email": "Shubhamsen@gmail.com",
    //     "password": "qwerty12"
    //   });

    //   const requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: "follow"
    //   };

    //   fetch("http://192.168.0.161:9000/api/verify-driver", requestOptions)
    //     .then((response) => response.text())
    //     .then((result) => console.log(result))
    //     .catch((error) => console.error(error));
    // }
    // checkLogin()
  }, []);

  const getLoginData = async () => {
    let driverID = await AsyncStorage.getItem('driverId');
    console.log('driverID--', driverID);
    if (driverID) {
      navigation.navigate('Dashboard');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image style={styles.tinyLogo} source={authIcon} />
        <Text style={styles.text}>Water Cans Delivery App</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            setLoading(true);
            const payload = {
              email: values.email,
              password: values.password,
            };
            console.log("payload", payload)
            // try {
            //   const res = await axios.post("http://192.168.0.161:9000/api/verify-driver", payload);
            //   console.log("respone", res)
            //   if (res.data.success) {
            //     await AsyncStorage.setItem('driverId', res.data.driver._id);
            //     setTimeout(() => {
            //       setLoading(false); // Set loading to false on successful login
            //       navigation.navigate('Dashboard');
            //     }, 2000);
            //   } else {
            //     setLoading(false); // Set loading to false on login error
            //     navigation.navigate('Dashboard');
            //     console.log("Error in authentication");
            //   }
            // } catch (error) {
            //   setLoading(false); // Set loading to false on backend error
            //   navigation.navigate('Dashboard');
            //   console.log("Some error occurred in authentication backend:", error);
            // }
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            // const raw = JSON.stringify({
            //   "email": "Shubhamsen@gmail.com",
            //   "password": "qwerty12"
            // });

            const requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: JSON.stringify(payload),
              redirect: "follow"
            };

            fetch("http://192.168.0.161:9000/api/verify-driver", requestOptions)
              .then((response) => response.json())
              .then((result) => {
                console.log("result------>", result)
                AsyncStorage.setItem('driverId', result.driver._id);
                AsyncStorage.getItem('driverId').then((driverID) => {
                  console.log('driverID--', driverID);
                  navigation.navigate('Dashboard') 
                });
               
              })
              .catch((error) => console.error(error));
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
    backgroundColor: 'white',
  },
  formContainer: {
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'grey',
  },
  tinyLogo: {
    width: 120,
    height: 120,
  },
  imgContainer: {
    alignItems: 'center',
    paddingTop: 50,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#83CEDF',
    padding: 10,
    marginBottom: 10,
    width: 300,
  },
  button: {
    borderRadius: 5,
    marginHorizontal: 5,
    width: '40%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
  },
});

export default LoginScreen;


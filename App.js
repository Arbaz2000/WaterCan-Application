import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./screens/AuthNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "./screens/Dashboard";
import RouteScreen from "./screens/RouteScreen";
import Map from "./components/Map";
import MapScreen from "./screens/MapScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import TempCustomer from "./screens/TempCustomer";
import {RouteProvider} from "./contexts/RouteContext";
import LogoutScreen from "./screens/LogoutScreen";
// import * as Location from 'expo-location'
const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
    {/* <AuthNavigator /> */}
    <RouteProvider>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} 
      options={{
          headerShown: false, 
        }}/>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerLeft: null }}
      />
      <Stack.Screen name="RoutesScreen" component={RouteScreen} />
      <Stack.Screen name="AddCustomer" component={TempCustomer} />
    </Stack.Navigator>
    </RouteProvider>
  </NavigationContainer>

  );
};

export default App;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Map from '../components/Map';
import { useRoute } from '../contexts/RouteContext';

const MapScreen = () => {
  const {       
    orderedClick,
    routeName,//name
} = useRoute()
  return (
    <View style={styles.container}>
      <Text style={styles.routeText}>{routeName}</Text>
      {/* <Map markers={marker} admin={admin}/> */}
      <Text >{orderedClick?1:0}</Text>
      <Map />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position:'absolute',
    flex: 1,
    width:"100%",
    // zIndex:1
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 40,
    textAlign: 'center',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;

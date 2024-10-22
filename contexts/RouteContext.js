import React, { createContext, useState, useContext } from 'react';

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [routesData, setRoutesData] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeName, setRouteName] = useState();
  const [admin, setAdmin] = useState();
  const [markerColor,setMarkerColor] = useState('red')
  const [orderedClick,setOrderedClick] = useState(false)
  const [markerStatus,setMarkerStatus] = useState([])
  const [location,setLocation] = useState();
  const [toggle,setToggle] = useState(false)
  return (
    <RouteContext.Provider
      value={{
        orderedClick,setOrderedClick,
        markerColor,setMarkerColor,
        routesData,
        setRoutesData,
        selectedRoute,
        setSelectedRoute,
        routeName,
        setRouteName,
        admin,
        setAdmin,
        markerStatus,setMarkerStatus,
        toggle,setToggle,
        location,setLocation
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};

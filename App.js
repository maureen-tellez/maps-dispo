import { useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import Mapview, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    getLocation()
  },[])

  async function getLocation(){
    try {
      setLoading(true)
      setError(null)

      let {status} = await Location.requestForegroundPermissionsAsync()
      if (status != 'granted') {
        setError('Permiso de ubicación denegado')
        setLoading(false)
        return 
      }

      let lastKnown = await Location.getLastKnownPositionAsync({})
      if (lastKnown) {
        setLocation(lastKnown.coords)
        setLoading(false)
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        maximumAge: 10000,
      })
      setLocation(currentLocation.coords)
      setLoading(false)
    } catch (err) {
      console.log('Error:',err)
      setError(err.message)
      setLoading(false)

    }
  }

    if (loading) {
      return (
        <View style={styles.centerContainer}> 
          <Text style={styles.loadingText}>📍 Obteniendo ubicación... </Text>

        </View>
      )
    }

    if (error || !location) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>❌ {error || 'Error desconocido'}</Text>
          <TouchableOpacity style={styles.button} onPress={getLocation}>
            <Text style={styles.buttonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )
    }
  
  return (
    <View style={styles.container}>
      <Mapview
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
          title='Tu Ubicación'
          description={`Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}`}
          pinColor='red'
        />
      </Mapview>
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📍 Tu ubicación</Text>
        <Text style={styles.infoText}>Lat: {location.latitude.toFixed(6)}</Text>
        <Text style={styles.infoText}>Long: {location.longitude.toFixed(6)}</Text>
      </View>
       <TouchableOpacity style={styles.refreshButton} onPress={getLocation}>
          <Text style={styles.buttonText}>🔄️ Actualizar</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centerContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20,
    backgroundColor: '#e3e1e1ff'
  },
  map:{
    flex:1
  },
  loadingText:{
    fontSize: 18,
    color: '#333',
    fontWeight:'600'
  },
  errorText:{
    fontSize:16,
    color: "#e74c3c",
    textAlign:'center',
    marginBottom:20
  },
  infoContainer:{
    position:'absolute',
    top:60,
    left:20,
    right:20,
    backgroundColor:'white',
    padding:15,
    borderRadius:12,
    shadowColor: "#000",
    shadowOffser: {width:0, height:2},
    shadowOpacity:0.25,
    shadowRadius:3.84,
    elevation:5
  },
  infoTitle:{
    color:"#1152c3ff",
    fontSize:18,
  },
  infoText:{
    fontSize:17,
    color:"#000000",
    fontWeight: 600
  },
    refreshButton:{
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: '#b4dbffff',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
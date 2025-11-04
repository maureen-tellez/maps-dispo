import { useState, useEffect, use } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Alert } from 'react-native';
import MapView, {Maker} from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location,setLocation] = useState(null)
  const [loading,setLoading]= useState(null)
  const [error,setError]=useState(null)

  useEffect(()=>{
    getLocation()
  }, [])

  async function getLocation(){
    try{
      setLoading(true)
      setError(null)

      let {status} = await Location.requestBackgroundPermissionsAsync()
      if(status !== 'granted'){
        setError('Permiso de ubicación negado')
        setLoading(false)
        return
      }
    } catch(error){
      
    }
  } 


  return(
    <>
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
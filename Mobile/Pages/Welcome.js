import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import logo from './Images/Foodio.png';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Welcome() {

  async function TokenLogin(){
    const value = await AsyncStorage.getItem('token');
    if (value !== null){
      navigation.navigate('UserStack');
      console.log("Conectado");
    }else{
      console.log('Está desconectado');
    }
  }

  TokenLogin();



  const navigation = useNavigation();
  return (
    <Animatable.View animation='fadeInUp' style={styles.container}>
        <Image source={logo} style={styles.logoimg}/>
          <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Login')}>
            <Text style={styles.Textbutton}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={ () => navigation.navigate('Register')}>
            <Text style={styles.Textbutton}>Register</Text>
          </TouchableOpacity>
          <StatusBar style='auto' />
    </Animatable.View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logoimg:{
    top: '30%',
  },
  Textbutton:{
    fontSize: 25,
    color: '#535955'
  },
  button:{
    top: '60%',
    margin: 20,
    width: 265,
    height: 70,
    borderRadius: 106,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

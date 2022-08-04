import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Keyboard,
    StyleSheet,
    KeyboardAvoidingView,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import logo from './Images/Foodio.png';

export default function Register() {
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Animatable.View animation='fadeInUp' style={styles.container}>
        <Image source={logo} style={styles.logoimg}/>
            <View style={styles.formBg}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder='Username'/>
            <TextInput style={styles.input} placeholder='E-mail'/>
            <TextInput style={styles.input} placeholder='Password' secureTextEntry={true}/>
            <TextInput style={styles.input} placeholder='Confirm Password' secureTextEntry={true}/>
            <TouchableOpacity style={styles.RegButton}>
                <Text style={styles.RegText}>Register</Text>
            </TouchableOpacity>
                <StatusBar style='auto' />
            
        </View> 
    </Animatable.View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  logoimg:{
    top: '20%',
  },
  title:{
    fontWeight: '700',
    top: '5%',
    lineHeight: 58,
    fontSize: 48,
    color: 'black',
  },
  formBg: {
    top: '25%',
    borderRadius: 54,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  input:{
    color: '#BDBDBD',
    top: '7%',
    width: '80%',
    height: 50,
    padding: '2%',
    margin: '2%',
    backgroundColor: '#EDEDED',
    borderRadius: 12,
  },
  RegButton:{
    backgroundColor: '#A0E2AF',
    width: '60%',
    height: 55,
    top: '11%',
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RegText:{
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
  }
});
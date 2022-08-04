import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {
    Keyboard,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import logo from './Images/Foodio.png';
import google from './Images/google.png';
import facebook from './Images/facebook.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({navigation}) {

    const [display, setDisplay]=useState('none') //Seta erro sem display ao entrar
    const [user, setUser]=useState(null)
    const [password, setPassword]=useState(null)
    const [token, setToken]=useState(null)

    //Envio Form de Login
    async function sendForm(){
      let response= await fetch('http://192.168.0.108:3000/login',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: user,
          password: password
        })
      });
      let json=await response.json();
      if(json === 'error'){
        setDisplay('flex');
        setTimeout(()=>{
          setDisplay('none');
        },5000);
        await AsyncStorage.clear();
      }else{
        await AsyncStorage.setItem('token', user)
        let userData = await AsyncStorage.setItem('userData', JSON.stringify(json));
        let resData=await AsyncStorage.getItem('userData');
        console.log(JSON.parse(resData));
        navigation.navigate('HomeStack');
      };
    }


    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Animatable.View animation='fadeInUp' style={styles.container}>
            <Image source={logo} style={styles.logoimg}/>
            
            

          <View style={styles.formBg}>
            <View style={styles.forms}>
              <Text style={styles.title}>Log-in</Text>
              
              <TextInput style={styles.input} placeholder='Username' onChangeText={text=>setUser(text)}/>

              <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={text=>setPassword(text)}/>

              <TouchableOpacity style={styles.forgot}>
                <Text style={styles.forgotTxt}>Forgot Password?</Text>
              </TouchableOpacity>
            
              <View>
                <Text style={styles.erroLoginTxt(display)}>Login ou Senha Incorretos</Text>
              </View>

              <TouchableOpacity style={styles.LogButton} onPress={() =>sendForm()}>
                  <Text style={styles.LogText}>Login</Text>
              </TouchableOpacity>
                      
              <View style={styles.OtherButton}>
                <TouchableOpacity style={styles.googleButton}>
                  <Image source={google} style={styles.googleimg}/>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.facebookButton}>
                  <Image source={facebook} style={styles.facebookimg}/>
                </TouchableOpacity>
              
              </View>

            </View>
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
    left: '-20%',
    lineHeight: 58,
    fontSize: 48,
    color: 'black',
    marginBottom: 10,
  },
  formBg: {
    flex: 1,
    top: '25%',
    borderRadius: 54,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  forms: {
    top: '5%',
    flex: 1,
    borderRadius: 54,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input:{
    color: '#BDBDBD',
    width: '80%',
    height: 60,
    paddingLeft: 20,
    margin: '3%',
    backgroundColor: '#EDEDED',
    borderRadius: 18,
  },
  forgot:{
    left: '-20%',
    marginBottom: 10,
  },
  forgotTxt:{
    fontSize: 16,
    color: '#808080',
    fontWeight: '500',
  },
  erroLoginTxt:(text = 'none')=>({
    color: 'red',
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '500',
    display: text
  }),
  LogButton:{
    backgroundColor: '#A0E2AF',
    width: '60%',
    height: 60,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogText:{
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
  },
  OtherButton:{
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleButton:{
    marginHorizontal: 10,
  },
  googleimg:{
    width: 40,
    height: 40,
  },
  facebookButton:{
    marginHorizontal: 10,
  },
  facebookimg:{
    width: 50,
    height: 50,
  }
});
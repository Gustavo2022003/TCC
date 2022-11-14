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
import logo from './Images/logo.png';
import google from './Images/google.png';
import facebook from './Images/facebook.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as yup from 'yup';

import AlertCustom from '../components/Alert';

export default function Login({navigation}) {
    const userInfo = {username: '', password: ''}
    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [token, setToken]=useState(null)

    //Envio Form de Login
    async function sendForm(values){
      let response= await fetch('http://192.168.0.108:3000/login',{
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: values.username,
          password: values.password
        })
      });
      let json=await response.json();
      if(json === 'error'){
        setVisibleAlert(true);
        setAlertTitle('Erro ao fazer login')
        setAlertMessage('O úsuario e/ou senha estão incorretos')
        await AsyncStorage.clear();
      }else{
        await AsyncStorage.setItem('token', values.username)
        let userData = await AsyncStorage.setItem('userData', JSON.stringify(json));
        let resData=await AsyncStorage.getItem('userData');
        console.log(JSON.parse(resData));
        navigation.navigate('UserStack');
      };
    }

    const LoginSchema = yup.object().shape({
      username: yup.string().trim().required('Username is Required'),
      password: yup.string().trim().required('Password is Required'),
    });

    return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Animatable.View animation='fadeInUp' style={styles.container}>
    <AlertCustom 
      visible={visibleAlert}
      title = {alertTitle}
      message = {alertMessage}
      positiveButton={() => setVisibleAlert(false)}
      />
            <Image source={logo} style={styles.logoimg}/>
            
            

          <View style={styles.formBg}>
            <View style={styles.forms}>
              <Text style={styles.title}>Log-in</Text>
              <Formik
              initialValues={userInfo}
              onSubmit={sendForm}
              validationSchema={LoginSchema}
              >
              {({handleSubmit, errors,touched, handleChange, handleBlur, values})=> {
                const{username,password} = values
                return (
                  <>
              <TextInput style={styles.input} placeholder='Username' value={username} onBlur={handleBlur('username')} onChangeText={handleChange('username')}/>
              {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}
              <TextInput style={styles.input} placeholder='Password' value={password} onBlur={handleBlur('password')} secureTextEntry={true} onChangeText={handleChange('password')}/>
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
              <TouchableOpacity style={styles.forgot}>
                <Text style={styles.forgotTxt}>Forgot Password?</Text>
              </TouchableOpacity>

              {errors.fullname || errors.username || errors.email || errors.password || errors.confirmPassword ?
              <TouchableOpacity style={styles.LogButtonInvalid} disabled={!Formik.isValid}>
                <Text style={styles.LogTextInvalid}>Login</Text> 
              </TouchableOpacity>
              : 
              <TouchableOpacity style={styles.LogButton} onPress={handleSubmit} disabled={!LoginSchema.isValid}>
                <Text style={styles.LogText}>Login</Text> 
              </TouchableOpacity>}
                      
              <View style={styles.OtherButton}>
                <TouchableOpacity style={styles.googleButton}>
                  <Image source={google} style={styles.googleimg}/>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.facebookButton}>
                  <Image source={facebook} style={styles.facebookimg}/>
                </TouchableOpacity>
              </View>
              </>
              )}} 
              </Formik>
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
    width: 360,
    height: 110,
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
  error:{
    alignSelf: 'flex-start',
    marginTop: '-2%',
    paddingBottom: 10,
    color: 'red',
    fontWeight: '700',
    marginLeft: '14%',
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
  LogButton:{
    backgroundColor: '#A0E2AF',
    width: '60%',
    height: 60,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogButtonInvalid:{
    backgroundColor: '#eaeaea',
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
  LogTextInvalid:{
    fontSize: 26,
    fontWeight: '700',
    color: '#999999',
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
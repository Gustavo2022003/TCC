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
import { ScrollView } from 'react-native-gesture-handler';
import logo from './Images/Foodio.png';
import { Formik } from 'formik';
import * as yup from 'yup';

import AlertCustom from '../components/Alert';

export default function Register() {
  const UserInfo = {fullname: '', username:'', email: '', password: '', confirmPassword:'' }
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  //Validation E-mail
  const navigation = useNavigation();

  // Function to Register
  async function sendFormRegister(values,{resetForm}){
    let response= await fetch('http://192.168.0.108:3000/register',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fullname: values.fullname,
        username: values.username,
        email: values.email,
        password: values.password,
      })
    });
    let json=await response.json();
    
    if(json == 'Registered'){
      setVisibleAlert(true);
      setAlertTitle('Úsuario cadastrado')
      setAlertMessage('O Úsuario foi cadastrado com sucesso!')
      console.log(visibleAlert);
      console.log('Úsario Disponivel')
    }else if(json == 'UserError'){
      setVisibleAlert(true);
      setAlertTitle('Erro ao cadastrar úsuario')
      setAlertMessage('Erro ao cadastrar úsuario, pois esse username já foi cadastrado, utilize outro username')
      console.log('Usuario com esse username já foi Cadastrado')
    }else{
      setVisibleAlert(true);
      setAlertTitle('Erro ao cadastrar úsuario')
      setAlertMessage('Erro ao cadastrar úsuario, pois esse email já foi cadastrado, utilize outro email')
      console.log('Usuario com esse email já foi Cadastrado')
    }
    resetForm({values: ''})
  }

  const registerSchema = yup.object().shape({
    fullname: yup.string().trim().min(3, 'Invalid Name').required('Full Name is Required'),
    username: yup.string().trim().min(3, 'Username too short!').required('Username is Required'),
    email: yup.string().email('Invalid email').required('Email is Required'),
    password: yup.string().trim().min(8,'Password is too short!').required('Password is Required'),
    confirmPassword: yup.string().equals([yup.ref('password'),null], 'Password does not match!').required('Password confirmation is Required')
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
      positiveButton={() => [setVisibleAlert(false), navigation.replace('Login')]}
      />
              <View style={styles.logo}>
              <Image source={logo} style={styles.logoimg}/>
              </View>
              <View style={styles.formBg}>
                  <View style={styles.forms}>
                    <Text style={styles.title}>Register</Text>
                      <ScrollView style={{width: '100%'}}>
                        <View style={styles.bottom}>
                        <Formik
                          initialValues={UserInfo}
                          onSubmit={sendFormRegister}
                          validationSchema={registerSchema}
                          >
                          {({handleSubmit, errors,touched, handleChange, handleBlur, values})=> {
                            const{fullname, username, email, password,confirmPassword} = values
                          return (
                          <>
                          <TextInput style={styles.input} placeholder='Full name' value={fullname} onBlur={handleBlur('fullname')} onChangeText={handleChange('fullname')}/>
                          {touched.fullname && errors.fullname && <Text style={styles.error}>{errors.fullname}</Text>}

                          <TextInput style={styles.input} placeholder='Username' value={username} onBlur={handleBlur('username')} onChangeText={handleChange('username')}/>
                          {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

                          <TextInput style={styles.input} placeholder='E-mail' value={email} onBlur={handleBlur('email')} onChangeText={handleChange('email')}/>
                          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                          <TextInput style={styles.input} placeholder='Password' value={password} onBlur={handleBlur('password')} secureTextEntry={true} onChangeText={handleChange('password')}/>
                          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                          
                          <TextInput style={styles.input} placeholder='Confirm Password' value={confirmPassword} onBlur={handleBlur('confirmPassword')} secureTextEntry={true} onChangeText={handleChange('confirmPassword')}/>
                          {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                          {errors.fullname || errors.username || errors.email || errors.password || errors.confirmPassword ?
                          <TouchableOpacity style={styles.RegButtonInvalid} disabled={!Formik.isValid}>
                              <Text style={styles.RegTextInvalid}>Register</Text> 
                          </TouchableOpacity>
                          : <TouchableOpacity style={styles.RegButton} onPress={handleSubmit} disabled={!registerSchema.isValid}>
                              <Text style={styles.RegText}>Register</Text> 
                            </TouchableOpacity>}
                          </>
                          )}} 
                        </Formik>
                        </View>
                      </ScrollView> 
                  </View>
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
  logo:{
    marginTop:'45%',
    marginBottom: '15%'
  },
  bottom:{
    marginBottom: '25%'
  },
  title:{
    marginLeft: '15%',
    marginBottom: '3%',
    fontWeight: '700',
    lineHeight: 58,
    fontSize: 48,
    color: 'black',
  },
  formBg: {
    flex:1,
    borderTopLeftRadius: 54,
    borderTopRightRadius: 54,
    width: '100%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  forms: {
    flex: 1,
    top: '5%',
    borderRadius: 54,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  input:{
    alignSelf:'center',
    color: '#BDBDBD',
    width: '80%',
    height: 60,
    paddingLeft: 20,
    margin: '3%',
    backgroundColor: '#EDEDED',
    borderRadius: 18,
  },
  error:{
    marginTop: '-3%',
    paddingBottom: 10,
    color: 'red',
    fontWeight: '700',
    marginLeft: '14%',
  },
  RegButton:{
    marginTop: '3%',
    alignSelf:'center',
    backgroundColor: '#A0E2AF',
    width: '60%',
    height: 55,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RegButtonInvalid:{
    marginTop: '3%',
    alignSelf:'center',
    backgroundColor: '#eaeaea',
    width: '60%',
    height: 55,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RegText:{
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
  },
  RegTextInvalid:{
    fontSize: 26,
    fontWeight: '700',
    color: '#999999',
  }
});
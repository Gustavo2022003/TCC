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

export default function Register() {

  const [name, setName]=useState(null)
  const [username, setUser]=useState(null)
  const [email, setEmail]=useState('');
  const [emailValidError, setEmailValidError] = useState('');
  const [password, setPassword]=useState(null)
  const [confirmPassword, setConfirmPassword]=useState(null)

  //Validation E-mail
  const handleValidEmail = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    
        if (val.length === 0) {
          setEmailValidError('Insira um endereço de email');
        } else if (reg.test(val) === false) {
          setEmailValidError('Digite um endereço de email valido!');
        } else if (reg.test(val) === true) {
          setEmailValidError('');
        }
    };
    



  // Function to Register
  async function sendFormRegister(){
    let response= await fetch('http://192.168.0.108:3000/register',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usernamename: username,
        password: password
      })
    });
    let json=await response.json();
    if(json === 'error'){
      console.log('Ocorreu um Erro')
    }else{
      console.log('Usuario Cadastrado')
    };
  }



    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Animatable.View animation='fadeInUp' style={styles.container}>
        <View style={styles.logo}>
        <Image source={logo} style={styles.logoimg}/>
        </View>
        <View style={styles.formBg}>
            <View style={styles.forms}>
            <Text style={styles.title}>Register</Text>
              <ScrollView style={{width: '100%'}}>
                <View style={styles.bottom}>
                <TextInput style={styles.input} placeholder='Full name' onChangeText={text=>setName(text)}/>
                <TextInput style={styles.input} placeholder='Username' onChangeText={text=>setUser(text)}/>
                <TextInput style={styles.input} placeholder='E-mail' value={email} onChangeText={value => {setEmail(value); handleValidEmail(value);}}/>
                <View>
                  {emailValidError ? <Text style={styles.invalidEmail}>{emailValidError}</Text> : null}
                </View>
                <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={text=>setUser(text)}/>
                <TextInput style={styles.input} placeholder='Confirm Password' secureTextEntry={true} onChangeText={text=>setUser(text)}/>
                <TouchableOpacity style={styles.RegButton}>
                    <Text style={styles.RegText}>Register</Text>
                </TouchableOpacity>
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
  invalidEmail:{
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
  RegText:{
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
  }
});
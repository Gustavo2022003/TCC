import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export default function Profile({navigation}) {

    const [user,setUser]=useState(null);
    const [picture, setPicture]=useState(null);
    
    //Picker



    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.username);
        }
        getUser();
    },[]);

    async function Logout(){
        await AsyncStorage.removeItem('token')
        navigation.navigate('Welcome');
    }

        async function GetProfile(){
        let response= await fetch('http://192.168.0.108:3000/getProfilePicture',{
            method: 'POST',
            body: {
                userId: user,
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.text();
        console.log(json);
        setPicture(json);
    }

    const openImagePickerAsync = async () => {
      
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (!pickerResult.cancelled) {
            let uploadResult = await FileSystem.uploadAsync('http://192.168.0.108:3000/uploadProfilePicture', pickerResult.uri, {
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'avatar',
                parameters: {
                    'uri': toString(pickerResult.uri),
                    'user': toString(user)
                }
            });            
        }
        console.log(pickerResult.uri)
      }
    




    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <TouchableOpacity onPress={openImagePickerAsync}><Text>Alterar Foto</Text></TouchableOpacity>
            <Image/>
            <Text>Tela de Perfil</Text>
            <TouchableOpacity style={styles.LogoutButton} onPress={Logout}>
                <Text>Sair</Text>
            </TouchableOpacity>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    alignItems: 'center',
    justifyContent: 'center'
},
LogoutButton:{
    margin: 20,
    width: 90,
    height:40,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#FFFFFF'
}

});
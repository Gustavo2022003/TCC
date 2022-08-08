import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


export default function Profile({navigation}) {
    
    const [user,setUser]= useState(null);
    const [picture, setPicture]=useState(null);
    //Picker

    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.id);
        }
        getUser();
    },[]);
    
    async function Logout(){
        await AsyncStorage.removeItem('token')
        navigation.navigate('Welcome');
    }

    
        async function GetProfile(){
            // Forçar pegar para enviar para a rota
            let getuser = await AsyncStorage.getItem('userData');
            let user = JSON.parse(getuser);
            let response= await fetch('http://192.168.0.108:3000/getAvatar/'+user.id,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            let json=await response.json();
            let idImage = JSON.stringify(json)
            //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
            let newImage = idImage.slice(20,67)
            console.log("Antes: "+idImage)
            console.log("Depois:"+newImage)
            let strPicture = newImage.toString()
            //setPicture(strPicture)
            console.log('meu setPicture:'+strPicture)
            /*let picturePath = '../../'
            let finalPath = picturePath.concat(strPicture)
            let finalfinalpath = toString(finalPath);
            setPicture(finalfinalpath)*/
        }
    useEffect(()=>{
        GetProfile();
    },[]);
    

    const openImagePickerAsync = async () => {
    
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        console.log(pickerResult)
        if (!pickerResult.cancelled) {
            let uploadResult = await FileSystem.uploadAsync('http://192.168.0.108:3000/uploadPicture/'+user, pickerResult.uri, {
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                fieldName: 'avatar',
            });     
        setPicture(pickerResult.uri)
        }
    }
    
    
   
    //source={require('../../'+picture)}

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <TouchableOpacity><Text>{picture}</Text></TouchableOpacity>
            <TouchableOpacity onPress={openImagePickerAsync}><Text>Alterar Foto do {user}</Text></TouchableOpacity>
            <Image style={styles.avatar}/>
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
},
avatar: {
    width: 200,
    height:200
}

});
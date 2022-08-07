import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ImagePickerExample() {
  
  const [user,setUser]=useState(null);
  useEffect(()=>{
    async function getUser(){
        let response = await AsyncStorage.getItem('userData');
        let json=JSON.parse(response);
        setUser(json.username);
    }
    getUser();
  },[]);

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      const uploadResult = await FileSystem.uploadAsync('http://192.168.0.108:3000/uploadProfilePicture', pickerResult.uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'avatar',
        body: JSON.stringify({
          name: user
        })
      })
    }
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text>{user}</Text>
      <Button title="Pick an image from camera roll" onPress={openImagePickerAsync} />
    </View>
  );
}
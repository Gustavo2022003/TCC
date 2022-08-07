import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {

    try{
    const formdata = new FormData()
    formdata.append('Picture',{
        uri: result.uri,
        type: result.type,
        
    });
    let res = await fetch('http://192.168.0.108:3000/upload',{
        method: 'POST',
        body: JSON.stringify({formdata}),
    });
    let ResponseJson = await res.json();
    console.log(ResponseJson, "ResponseJson")
    }
    catch(e){
        console.log(e);
    }
}else{
    console.log('cancelou')
}




  };

  return (
    <View style={{ lignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Image style={{ width: 200, height: 200 }} />
    </View>
  );
}
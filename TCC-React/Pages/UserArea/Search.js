import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';


export default function Search({route,navigation}) {
    const [disable, setDisable] = useState(false);
    const [formDataState, setFormData] = useState(null);
    const RecipeInfo = {recipename: '', category: '', ModoPreparo: ''};
    
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
        wait(1000).then(() => setDisable(false));
    }
     
    //WAIT  
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }   

    useEffect(()=>{
        setDisable(false);
    },[route, navigation])

    const openImagePickerAsync = async () => {
    
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({allowsEditing: true,});
        
        if (!pickerResult.cancelled) {
            // ImagePicker saves the taken photo to disk and returns a local URI to it
                let localUri = pickerResult.uri;
                let filename = localUri.split('/').pop();

            // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs
                let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
                formData.append('photo', { uri: localUri, name: filename, type });
                
                //Send to the back-end
                let response = await axios.post('http://192.168.0.108:3000/uploadImg', formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    }
                })
                .catch(function (error) {
                    console.log(error.toJSON());
                });
                //Return and set the name of Image
                let json = await response.data;
                setFormData(json);
        }
    }


    const recipeSchema = yup.object().shape({
        recipename: yup.string().trim().min(3, 'Recipe name too short!').required("Recipe name is necessary!"),
        category: yup.string().trim().min(3, 'Category name too short!').required("Categoryis necessary!"),
        ModoPreparo: yup.string().trim().min(40, 'Way of Preparation is too short!').required("Way of Preparation is necessary!")
    })

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Search</Text>
            </View>
            <View>
                <Text style={{textAlign:"center", fontSize: 20, fontWeight:'bold'}}> This page is under development!</Text>
                <Octicons name="alert" size={100} style={{margin: 15}} color="black" />
                <TouchableOpacity disabled={disable} onPress={()=> goBack()}>
                    <Text numberOfLines={2} style={{fontSize: 16, fontWeight: 'bold', textAlign:"center"}}>Click Here to back to the Feed</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
},
});
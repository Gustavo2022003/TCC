import React, {useState, useEffect, useRef, useContext} from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { AntDesign } from '@expo/vector-icons'; 
import ComponentIngrediente from '../../components/ComponentIngrediente';
import * as ImagePicker from 'expo-image-picker';
import AlertCustom from '../../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-gesture-handler';
import { Form, Formik, useFormik, useFormikContext } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }

export default function EditProfile({navigation, route}) {
    const [formDataState, setFormData] = useState(null);
    const [profile, setProfile] = useState(null)
    const [pictureProfile, setPictureProfile] = useState(null);
    const [loading, setLoading] = useState(true)
    let userInfo = {completeName: '', username: ''};

    const [visibleAlert, setVisibleAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertButton, setAlertButton] = useState('')
    const [disable, setDisable] = useState(false);


    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }

    async function GetProfile(){
        let getuser = await AsyncStorage.getItem('userData');
        let user = JSON.parse(getuser);
        let response= await fetch('http://192.168.0.108:3000/getProfile/'+user.id,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        let json = await response.json()
        setProfile(json)
        setFormData(json.profilePicture)
        userInfo.completeName = json.completeName
        userInfo.username = json.username
        setLoading(false)
        //setProfile(response)

}
    useEffect(()=>{
        GetProfile()
    },[navigation, route])

    async function updateProfile(values){
        let getuser = await AsyncStorage.getItem('userData');
        let user = JSON.parse(getuser);
        let response= await fetch('http://192.168.0.108:3000/updateProfile/'+profile.id,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completeName: values.completeName,
                username: values.username,
                profilePicture: formDataState
            })
        })
        let json = await response.json()
        if (json == 'Updated'){
            setVisibleAlert(true)
            setAlertTitle("Dados alterados com sucesso!")
            setAlertMessage("Volte para a página de login e atualize pra ver os novos dados!")
            setAlertButton('Ok')
        }else{
            setVisibleAlert(true)
            setAlertTitle("Username em utilização!")
            setAlertMessage("tente usar outro username e tente atualizar novamente")
            setAlertButton('error')
        }
    }

    //Image Selector
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
                }).then(response => setFormData(response.data))
                .catch(function (error) {
                    console.log(error.toJSON());
                });
        }
    }
    
    //Preview Picture Recipe
    function ShowRecipeImage(){
        let idImage = formDataState
        let picturePath = 'http://192.168.0.108:3000/Images/'
        let finalPath = picturePath + idImage
        let finalfinalpath = finalPath.toString();
        setPictureProfile(finalfinalpath)
    }

    //Shown Preview Recipe Picture
    useEffect(()=>{
        ShowRecipeImage();
    },[formDataState, setFormData, setPictureProfile, pictureProfile])

    //Schema yup
    const updateUserSchema = yup.object().shape({
        completeName: yup.string().trim().min(3, 'Full Name too short!').required("Full Name is necessary!"),
        username: yup.string().trim().min(3, 'username too short!').required("username is necessary!"),
    })

    //Formik
    const formik = useFormik({
        initialValues: userInfo,
        onSubmit: updateProfile,
        validationSchema: updateUserSchema
    });

    return (
            <Animatable.View animation='fadeInUp' style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity disabled={disable} style={{ flexDirection: 'row', alignSelf: 'center' }} onPress={() => goBack()}>
                        <AntDesign style={{ alignSelf: 'center' }} name="left" size={24} color="#3B944F" />
                        <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: '500', color: '#3B944F' }}>Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.HeaderTitle}>Recipe Creation</Text>
                    <View style={{width: '10%'}}/>
                </View>
                <AlertCustom 
                    visible={visibleAlert}
                    title = {alertTitle}
                    message = {alertMessage}
                    positiveButton={() => {if (alertButton == 'error'){
                        setVisibleAlert(false)}
                        else{ 
                        setVisibleAlert(false)
                        navigation.goBack()
                        navigation.navigate("Profile")
                        }
                    }}
                />
                { loading == true ? <View><Text>Loading</Text></View>
                    :<View style={styles.container}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={{width: '90%'}}>
                                <View>
                                    <Image source={{uri: pictureProfile}} style={styles.avatar} resizeMode={'cover'}/>
                                    <Text  style={styles.name}>{profile.completeName}</Text>
                                    <Text  style={styles.username}>@{profile.username}</Text>
                                </View>
                                <TouchableOpacity style={styles.selectImgBtn}onPress={openImagePickerAsync}>
                                    <Text style={{textAlign: 'center', fontWeight: '700', fontSize: 20}}>Change profile picture</Text>
                                </TouchableOpacity>

                                <TextInput style={styles.formInput} placeholder='Full Name' value={formik.values.completeName} onBlur={formik.handleBlur('completeName')} onChangeText={formik.handleChange('completeName')}/>
                                {formik.touched.completeName && formik.errors.completeName && <Text style={styles.errorInput}>{formik.errors.completeName}</Text>}
                                            
                                <TextInput style={styles.formInput} placeholder='Username' value={formik.values.username} onBlur={formik.handleBlur('username')} onChangeText={formik.handleChange('username')}/>
                                {formik.touched.username && formik.errors.username && <Text style={styles.errorInput}>{formik.errors.username}</Text>}

                                {formik.errors.recipename || formik.errors.category || formik.errors.ModoPreparo || formik.errors.desc?
                                <TouchableOpacity style={styles.RegButtonInvalid} disabled={!Formik.isValid}>
                                    <Text style={styles.RegTextInvalid}>Create Recipe</Text> 
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.RegButton} onPress={formik.handleSubmit} disabled={!updateUserSchema.isValid}>
                                    <Text style={styles.RegText}>Update profile</Text> 
                                </TouchableOpacity>}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
            </Animatable.View>
    );
}
//#A0E2AF
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
header:{
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '8%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 32,
    fontWeight: '700',
},
avatar: {
    backgroundColor: '#C3C3C3',
    marginTop: '5%',
    alignSelf: 'center',
    width: 180,
    height:180,
    borderRadius: 90,
},
name:{
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '2%',
    fontSize: 20,
    fontWeight: '700',
},
username:{
    alignSelf: 'center',
    fontSize: 16,
    color: '#686868'
},
createButton:{
    backgroundColor: '#5DB075',
    width: '60%',
    alignItems:'center',
    padding: '2%',
    borderRadius: 50,
    marginTop: '3%'
},
formInput:{
    alignSelf:'center',
    color: '#BDBDBD',
    width: '100%',
    height: 55,
    paddingHorizontal: 15,
    margin: '3%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.21)',
    backgroundColor: '#EDEDED',
    borderRadius: 18,
},
errorInput:{
    marginTop: '-3%',
    paddingBottom: 10,
    color: 'red',
    fontWeight: '700',
    marginLeft: '14%',
},
selectImgBtn:{
    alignContent: 'center',
    justifyContent: 'center',
    width: '65%',
    height: 40,
    marginTop: 10,
    backgroundColor: '#5DB075',
    alignSelf: 'center',
    borderRadius: 15,
},
RegButton:{
    marginTop: '3%',
    alignSelf:'center',
    backgroundColor: '#5DB075',
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
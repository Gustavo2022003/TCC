import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {Ionicons} from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import ComponentReceitaProfile from '../../components/ComponentReceitaProfile';

export default function Profile({navigation}) {
    
    const [user,setUser]= useState(null);
    const [name, setName]= useState(null)
    const [Username, setUsername]= useState(null);
    const [picture, setPicture]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [receitas, setReceitas]=useState(null);
    
    //UseEffect to Get the User
    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.id);
            setName(json.completeName);
            setUsername(json.username);
        }
        getUser();
    },[]);

    //Function to Logout
    async function Logout(){
        await AsyncStorage.removeItem('token')
        navigation.navigate('Welcome');
    }

    //Function to Get the Profile
    async function GetProfile(){
            // Forçar pegar para enviar para a rota
            let getuser = await AsyncStorage.getItem('userData');
            let user = JSON.parse(getuser);
            let response= await fetch('http://192.168.43.92:3000/getAvatar/'+user.id,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            let json=await response.json();
            let Image = json[0].profilePicture;
            if (Image === null){
                setPicture('http://192.168.43.92:3000/Images/17bcb88b-4881-4d42-bf97-2b8793c16a65.png')
            }else{
            let idImage = JSON.stringify(json)
            //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
            let newImage = idImage.slice(22,62)
            let strPicture = newImage.toString()
            let picturePath = 'http://192.168.43.92:3000/Images/'
            let finalPath = picturePath + strPicture
            let finalfinalpath = finalPath.toString();
            setPicture(finalfinalpath)
            }
    }

    //UseEffet do Get Profile
    useEffect(()=>{
        GetProfile();
    },[]);

    //Function Get the Recipe by Profile Id
    async function GetReceita(){
        let getuser = await AsyncStorage.getItem('userData');
        let user = JSON.parse(getuser);
        let response = await fetch('http://192.168.43.92:3000/recipe/'+user.id,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.json();
        setReceitas(json);
    };

    //UseEffect GetReceita
    useEffect(()=>{
        GetReceita();
    },[]);

    //Selector Images
    const openImagePickerAsync = async () => {
    
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({allowsEditing: true,});
        console.log(pickerResult)
        
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
            await axios.post('http://192.168.43.92:3000/uploadPicture/'+user, formData, {headers: {
                'Content-Type': 'multipart/form-data',
             }})
            .catch(function (error) {
                console.log(error.toJSON());
              });
            GetProfile();
        }
    }


    //WAIT
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }    
    //Function to refresh the apge
    const onRefresh = async () => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        GetProfile();
        GetReceita();
        console.log('Refresh')
    };
   
    //source={require('../../Images/'+picture)}

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Ionicons name='exit-outline' size={40} color={'black'} onPress={Logout}/>
                <Text style={styles.HeaderTitle}>Profile</Text>
                <Feather name="edit" size={32} color={"black"}/>
            </View>
            {/*<TouchableOpacity onPress={openImagePickerAsync}><Text>Alterar Foto de Perfil</Text></TouchableOpacity>   */}    
            
            <View style={styles.bottom}>
            <FlatList
                data={receitas}
                ListHeaderComponent={
                    <View>
                    <Image source={{uri: picture}} style={styles.avatar} resizeMode={'cover'}/>
                    <Text  style={styles.name}>{name}</Text>
                    <Text  style={styles.username}>@{Username}</Text>
                    </View>}
                refreshControl={ <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />}
                renderItem={({item}) =><ComponentReceitaProfile {...item}/>}
            />
            </View>
        </Animatable.View>
        );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
header:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '4%',
    width: '96%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 40,
    fontWeight: '700',
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
bottom:{
    marginBottom:'42%',
}

});
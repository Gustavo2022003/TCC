import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import ComponentReceitaProfile from '../../components/ComponentReceitaProfile';
import { useBackHandler } from '@react-native-community/hooks';
import { AntDesign } from '@expo/vector-icons'; 

export default function Profile({route, navigation}) {
    
    const [name, setName]= useState(null)
    const [Username, setUsername]= useState(null);
    const [picture, setPicture]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [receitas, setReceitas]=useState(null);
    const [disable, setDisable] = useState(false);
    
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }



    let shouldBeHandledHere = true;

    useBackHandler(() => {
        if (shouldBeHandledHere){
            navigation.goBack()
            return false
          }
          // let the default thing happen
          return true
        })

    

    //Function to Get the Profile from other User
    async function GetProfileOther(){
            // Forçar pegar para enviar para a rota
            let response= await fetch('http://192.168.43.92:3000/user/'+route.params?.user,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
            let json=await response.json();
            let idImage = json.profilePicture
            let picturePath = 'http://192.168.43.92:3000/Images/'
            let finalPath = picturePath + idImage;
            let finalfinalpath = finalPath.toString();
            setPicture(finalfinalpath)
            setName(json.completeName);
            setUsername(json.username);
    }

    //UseEffet do Get Profile
    useEffect(()=>{
        GetProfileOther();
    },[route]);

    //Function Get the Recipe by Profile Id
    async function GetReceita(){
        let response = await fetch('http://192.168.43.92:3000/recipe/'+route.params?.user,{
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

    //WAIT
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }    
    //Function to refresh the apge
    const onRefresh = async () => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        GetProfileOther();
        GetReceitaOther();
        console.log('Refresh')
    };
    //source={require('../../Images/'+picture)}

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity disabled={disable} style={{flexDirection:'row', alignSelf:'center'}}onPress={()=> goBack()}>
                    <AntDesign style={{alignSelf:'center'}} name="left" size={24} color="black" />
                    <Text style={{alignSelf:"center", fontSize: 20, fontWeight: 'bold'}}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.HeaderTitle}>Profile</Text>
                <View style={{width: '18%', height: 1}}/>
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
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingTop: '8%',
    width: '96%',
    height: '10%',
    marginBottom: '1%'
},
HeaderTitle:{
    fontSize: 36,
    fontWeight: '700',
},
avatar: {
    marginTop: '5%',
    alignSelf: 'center',
    width: 180,
    height:180,
    borderRadius: 90,
},
name:{
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '1%',
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
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


export default function Profile({navigation, route}) {
    
    const [user,setUser]= useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName]= useState(null)
    const [Username, setUsername]= useState(null);
    const [picture, setPicture]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [receitas, setReceitas]=useState(null);
    
    //UseEffect to Get the User

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
            let response= await fetch('http://192.168.221.92:3000/getProfile/'+user.id,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            let json=await response.json();
            setUser(json)
            //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
            let idImage = json.profilePicture
            let picturePath = 'http://192.168.221.92:3000/Images/'
            let finalPath = picturePath + idImage;
            let finalfinalpath = finalPath.toString();
            setPicture(finalfinalpath)
            setLoading(false)
    }

    //UseEffet do Get Profile
    useEffect(()=>{
        GetProfile();
    },[setPicture, picture]);

    //Function Get the Recipe by Profile Id
    async function GetReceita(){
        let getuser = await AsyncStorage.getItem('userData');
        let user = JSON.parse(getuser);
        let response = await fetch('http://192.168.221.92:3000/recipe/'+user.id,{
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
        GetProfile();
        onRefresh();
    },[navigation, route]);

    //WAIT
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }    
    //Function to refresh the apge
    const onRefresh = async () => {
        setRefreshing(true);
        GetProfile();
        GetReceita();
        wait(2000).then(() => setRefreshing(false));
    };
       //source={require('../../Images/'+picture)}

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Ionicons name='exit-outline' style={{alignSelf:'center'}} size={40} color={'black'} onPress={Logout}/>
                <Text style={styles.HeaderTitle}>Profile</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('EditProfile', {userId: user.id})}>
                <Feather name="edit" style={{alignSelf:'center'}} size={32} color={"black"}/>
                </TouchableOpacity>
            </View>
            {loading == true ? <View><Text>Loading</Text></View>
            :
            <View style={styles.bottom}>
            <FlatList
                data={receitas}
                ListHeaderComponent={
                    <View>
                    <Image source={{uri: picture}} style={styles.avatar} resizeMode={'cover'}/>
                    <Text  style={styles.name}>{user.completeName}</Text>
                    <Text  style={styles.username}>@{user.username}</Text>
                    </View>
                    }
                    refreshControl={ <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />}
                renderItem={({item}) =><ComponentReceitaProfile refresh={onRefresh} {...item}/>}
            />
            </View>}
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
},
HeaderTitle:{
    fontSize: 36,
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
bottom:{
    marginBottom:'42%',
}

});
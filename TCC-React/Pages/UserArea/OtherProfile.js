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
    
    const [userAtual, setUserAtual] = useState(null);
    const [name, setName]= useState(null)
    const [Username, setUsername]= useState(null);
    const [picture, setPicture]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [receitas, setReceitas]=useState(null);
    const [disable, setDisable] = useState(false);
    const [followTrue, setFollowTrue] = useState(false);
    const [followInfo, setFollowInfo] = useState('')
    
    let follows = () => {
        if(userAtual == route.params?.user){
            return (<View></View>)
        }else{
            if(followTrue == false){
                return (
                <TouchableOpacity style={styles.followButton} onPress={() => follow()}>
                    <Text style={{color: '#ffffff', fontWeight: '600'}}>Follow</Text>
                </TouchableOpacity>
                )
            }else{
                return(
                <TouchableOpacity style={styles.unfollowButton} onPress={() => unfollow()}>
                    <Text style={{fontWeight: '600'}}>Unfollow</Text>
                </TouchableOpacity>
                )
            }
        }
    }
    
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }

    async function follow(){
        let response = await fetch('http://192.168.0.126:3000/follows', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                userFollow: userAtual,
                userFollowed: route.params?.user
            })
        })
        let json = await response.json()
        if(json = 'true'){
            setFollowTrue(true)
        }
    }

    async function unfollow(){
        let response = await fetch('http://192.168.0.126:3000/unfollow', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                userFollow: userAtual,
                userFollowed: route.params?.user
            })
        })
        let json = await response.json()
        if(json = 'true'){
            setFollowTrue(false)
        }
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
            let getuser = await AsyncStorage.getItem('userData')
            let user = JSON.parse(getuser)
            setUserAtual(user.id)
            // Forçar pegar para enviar para a rota
            let response= await fetch('http://192.168.0.126:3000/user/'+route.params?.user,{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            let response1 = await fetch('http://192.168.0.126:3000/checkFollow', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    userFollow: user.id,
                    userFollowed: route.params?.user
                })
            })
            let response2 = await fetch('http://192.168.0.126:3000/followInfoOther', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    userFollow: user.id,
                    userFollowed: route.params?.user
                })
            })
            //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
            let checkFollow = await response1.json()
            let followInfo = await response2.json()
            let json=await response.json();
            let idImage = json.profilePicture
            let picturePath = 'http://192.168.0.126:3000/Images/'
            let finalPath = picturePath + idImage;
            let finalfinalpath = finalPath.toString();
            if(checkFollow == 'false'){
                setFollowTrue(false);
                setFollowInfo(followInfo);
                setPicture(finalfinalpath)
                setName(json.completeName);
                setUsername(json.username);
            }else{
                setFollowTrue(true);
                setFollowInfo(followInfo);
                setPicture(finalfinalpath)
                setName(json.completeName);
                setUsername(json.username);
            }
            
    }

    //UseEffet do Get Profile
    useEffect(()=>{
        GetProfileOther();
    },[route, followTrue]);

    //Function Get the Recipe by Profile Id
    async function GetReceita(){
        let response = await fetch('http://192.168.0.126:3000/recipe/'+route.params?.user,{
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
                    <View style={{marginVertical: '4%', flexDirection:'row', justifyContent:'center', width: '96%'}}>
                        <View style={{alignItems: 'center'}}>
                            <Text>{followInfo.publicacoes}</Text>
                            <Text>Publicações</Text>
                        </View>
                        <View style ={{borderRightWidth: 1.2, borderRightColor: '#bdbdbd',marginHorizontal: '5%'}}></View>
                        <View style={{alignItems: 'center'}}>
                            <Text>{followInfo.seguidores}</Text>
                            <Text>Seguidores</Text>
                        </View>
                        <View style ={{borderRightWidth: 1.2, borderRightColor: '#bdbdbd', marginHorizontal: '5%'}}></View>
                        <View style={{alignItems: 'center'}}>
                            <Text>{followInfo.seguindo}</Text>
                            <Text>Seguindo</Text>
                        </View>
                    </View>
                    <View style={{alignSelf: 'center', marginVertical: '3%', width: '100%'}}>
                        {follows()}
                    </View>
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
},
followButton:{
    alignSelf: 'center',
    backgroundColor: '#5DB075',
    width: '75%',
    height: '33%',
    justifyContent: 'center',
    borderRadius: 13,
    alignItems: 'center'
},
unfollowButton:{
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    width: '75%',
    height: '33%',
    justifyContent: 'center',
    borderRadius: 13,
    alignItems: 'center'
}
});
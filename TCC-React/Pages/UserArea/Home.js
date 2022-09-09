import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComponentReceita from '../../components/ComponentReceita';
import { useBackHandler } from '@react-native-community/hooks';

import { Ionicons } from '@expo/vector-icons'; 
import AlertCustom from '../../components/Alert';

    const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }
    


export default function Home({navigation}) {
    
    const [user,setUser]=useState(null);
    const [receitas, setReceitas]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    // Alert
    const [errorFeed, setErrorFeed] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    let shouldBeHandledHere = true;
    useBackHandler(() => {
        if (shouldBeHandledHere) {
            // handle it
            return true
          }
          // let the default thing happen
          return false
        })

    async function GetReceita(){
        let response= await fetch('http://192.168.43.53:3000/feed',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.json();
        if (json == 'FeedError'){
            console.log('Erro no Banco de Dados')
            setAlertTitle('Erro ao Carregar Feed')
            setAlertMessage('Clique no Botão para atualizar o feed novamente')
            setErrorFeed(true);
            setReceitas(null);
        }else{
            console.log('Receitas Retornadas')
            setReceitas(json);
        }
    };
    
    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.name);
        }
        getUser();
    },[]);
    
    useEffect(()=>{
        GetReceita();
    },[]);
    
    
    const onRefresh = async () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    GetReceita();
    console.log('Refresh')
    setErrorFeed(false)
    };




    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Feed</Text>
            </View>
            {/*<View style={{ width: '80%', backgroundColor: '#000000', height: 3,opacity: 0.1 ,borderRadius: 3, marginTop: '-3%'}}><Text>teste</Text></View>*/}
            {errorFeed == true ?
            <View style={styles.error}>
                <Text style={styles.errorTxtTitle}>Feed loading error</Text>
                <Ionicons name="ios-cloud-offline-outline" size={94} color="black" />
                <Text numberOfLines={2} style={styles.errorTxt}>Failed while loading Feed, click to refresh!</Text>
                <TouchableOpacity style={styles.ButtonRefreshError} onPress={onRefresh}>
                    <Text style={styles.buttonTxt}>Refresh Feed</Text>
                </TouchableOpacity>
            </View>
            : <View style={styles.bottom}>
            <FlatList
                data={receitas}
                refreshControl={
                    <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />}
                ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor:'black', width:'90%', height: 2.5, opacity: 0.05, alignSelf: 'center'}}/>
                )}    
                renderItem={({item}) =><ComponentReceita {...item}/>}
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
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 40,
    fontWeight: '700',
},
bottom:{
    marginBottom:'40%',
},
error:{
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
},
errorTxt:{
    marginTop: '1%',
    fontSize: 16,
    fontWeight: '500',
},
errorTxtTitle:{
    fontSize: 26,
    fontWeight: '700',
    marginBottom: '2%'
},
ButtonRefreshError:{
    marginTop: '3%',
    backgroundColor: '#A0E2AF',
    padding: '3%',
    width: '40%',
    height: 45,
    borderRadius: 15,
    justifyContent:'center'
},
buttonTxt:{
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
}
});
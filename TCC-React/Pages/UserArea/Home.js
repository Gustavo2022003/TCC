import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComponentReceita from '../../components/ComponentReceita';
import { useBackHandler } from '@react-native-community/hooks';


    const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }
    


export default function Home({navigation}) {
    
    const [user,setUser]=useState(null);
    const [receitas, setReceitas]=useState(null);
    const [refreshing, setRefreshing] = useState(false);

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
        let response= await fetch('http://192.168.0.108:3000/feed',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.json();
        setReceitas(json);
    };
    
    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.id);
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
    };





    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Feed</Text>
            </View>
            <View style={styles.bottom}>
            <FlatList
                data={receitas}
                refreshControl={
                    <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />}
                renderItem={({item}) =><ComponentReceita {...item}/>}
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
    justifyContent: 'center',
    width: '100%',
    height: '12%',
},
HeaderTitle:{
    marginTop: '4%',
    fontSize: 40,
    fontWeight: '700',
},
bottom:{
    marginBottom:'40%',
}
});
import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import ComponentReceita from '../../components/ComponentReceita';



export default function Home({navigation}) {
    const [user,setUser]=useState(null);
    const [receitas, setReceitas]=useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.name);
        }
        getUser();
    },[]);
    
    useEffect(()=>{
        async function GetReceita(){
            let response= await fetch('http://192.168.16.229:3000/feed',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            let json=await response.json();
            setReceitas(json);
            setIsRefreshing(false);
            }
        GetReceita();
    },[]);
    
    const onRefresh = React.useCallback(() => {
        //set isRefreshing to true
        setIsRefreshing(true);
        // and set isRefreshing to false at the end of your callApiMethod()
    },[]);





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
                        refreshing={isRefreshing}
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
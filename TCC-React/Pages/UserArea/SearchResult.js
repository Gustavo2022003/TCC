import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComponentReceita from '../../components/ComponentReceita';
import { useBackHandler } from '@react-native-community/hooks';

import { MaterialIcons } from '@expo/vector-icons'; 
import AlertCustom from '../../components/Alert';

    const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }
    


export default function SearchResult({route, navigation}) {
    
    const [user,setUser]=useState(null);
    const [receitas, setReceitas]=useState(null);
    const [array, setArray] = useState(route.params.itens);
    const [refreshing, setRefreshing] = useState(false);
    
    // Alert
    const [errorFeed, setErrorFeed] = useState(false);


    useEffect(() => {
        if (array == 'NoFound'){
            setErrorFeed(true)
        }else{
            GetSearchedReceita();
        }
    }, [array]);

    let shouldBeHandledHere = true;
    useBackHandler(() => {
        if (shouldBeHandledHere) {
            // handle it
            return true
        }
          // let the default thing happen
        return false
    })

    async function GetSearchedReceita(){
        let response= await fetch('http://192.168.43.53:3000/searchedRecipes',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                list: array
            })
        })
        let json=await response.json();
        if (json == 'SearchError'){
            console.log('Erro ao achar receita')
            setAlertTitle('Erro ao Procurar Receita')
            setAlertMessage('Nenhuma Receita foi encontrada com os itens inseridos!')
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
    
    const onRefresh = async () => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        GetSearchedReceita();
        console.log('Refresh')
        setErrorFeed(false)
    };




    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Search Results</Text>
            </View>
            {/*<View style={{ width: '80%', backgroundColor: '#000000', height: 3,opacity: 0.1 ,borderRadius: 3, marginTop: '-3%'}}><Text>teste</Text></View>*/}
            {errorFeed == true ?
            <View style={styles.error}>
                <Text style={styles.errorTxtTitle}>Search Error</Text>
                <MaterialIcons name="search-off" size={94} color="black" />
                <Text numberOfLines={2} style={styles.errorTxt}>Doesn't exists any recipe with the selected ingredients, try again with another ingredients</Text>
                <TouchableOpacity style={styles.ButtonRefreshError} onPress={()=>navigation.goBack()}>
                    <Text style={styles.buttonTxt}>Make a new search</Text>
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
    width: '90%',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
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
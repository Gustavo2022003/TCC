import React, {useEffect, useState, useMemo} from 'react';
import { StatusBar } from 'expo-status-bar';
import {FlatList, RefreshControl, StyleSheet, Text, View, TouchableOpacity, Image, BackHandler, ActivityIndicator} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as Animatable from 'react-native-animatable';
import BigList from "react-native-big-list";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ComponentReceita from '../../components/ComponentReceita';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useBackHandler } from '@react-native-community/hooks';

import { Ionicons } from '@expo/vector-icons'; 

    const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }
    


export default function Home({navigation, route}) {
    
    const [user,setUser]=useState(null);
    const [receitas, setReceitas]=useState([]);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState('DESC');
    const [field, setField] = useState('createdAt');
    const [value, setValue] = useState('Newest');
    const [isFocus, setIsFocus] = useState(false);
    const [page, setPage] = useState(0)
    const [refreshing, setRefreshing] = useState(false);

    const data = [
        {field:'createdAt', order:'DESC', value:'Newest',label:'Newest Recipes'},
        {field:'createdAt', order:'ASC', value:'Oldest',label:'Oldest Recipes'},
        {field:'recipeName', order:'ASC', value:'A-Z',label:'A - Z Recipes '},
        {field:'recipeName', order:'DESC', value:'Z-A',label:'Z - A Recipes'},
      ]
    
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
        setLoading(true)
        let response= await fetch('http://192.168.0.108:3000/feed/'+page,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                field: field,
                order: order
            })
        })
        let json=await response.json();
        if (json == 'FeedError'){
            setAlertTitle('Erro ao Carregar Feed')
            setAlertMessage('Clique no Botão para atualizar o feed novamente')
            setErrorFeed(true);
            setReceitas(null);
        }else{
            setReceitas([...receitas, ...json]);
            setPage(page + 1)
            setLoading(false)
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
        setReceitas([]);
        setPage(0);
        GetReceita();
    },[navigation, route, value]);
    
    
    const onRefresh = async () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    GetReceita();
    setErrorFeed(false)
    };

    function renderItem({item}){
        return <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}><ComponentReceita {...item}/></TouchableOpacity>
    }


    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Feed</Text>
            </View>
            <View style={{width: '96%', justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    data={data}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={'Filter'}
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setOrder(item.order);
                        setField(item.field);
                        setReceitas([]);
                        setPage(0);
                        setIsFocus(false);
                    }}
                    renderLeftIcon={() => (
                        <AntDesign
                        style={styles.icon}
                        color={'#3B944F'}
                        name="filter"
                        size={20}
                        />
                    )}
                />
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
                initialNumToRender={5}
                refreshControl={
                    <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    />}
                ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor:'black', width:'90%', height: 2.5, opacity: 0.05, alignSelf: 'center'}}/>
                )}
                onEndReachedThreshold={0.1}
                onEndReached={GetReceita}
                renderItem={renderItem}
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
    paddingTop: '8%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 36,
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
},
dropdown: {
    height: 50,
    width: 180,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
},
icon: {
    marginRight: 5,
},
label: {
    position: 'absolute',
    backgroundColor: 'white',
    color: '#3B944F',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
},
placeholderStyle: {
    fontSize: 14,
    color: '#3B944F',
},
selectedTextStyle: {
    fontSize: 14,
    color: '#3B944F',
},
iconStyle: {
    width: 20,
    height: 20,
},
});
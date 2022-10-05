import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Octicons } from '@expo/vector-icons'; 


export default function Search({route,navigation}) {
    const [disable, setDisable] = useState(false);
    
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
        wait(1000).then(() => setDisable(false));
    }
    //WAIT  
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }   

    useEffect(()=>{
        setDisable(false);
    },[route, navigation])

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Search</Text>
            </View>
            <View style={{width: '80%', height:'75%', justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
                <Text style={{textAlign:"center", fontSize: 20, fontWeight:'bold'}}> This page is under development!</Text>
                <Octicons name="alert" size={100} style={{margin: 15}} color="black" />
                <TouchableOpacity disabled={disable} onPress={()=> goBack()}>
                    <Text numberOfLines={2} style={{fontSize: 16, fontWeight: 'bold', textAlign:"center"}}>Click Here to back to the Feed</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
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
});
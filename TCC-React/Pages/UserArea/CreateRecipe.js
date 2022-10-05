import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, NavigationActions } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { AntDesign } from '@expo/vector-icons'; 
import { Octicons } from '@expo/vector-icons'; 


export default function CreateRecipe({route, navigation}) {
    const [pictureRecipe, setPictureRecipe] = useState(null);
    const [disable, setDisable] = useState(false);
    
    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }

    //Evitar voltar pelo android
    let shouldBeHandledHere = true;
    useBackHandler(() => {
        if (shouldBeHandledHere) {
            navigation.goBack()
            return false
        }
          // let the default thing happen
        return true
    })

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity disabled={disable} style={{flexDirection:'row', alignSelf:'center'}}onPress={()=> goBack()}>
                    <AntDesign style={{alignSelf:'center'}} name="left" size={24} color="black" />
                    <Text style={{alignSelf:"center", fontSize: 20, fontWeight: 'bold'}}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.HeaderTitle}>Recipe Creation</Text>
                <View style={{width: '10%'}}/>
            </View>
            <View style={{width: '80%', height:'75%', justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
                <Text style={{textAlign:"center", fontSize: 20, fontWeight:'bold'}}> This page is under development!</Text>
                <Octicons name="alert" size={100} style={{margin: 15}} color="black" />
                <TouchableOpacity disabled={disable} onPress={()=> goBack()}>
                    <Text numberOfLines={2} style={{fontSize: 16, fontWeight: 'bold', textAlign:"center"}}>Click Here to back to the Previous Page</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignSelf:'center',
    backgroundColor: '#A0E2AF',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#FFFFFF',
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center'
},
});
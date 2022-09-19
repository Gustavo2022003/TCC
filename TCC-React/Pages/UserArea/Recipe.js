import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { AntDesign } from '@expo/vector-icons'; 


export default function Recipe({route, navigation}) {
    
    let shouldBeHandledHere = true;
    console.log(route)

    //Evitar voltar pelo android
    useBackHandler(() => {
        if (shouldBeHandledHere) {
            navigation.goBack()
            return true
          }
          // let the default thing happen
          return false
        })

    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{flexDirection:'row', alignSelf:'center'}}onPress={()=> navigation.goBack()}>
                    <AntDesign name="left" size={24} color="black" />
                    <Text style={{alignSelf:"center", fontSize: 20, fontWeight: 'bold'}}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.HeaderTitle}>Receitas</Text>
                <Text style={{color: 'transparent'}}>TESTE</Text>
            </View>
            <View>
                <View>
                    <Text>Receita</Text>
                </View>
                    <Text>Receita: {route.params?.recipeName}</Text>
                    <Text>Id: {route.params?.id}</Text>
                    <Text>Type: {route.params?.category}</Text>
                    <Text>Modo de Preparo: {route.params?.ModoPreparo}</Text>
                    <Text>Criador da Receita: {route.params?.User.completeName}</Text>
                    <Text>{route.params?.User.username}</Text>
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
    justifyContent: 'space-between',
    paddingTop: '7%',
    width: '96%',
    height: '9%',
},
HeaderTitle:{
    fontSize: 40,
    fontWeight: '700',
},
});
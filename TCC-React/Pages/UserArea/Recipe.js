import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';


export default function Recipe({route, navigation}) {
    
    let shouldBeHandledHere = true;
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
            <View style={styles.lineTop}>
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
            <View>
            <Text>Receita</Text>
            </View>
            <Text>Receita: {route.params?.name}</Text>
            <Text>Id: {route.params?.id}</Text>
            <Text>Type: {route.params?.type}</Text>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    justifyContent: 'flex-start'
},
lineTop:{
    alignItems:'flex-start',
    justifyContent: 'center',
    marginTop: '10%',
    height: '5%',
    backgroundColor: 'white',
}
});
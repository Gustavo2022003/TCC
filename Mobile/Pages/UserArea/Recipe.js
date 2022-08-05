import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';


export default function Recipe() {
    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <Text>Area de Receita</Text>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#A0E2AF',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
});
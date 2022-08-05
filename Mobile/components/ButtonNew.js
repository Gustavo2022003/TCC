import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Ionicons} from '@expo/vector-icons';

export default function ButtonNew({size, color}){
    return(
        <View style={styles.container}>
            <Ionicons name='book-outline' color='white' size={45}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:90,
        height:90,
        borderRadius: 45,
        backgroundColor: '#5DB075',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 72
    }
})
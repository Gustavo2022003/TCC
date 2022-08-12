import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';


export default function ComponentReceita({id, name, type}){
    return(
        <View style={styles.container}>
            <View style={styles.central}>
                <Image style={styles.img}
                />
            </View>
            <View style={styles.content}>
            <Text>Receita: {name}</Text>
            <Text>Id: {id}</Text>
            <Text>Type: {type}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: 380,
        flex: 1,
        backgroundColor: 'wheat',
        justifyContent: 'flex-start',
        margin: 20,
    },
    central:{
        alignItems:'center',
    },
    img:{
        margin: 20,
        width: 350,
        height: 150
    },
    content:{
        alignItems:'flex-start',
        marginLeft: 20
    }
})
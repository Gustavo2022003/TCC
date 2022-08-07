import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';


export default function ComponentReceita({...item}){
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}>
            <View style={styles.central}>
                <Image style={styles.img}
                />
            </View>
            <View style={styles.content}>
            <Text>Receita: {item.recipeName}</Text>
            <Text>Id: {item.id}</Text>
            <Text>Type: {item.category}</Text>
            </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '90%',
        flex: 1,
        backgroundColor: 'wheat',
        justifyContent: 'flex-start',
        padding: 15,
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
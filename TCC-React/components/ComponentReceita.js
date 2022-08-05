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
            <Text>Receita: {item.name}</Text>
            <Text>Id: {item.id}</Text>
            <Text>Type: {item.type}</Text>
            </View>
            </TouchableOpacity>
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
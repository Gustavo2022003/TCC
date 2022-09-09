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
                source={{uri: 'http://192.168.43.53:3000/Images/912C5759-697C-42EB-AE5E-21239E8EB76E.jpg'}}
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
        width: '100%',
        alignSelf:'center',
        flex: 1,
        justifyContent: 'flex-start',
        padding: 15,
        marginHorizontal: 20,
    },
    central:{
        alignItems:'center',
    },
    img:{
        margin: 10,
        width: 330,
        height: 220,
        resizeMode:'center'
    },
    content:{
        alignItems:'flex-start',
        marginLeft: 20
    }
})
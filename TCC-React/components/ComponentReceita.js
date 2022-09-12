import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentReceita({...item}){
    console.log(item);
    let modoPreparo = item.ModoPreparo;
    console.log(modoPreparo.toString());
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}>
            <View style={styles.central}>
                <Image style={styles.img}
                source={{uri: 'http://192.168.43.92:3000/Images/912C5759-697C-42EB-AE5E-21239E8EB76E.jpg'}}
                />
            </View>
            <View style={styles.content}>
            <Text style={styles.title}>{item.recipeName}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.text}>{modoPreparo}</Text>
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
    },
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: '6%'
    },
    category:{
        fontSize: 15,
        color: '#A9A9A9',
        marginLeft: '6%'
    }
})
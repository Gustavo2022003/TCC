import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentIngrediente({...item}){
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <View style={styles.central}>
                <Image style={styles.img}
            />
            </View>
            <View style={styles.content}>
            <Text>{item.ingredienteName}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    central:{
        alignItems:'center',
    },
    img:{
        margin: 20,
        width: 50,
        height: 50
    },
    content:{
        width: '100%',
        height: 99,
        justifyContent: 'center',
        alignItems:'flex-start',
    }
})
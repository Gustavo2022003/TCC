import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentIngrediente({counterId, increment, decrement, index, ...item}){

        const [value, setValue] = useState(item.quantItem);
        
        useEffect(() => {
            setValue(item.quantItem);
        },[increment, decrement,counterId])

    return(
        <View style={styles.container}>
            <View style={styles.central}>
                <Image style={styles.img}
            />
            </View>
            <View style={styles.content}>
                <View style={{width: '35%'}}>
                <Text>{item.ingredienteName}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonControl}onPress={decrement}>
                            <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 28}}>{value}</Text>
                    <TouchableOpacity style={styles.buttonControl} onPress={increment}>
                            <Text>+</Text>
                    </TouchableOpacity>
                </View>
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
        alignContent: 'center'
    },
    central:{
        alignItems:'center',
        justifyContent: 'center',
        width: '25%',
        height: '100%'
    },
    img:{
        backgroundColor: 'white',
        margin: 20,
        width: '75%',
        height: '75%',
        borderRadius: 100,
    },
    content:{
        width: '80%',
        flexDirection: 'row',
        height: 99,
        alignItems: 'center'
    },
    buttonControl:{
        backgroundColor:"#EFD89C",
        width: 34,
        height: 34,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '10%'
    }
})
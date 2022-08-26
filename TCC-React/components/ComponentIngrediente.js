import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentIngrediente({...item}){
    const navigation = useNavigation();

        const [counter, setCounter] = useState(0);
        async function increment(){
            setCounter(counter + 1)
            console.log('incrementou')
        }
        async function decrement(){
            if (counter <= 0){
                console.log('Não consegue ser menor que 0')
            }else{
            setCounter(counter - 1)
            console.log('decrementou')
            }
        }

    return(
        <View style={styles.container}>
            <View style={styles.central}>
                <Image style={styles.img}
            />
            </View>
            <View style={styles.content}>
                <Text>{item.ingredienteName}</Text>
                <TouchableOpacity onPress={decrement}>
                        <Text>-</Text>
                </TouchableOpacity>
                <Text>{counter}</Text>
                <TouchableOpacity onPress={increment}>
                        <Text>+</Text>
                </TouchableOpacity>
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
        flexDirection: 'row',
        height: 99,
        alignItems: 'center'
    }
})
import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentIngrediente({checkAndReset, increment, decrement, index, ...item}){

        const [counter, setCounter] = useState(0);

        useEffect(() => {
            setCounter(0);
        },[])

        async function incrementCounter(){
            const newCounter = counter + 1;
            setCounter(newCounter);
        }
        async function decrementCounter(){
            if (counter <= 0){
                console.log('Não consegue ser menor que 0')
            }else{
                const newCounter = counter - 1;
                setCounter(newCounter);
            }
        }
        function OnClickIncrement(){
            increment();
            incrementCounter();
        }
        function OnClickDecrement(){
            decrement();
            decrementCounter();
        }
    return(
        <View style={styles.container}>
            <View style={styles.central}>
                <Image style={styles.img}
            />
            </View>
            <View style={styles.content}>
                <View style={{width: '35%'}}>
                <Text>{item.ingredienteName}</Text>
                <Text>{index}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={styles.buttonControl}onPress={OnClickDecrement}>
                            <Text>-</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize: 28}}>{counter}</Text>
                    <TouchableOpacity style={styles.buttonControl} onPress={OnClickIncrement}>
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
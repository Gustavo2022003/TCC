import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

import ComponentIngrediente from '../../components/ComponentIngrediente';
import { Ionicons } from '@expo/vector-icons';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
    }

export default function SearchRecipe() {

    const [ingredients, setIngredients]=useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [counter, setCounter] = useState([]);

    const [errorFeed, setErrorFeed] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    async function GetIngredients(){
        let response= await fetch('http://192.168.0.108:3000/ingredients',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json=await response.json();
        if (json == 'IngredientsError'){
            console.log('Erro no Banco de Dados')
            setAlertTitle('Erro ao Carregar Ingredientes')
            setAlertMessage('Clique no Botão para atualizar os ingredientes novamente')
            setErrorFeed(true);
            setIngredients(null);
        }else{
            console.log('Ingredientes Carregados')
            // Add quant to the object
            let newIngredients = json.map(item => {
                return { ...item, quantItem: 0};
            });
            setIngredients(newIngredients);
        }
    };


    useEffect(()=>{
        GetIngredients();
    },[]);


    async function checkGeral(){
        var ingredientQuery = ingredients.filter(ingredient => ingredient.quantItem > 0).map(ingredients => {return [ingredients.id, ingredients.quantItem]})
        // Sempre numéros impares serão os IDS dos ingredientes e os Pares Quantidades
        let flatQuery = ingredientQuery.flatMap(ingredients => ingredients)

        /*ingredients.forEach(item => {
            item.quantItem = 0
            let value = item.quantItem;
            setCounter(value)
            return item.quantItem;
        });*/

        let res = await fetch('http://192.168.0.108:3000/searchRecipe',{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itens: flatQuery
            })
        });

    }

    //Render item to Flat List
    let RenderItem = ({item, index}) => {
        async function increment(){      
            item.quantItem += 1;
            let value = item.quantItem;
            setCounter(value)
            return item.quantItem;
        }
        async function decrement(){
            if (item.quantItem <= 0){
                console.log('Não consegue ser menor que 0')
            }else{;
                item.quantItem -= 1;
                let value = item.quantItem;
                setCounter(value)
                return item.quantItem;
            }
        }

    return(
    <View style={{backgroundColor: index++ % 2 === 0 ? '#83B98F' :'#A0E2AF' }}>
        <ComponentIngrediente {...item} index={index} increment={increment} decrement={decrement}/>
    </View>
    )}

    const onRefresh = async () => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
        GetIngredients();
        console.log('Refresh')
        setErrorFeed(false)
    };


    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.HeaderTitle}>Search Recipe</Text>
                <Text></Text>
            </View>
            {/*<View style={{ width: '80%', backgroundColor: '#000000', height: 3,opacity: 0.1 ,borderRadius: 3, marginTop: '-3%'}}><Text>teste</Text></View>*/}
            {errorFeed == true ?
            <View style={styles.error}>
                <Text style={styles.errorTxtTitle}>Feed loading error</Text>
                <Ionicons name="ios-cloud-offline-outline" size={94} color="black" />
                <Text numberOfLines={2} style={styles.errorTxt}>Failed while loading Feed, click to refresh!</Text>
                <TouchableOpacity style={styles.ButtonRefreshError} onPress={onRefresh}>
                    <Text style={styles.buttonTxt}>Refresh Feed</Text>
                </TouchableOpacity>
            </View>
            : <View style={styles.bottom}>
                <TouchableOpacity onPress={checkGeral}>
                    <Text>OI DEUS, SOU EU DNV</Text>
                </TouchableOpacity>
            <FlatList
                data={ingredients}
                keyExtractor={(item, index) =>  index.toString()}
                renderItem={RenderItem}
            />
            </View>}
        </Animatable.View>
    );
}
//#A0E2AF
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
header:{
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 32,
    fontWeight: '700',
},
bottom:{
    marginBottom:'40%',
},
error:{
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
},
errorTxt:{
    marginTop: '1%',
    fontSize: 16,
    fontWeight: '500',
},
errorTxtTitle:{
    fontSize: 26,
    fontWeight: '700',
    marginBottom: '2%'
},
ButtonRefreshError:{
    marginTop: '3%',
    backgroundColor: '#A0E2AF',
    padding: '3%',
    width: '40%',
    height: 45,
    borderRadius: 15,
    justifyContent:'center'
},
buttonTxt:{
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
}


});
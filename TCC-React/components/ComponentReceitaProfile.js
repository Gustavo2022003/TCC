import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeMenu from '../components/RecipeMenu';



export default function ComponentReceitaProfile({refresh,...item}){

    const [pictureRecipe, setPictureRecipe] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [user, setUser] = useState(null)
    const [data, setData] = useState(null);

    useEffect(()=>{
        async function getUser(){
            let response = await AsyncStorage.getItem('userData');
            let json=JSON.parse(response);
            setUser(json.id);
        }
        getUser();
    },[]);

    function dataAtualFormatada(){
        var data = new Date(item.createdAt),
            dia  = data.getDate().toString().padStart(2, '0'),
            mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
            ano  = data.getFullYear();
        setData(dia+"/"+mes+"/"+ano)
    }

    async function getPictures(){
        let picturePath = 'http://192.168.221.92:3000/Images/'
        //Recipe Picture
        console.log(item.pictureReceita)
        let recipe = item.pictureReceita
        let recipeimg = picturePath + recipe
        let recipefinal = recipeimg.toString()
        setPictureRecipe(recipefinal)
    }

    useEffect(()=>{
        getPictures();
        dataAtualFormatada();
    },[pictureRecipe])

    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <RecipeMenu visible={menuVisible} title={item.recipeName} recipeId={item.id} refresh={refresh} button={()=>setMenuVisible(false)}/>
            <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})} onLongPress={()=>{user == item.userId ? setMenuVisible(true) : setMenuVisible(false)}}>
            <View style={styles.central}>
                <Image style={styles.img}
                source={{uri: pictureRecipe}}
                />
            </View>
            <View style={styles.content}>
            <Text style={styles.title}>{item.recipeName}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.textModo}>{item.desc}</Text>
            <Text style={{marginTop: 10}}>{data}</Text>
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
        width: 340,
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
        marginLeft: '6%',
    },
    textModo:{
        marginTop: '3%',
        width: '80%',
        fontSize: 15,
        opacity: 0.5,
        marginLeft: '4%',
    }
})
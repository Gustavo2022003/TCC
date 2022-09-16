import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentReceita({...item}){
            const navigation = useNavigation();
            const [picture, setPicture]= useState(null);
                
            async function getPicture(){
                let NewImage = item.User.profilePicture;
                if (NewImage === null){
                    setPicture('http://192.168.43.92:3000/Images/17bcb88b-4881-4d42-bf97-2b8793c16a65.png')
                }else{
                    let idImage = item.User.profilePicture;
                    //DEIXA O NOME DA IMAGEM DO JEITO QUE PRECISO
                    let newImage = idImage.slice(22,62)
                    let strPicture = newImage.toString()
                    let picturePath = 'http://192.168.43.92:3000/Images/'
                    let finalPath = picturePath + strPicture
                    let finalfinalpath = finalPath.toString();
                    console.log(finalfinalpath)
                    console.log(item.User.profilePicture)
                }
            }

            useEffect(()=>{
                getPicture();
            },[])

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}>
            <View style={styles.profileArea}>
                <Image style={styles.imgProfile}
                source={{uri: picture}}
                />
                <Text style={{alignSelf: 'center', marginLeft:'2%', fontSize: 15, fontWeight: 'bold'}}>{item.User.username}</Text>
            </View>
            <View style={styles.central}>
                <Image style={styles.img}
                source={{uri: 'http://192.168.43.92:3000/Images/912C5759-697C-42EB-AE5E-21239E8EB76E.jpg'}}
                />
            </View>
            <View style={styles.content}>
            <Text style={styles.title}>{item.recipeName}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.textModo}>{item.ModoPreparo}</Text>
            
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
    },
    profileArea:{
        flexDirection:'row',
        width: '100%',
    },
    imgProfile:{
        width:40,
        height: 40,
        marginLeft: '6%'
    }
})
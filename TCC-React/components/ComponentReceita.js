import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function ComponentReceita({...item}){
            const navigation = useNavigation();
            const [pictureProfile, setPictureProfile] = useState(null);
            const [pictureRecipe, setPictureRecipe] = useState(null);
                
            async function getPictures(){
                //Profile Picture
                let profile = item.User.profilePicture;
                let picturePath = 'http://192.168.0.108:3000/Images/'
                let profileimg = picturePath + profile
                let profilefinal = profileimg.toString();
                //Recipe Picture
                let recipe = item.pictureReceita
                let recipeimg = picturePath + recipe
                let recipefinal = recipeimg.toString()
                setPictureProfile(profilefinal)
                setPictureRecipe(recipefinal)
            }
    
            useEffect(()=>{
                getPictures();
            },[navigation])
    

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}>
            <View style={styles.profileArea}>
                <Image style={styles.imgProfile} source={{uri: pictureProfile}}/>
                <TouchableOpacity style={{alignSelf:'center', marginLeft:'2%',}} onPress={() => navigation.navigate('OtherProfile', {user: item.User.id})}>
                    <Text style={{fontSize: 17, fontWeight: 'bold', backgroundColor: "#FFFFFF"}}>{item.User.username}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.central}>
                <Image style={styles.img}
                source={{uri: pictureRecipe}}
                />
            </View>
            <View style={styles.content}>
            <Text style={styles.title}>{item.recipeName}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.textModo}>{item.desc}</Text>
            
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
        alignItems:'center'
    },
    imgProfile:{
        width:45,
        height: 45,
        borderRadius: 25,
        marginLeft: '6%',
    }
})
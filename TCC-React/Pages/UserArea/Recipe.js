import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, BackHandler} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation, NavigationActions } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';


export default function Recipe({route, navigation}) {
    const [ingredients, setIngredients] = useState(null);
    const [pictureProfile, setPictureProfile] = useState(null);
    const [pictureRecipe, setPictureRecipe] = useState(null);
    const [disable, setDisable] = useState(false);
    
    async function getIngredients(){
        let res = await fetch('http://192.168.43.92:3000/recipeIngrediente/'+route.params?.id,{
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let json = await res.json();
        setIngredients(json);
    }
    useEffect(()=>{
        getIngredients();
    },[route,navigation])


    async function goBack(){
        //Prevent double click
        navigation.goBack()
        setDisable(true);
    }

    //Evitar voltar pelo android
    let shouldBeHandledHere = true;
    useBackHandler(() => {
        if (shouldBeHandledHere) {
            navigation.goBack()
            return false
        }
          // let the default thing happen
        return true
    })
    
        async function getPictures(){
            //Profile Picture
            let profile = route.params?.User.profilePicture;
            let picturePath = 'http://192.168.43.92:3000/Images/'
            let profileimg = picturePath + profile
            let profilefinal = profileimg.toString();
            //Recipe Picture
            let recipe = route.params?.pictureReceita
            let recipeimg = picturePath + recipe
            let recipefinal = recipeimg.toString()
            setPictureProfile(profilefinal)
            setPictureRecipe(recipefinal)
        }

        useEffect(()=>{
            getPictures();
        },[route, navigation])



        let RenderItem = ({item, index}) => {
            let quantidade = item.quantidade
            return(
                quantidade > 1 ?
                <Text style={{color: '#31573A', fontSize: 16, fontWeight: 'bold'}}>{item.quantidade}{item.tipo == 'Liquido' ? <Text>ml de {item.ingredienteName}</Text> : item.tipo == 'Peso' ? <Text>g de {item.ingredienteName}</Text> : <Text> {item.ingredienteName}s</Text>}</Text>
                : <Text style={{color: '#31573A', fontSize: 16, fontWeight: 'bold'}}>{item.quantidade}{item.tipo == 'Liquido' ? <Text>ml de {item.ingredienteName}</Text> : item.tipo == 'Peso' ? <Text>g de {item.ingredienteName}</Text> : <Text> {item.ingredienteName}</Text>}</Text>
                )
        }


    return (
        <Animatable.View animation='fadeInUp' style={styles.container}>
                <View style={styles.header}>
                        <TouchableOpacity disabled={disable} style={{ flexDirection: 'row', alignSelf: 'center' }} onPress={() => goBack()}>
                            <AntDesign style={{ alignSelf: 'center' }} name="left" size={24} color="#3B944F" />
                            <Text style={{ alignSelf: "center", fontSize: 16, fontWeight: '500', color: '#3B944F' }}>Back</Text>
                        </TouchableOpacity>
                </View>
                <View style={styles.content}>
                <FlatList
                data={ingredients}
                renderItem={RenderItem}
                ListHeaderComponent={
                        <View>
                        <View style={styles.inline}>
                                <Image source={{ uri: pictureRecipe }} style={styles.imgRecipe} />
                                <View style={styles.info}>
                                    <Text adjustsFontSizeToFit style={styles.titleRecipe}>{route.params?.recipeName}</Text>
                                    <Text style={styles.category}>{route.params?.category}</Text>
                                    <View style={{width: 180, marginTop: 10}}>
                                        <Text adjustsFontSizeToFit>{route.params?.desc}</Text>
                                    </View>
                                    <View style={styles.interation}>
                                        <TouchableOpacity style={{marginHorizontal: '2%'}}>
                                            <MaterialIcons name="favorite-outline" size={34} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{marginHorizontal: '2%'}}>
                                        <MaterialCommunityIcons name="comment-text-outline" size={34} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{marginHorizontal: '2%'}}>
                                            <Feather name="bookmark" size={34} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity onPress={() => navigation.navigate("OtherProfile", { user: route.params?.User.id })}>
                                        <View style={styles.profileInfo}>
                                            <Image source={{ uri: pictureProfile }} style={styles.profileImg} />
                                            <View style={styles.userText}>
                                                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{route.params?.User.completeName}</Text>
                                                <Text style={{ fontSize: 14, fontWeight: '500', marginTop: '-3%' }}>@{route.params?.User.username}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <Text style={{color: '#F6A444', fontSize: 18, fontWeight: '700', marginTop: 5}}>Ingredientes</Text>
                            </View>
                        </View>

                }
                ListFooterComponent={
                    <View style={{flex: 1, marginTop: '5%', marginBottom: '40%'}}>
                        <Text style={{color: '#F6A444', fontSize: 18, fontWeight: '700'}}>Modo de Preparo:</Text>
                        <Text style={{color: '#31573A', fontSize: 16, fontWeight: '700'}}> {route.params?.ModoPreparo}</Text>
                    </View>
                }
                />
                </View>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignSelf:'center',
    backgroundColor: '#A0E2AF',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: '#FFFFFF',
},
header:{
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingTop: '8%',
    width: '96%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center'
},
content:{
    alignSelf: 'center',
    flex: 1,
    width: '95%',
    height: '100%'
},
imgRecipe:{
    width: '55%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: "#B3B3B3"
},
inline:{
    display: 'flex',
    flexDirection: 'row',
},
info:{
    paddingVertical: '1%',
    paddingHorizontal: '3%',
    maxWidth: '50%'
},
interation:{
    flexDirection: 'row',
    marginTop: '50%',
    marginHorizontal: '2%'
},  
profileInfo:{
    marginTop: '5%',
    width: '100%',
    flexDirection: 'row',
},
profileImg:{
    alignSelf: 'center',
    backgroundColor: '#C3C3C3',
    borderRadius: 20,
    width: 40,
    height: 40,
},
userText:{
    paddingLeft: '2%',
    justifyContent: 'center'
},
titleRecipe:{
    fontSize: 14,
    color: '#31573A',
    fontWeight: 'bold',
},
category:{
    marginTop: '-2%',
    fontSize: 14,
}
});
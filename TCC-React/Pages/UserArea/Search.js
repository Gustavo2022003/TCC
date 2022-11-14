import React, {useEffect, useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, SectionList, TextInput} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Fontisto } from '@expo/vector-icons';
import UserList from '../../components/UserList';
import ComponentReceita from '../../components/ComponentReceita';
import AlertCustom from '../../components/Alert';

export default function Search({route,navigation}) {
        const [start, setStart] = useState(null)
        const[search, setSearch] = useState(null)
        const[users, setUsers] = useState([])
        const[recipes, setRecipes] = useState([])

        const [visibleAlert, setVisibleAlert] = useState(false);
        const [alertTitle, setAlertTitle] = useState('');
        const [alertMessage, setAlertMessage] = useState('');


        async function SearchGeral(){
            if (search == null || search == ''){
                setVisibleAlert(true)
                setAlertTitle('Erro ao fazer busca')
                setAlertMessage('Você não pode fazer buscas sem inserir nada no campo de pesquisa!!')
            }
            else{
                let responseUser= await fetch('http://192.168.0.108:3000/searchUser/'+search,{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                let responseRecipe= await fetch('http://192.168.0.108:3000/searchRecipes/'+search,{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                let jsonUser = await responseUser.json()
                if (jsonUser == 'noFound'){
                    setUsers([])
                }else{
                    setUsers(jsonUser)
                }
                let jsonRecipe = await responseRecipe.json()
                if (jsonRecipe == 'noFound'){
                    setRecipes([])
                }else{
                    setRecipes(jsonRecipe)
                }
            }
        };

        //<Text>Start Searching clicking on the input!!</Text>

    return (
        
        
        <Animatable.View animation='fadeInUp' style={styles.container}>
            <AlertCustom 
                visible={visibleAlert}
                title = {alertTitle}
                message = {alertMessage}
                positiveButton={() => setVisibleAlert(false)}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.header}>
                
                    <Text style={styles.HeaderTitle}>Search</Text>
                
            </View>
            </TouchableWithoutFeedback>
            <View style={styles.search}>
                
                    <TextInput style={styles.input} placeholder='Search Users or Recipes here!' value={search} onChangeText={setSearch}/>
                    <TouchableOpacity onPress={SearchGeral}>
                        <Fontisto name="search" size={24} color="black" />
                    </TouchableOpacity>
                
            </View>
            <View style={{width: '95%'}}>
                {users.length == 0 && recipes.length == 0 ?<TouchableWithoutFeedback onPress={Keyboard.dismiss}><View><Text>Start Searching clicking on the input!!</Text></View></TouchableWithoutFeedback>
                : <SectionList 
                    renderSectionHeader={({ section: { title } }) =><View style={{width: '100%', backgroundColor: 'white', alignItems: 'center', paddingTop: '2%'}}><Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: '2%' }}>{title}</Text></View>} 
                    sections={[ 
                        { title: 'Users', data: users, renderItem: ({ item, index }) => <UserList {...item}/> }, 
                        { title: 'Recipes', data: recipes, renderItem: ({ item, index}) => <TouchableOpacity onPress={()=> navigation.navigate('Recipe', {...item})}><ComponentReceita {...item} /></TouchableOpacity>}, 
                        ]} 
                    keyExtractor={(item, index) => item.id +'&'+ index} 
                />}
            </View>
        </Animatable.View>

    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start'
},
header:{
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '8%',
    width: '100%',
    height: '10%',
},
HeaderTitle:{
    fontSize: 36,
    fontWeight: '700',
},
search:{
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems:'center'
},
input:{
    color: '#BDBDBD',
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.21)',
    paddingLeft: 20,
    height: '60%',
    marginVertical: '5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
}
});
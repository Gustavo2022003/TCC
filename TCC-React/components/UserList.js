import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, Image} from 'react-native';



export default function UserList({...item}){
    const navigation = useNavigation()
        const [pictureProfile, setPictureProfile] = useState(null)

        async function getPictures(){
            //Ingredient Picture
            let profile = item.profilePicture;
            let picturePath = 'http://192.168.43.92:3000/Images/'
            let profileimg = picturePath + profile
            let profilefinal = profileimg.toString();
            setPictureProfile(profilefinal)
        }

        useEffect(() => {
            getPictures();
        },[setPictureProfile, pictureProfile])
        
    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>navigation.navigate('OtherProfile', {user: item.id})}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width:'100%'}}>
                <Image source={{uri: pictureProfile}}style={styles.img}/>
                <View style={{justifyContent: 'center'}}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.completeName}</Text>
                <Text style={{ fontSize: 14, fontWeight: '500', marginTop: '-1%' }}>{item.username}</Text>
                </View>
            </View>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        alignContent:'flex-start',
        borderBottomWidth: 0.5
    },
    img:{
        backgroundColor: 'white',
        margin: 20,
        width: 50,
        height: 50,
        borderRadius: 100,
    },
})
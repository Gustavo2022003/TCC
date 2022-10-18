import React, { useState } from 'react';
import {View,Modal,TouchableOpacity, Text, StyleSheet} from 'react-native';
import AlertCustom from './Alert';
import Confirm from './Confirm'

export default function RecipeMenu({visible,title,recipeId,refresh, button}){
            const [confirmVisible, setConfirmVisible] = useState(false)
            const [visibleAlert, setVisibleAlert] = useState(false);
            const [alertTitle, setAlertTitle] = useState('');
            const [alertMessage, setAlertMessage] = useState('');

            async function deleteRecipe(){
                let response =await fetch('http://192.168.221.92:3000/deleteRecipe/'+recipeId,{
                    method: 'POST',
                    headers:{
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }}
                )
            }
    return(
        <Modal transparent visible={visible}>
            <Confirm visible={confirmVisible} title={title} IdReceita={recipeId} buttonConfirm={()=> [deleteRecipe(), setConfirmVisible(false), refresh()]} buttonBack={()=> setConfirmVisible(false)}/>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.content}>
                        <View style={styles.title}>
                            <Text adjustsFontSizeToFit numberOfLines={3} style={styles.titleTxt}>{title} - Menu</Text>
                        </View>
                        <View style={{width: '100%'}}>
                        <TouchableOpacity onPress={()=>setConfirmVisible(true)}><View style={styles.option}><Text style={styles.delete}>Excluir Receita</Text></View></TouchableOpacity>
                            <View style={styles.option2}><Text style={{fontSize: 20}}>Em breve</Text></View>
                            <View style={styles.option}><Text style={{fontSize: 20}}>Em breve</Text></View>
                        </View>
                    <TouchableOpacity onPress={button} style={styles.button}>
                        <Text style={styles.buttonTxt}>Voltar</Text>
                    </TouchableOpacity>
                    </View>
                </View>            
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    box:{
        width: '80%',
        borderRadius: 12,
        backgroundColor: '#f2f2f2',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    title:{
        paddingVertical:'3%',
        width: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        alignItems:'center',
    },
    content:{
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: '5%'
    },
    option:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderTopWidth: 0.8,
        borderTopColor: 'black',
        borderBottomWidth: 0.8,
        borderBottomColor: 'black',
        padding: 15
    },
    option2:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 15
    },
    delete:{
        color: 'red',
        fontSize: 20,
        fontWeight: '600'
    },
    contentTxt:{
        paddingHorizontal: '8%',
        fontSize: 18,
        textAlign: `center`,
    },
    titleTxt:{
        fontSize: 26,
        fontWeight: '700',
        color: '#26442D'
    },
    button:{
        marginTop: '4%',
        alignSelf:'center',
        backgroundColor: '#A0E2AF',
        width: '40%',
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt:{
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
    }
})
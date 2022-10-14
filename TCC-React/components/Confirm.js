import React, { useState } from 'react';
import {View,Modal,TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function Confirm({visible,title, IdReceita, buttonConfirm, buttonBack}){
    return(
        <Modal transparent visible={visible}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.content}>
                        <Text adjustsFontSizeToFit numberOfLines={3} style={styles.titleTxt}>Você realmente deseja excluir a receita "{title}"</Text>
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={buttonConfirm} style={styles.button}>
                            <Text style={styles.buttonTxt}>Sim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={buttonBack} style={styles.button}>
                            <Text style={styles.buttonTxt}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
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
        borderRadius: 30,
        backgroundColor: '#f2f2f2',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    content:{
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: '8%',
        paddingHorizontal: '4%'
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
        fontSize: 20,
        fontWeight: '700',
        color: '#26442D'
    },
    button:{
        marginTop: '4%',
        alignSelf:'center',
        backgroundColor: '#A0E2AF',
        width: '40%',
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTxt:{
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
    }
})
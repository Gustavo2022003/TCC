import React from 'react';
import {View,Modal,TouchableOpacity, Text, StyleSheet} from 'react-native';

export default function AlertCustom({visible, title, message, positiveButton}){
    return(
        <Modal transparent visible={visible}>
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={styles.title}>
                        <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={styles.titleTxt}>{title}</Text>
                    </View>
                    <View style={styles.content}>
                    <Text 
                    adjustsFontSizeToFit
                    numberOfLines={3}
                    style={styles.contentTxt}
                    >{message}</Text>
                    <TouchableOpacity onPress={positiveButton} style={styles.button}>
                        <Text style={styles.buttonTxt}>OK</Text>
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
        width: '90%',
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
        backgroundColor: '#A0E2AF',
    },
    content:{
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '3%'
    },
    contentTxt:{
        paddingHorizontal: '8%',
        fontSize: 18,
        textAlign: `center`,
    },
    titleTxt:{
        fontSize: 26,
        fontWeight: '700',
        color: '#000000'
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
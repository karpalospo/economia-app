import React, { useState, useEffect, useContext }  from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";

import { UtilitiesContext } from '../context/UtilitiesContext'

import Title from "../components/Title";
import { styles } from '../global/styles';
import BottomMenu from "../components/BottomMenu";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons'; 

const Profile = ({navigation}) => {

    const { setUser, user } = useContext(UtilitiesContext)


    const MyButton = ({title, onPress}) => {
        return (
            <TouchableOpacity style={_styles.optionButton} onPress={onPress}>
                <Text style={_styles.label2}>{title}</Text>
                <Ionicons name="ios-chevron-forward" size={24} color="black" />
            </TouchableOpacity>
        )
    }

    return(
        <SafeAreaView style={_styles.container} forceInset={{top: "never", bottom: "never"}}>
            
            <ScrollView>
                <View style={{backgroundColor: "white", padding:5, borderBottomWidth: 2, borderBottomColor: "#eee"}} >
                    <Title title="Mi Perfíl" />
                </View>

                {user.email != '' &&
                <View style={_styles.profileContainer}>
                    
                    <View style={_styles.profileImageContainer}>
                        <Image style={_styles.profileImage} source={require('../../assets/icons/profile_image.png')} />
                    </View>

                    <View style={_styles.profileEditContainer}>
                        <Text style={_styles.profileNameText}>{user.nombres}</Text>
                    </View>

                    <View style={[styles.rowCenter, {marginTop:10, marginBottom:20}]} >
                        <TouchableOpacity style={_styles.button} onPress={() => {setUser({}), navigation.navigate("Home")}}>
                            <Text style={_styles.buttonText}>CERRAR SESIÓN</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                }

   

                {user.email != '' &&
                <View style={_styles.accountContainer}>

                    <View style={_styles.infoCont}>
                        <Text style={_styles.title}>DATOS DE LA CUENTA</Text>
                    </View>

                    <View style={{height:20}} />
                    <View style={_styles.optionsContainer}>

                        <View style={{paddingHorizontal:13, width:"100%"}} >
                            <View style={_styles.itemCont}>
                                <Text style={_styles.label}>Nombre</Text>
                                <View><Text style={_styles.value}>{user.nombres}</Text></View>
                            </View>

                            <View style={_styles.itemCont}>
                                <Text style={_styles.label}>E-mail</Text>
                                <Text style={_styles.value}>{user.email}</Text>
                            </View>
                        </View>
                        <View style={{height:20}} />

                        <MyButton title="Editar mi perfíl" onPress={() => {}} />
                        <MyButton title="Mis últimos Pedidos" onPress={() => {}} />
                        <MyButton title="Mis direcciones guardadas" onPress={() => {}} />
                        
                        <View style={{height:5}} />

                    </View>

                </View>}
                                    
                <View style={_styles.eticosSerranoContainer}>
                    <Text style={_styles.eticosSerranoText}>Powered by <Text style={{fontFamily: "RobotoB"}}>Eticos Ltda. Ver.4.0.3</Text></Text>
                </View>

            </ScrollView>
            <BottomMenu navigation={navigation} />

        </SafeAreaView>
    )
    

}

export default Profile 

const _styles = {
    
    container: {flex: 1, position:"relative"},

    profileContainer: {padding: 20, paddingTop:10, justifyContent:"center", alignItems:"center"},
    profileImageContainer: {padding: 5, width: 70, height: 70, alignItems: 'center', justifyContent: 'center'},
    profileImage: {width: '100%', height: '100%'},

    profileEditContainer: {padding: 10, justifyContent: 'center'},
    profileNameText: {fontSize: 20,color: "#444", fontFamily: "Tommy"},
    button: {paddingVertical: 7, paddingHorizontal:23, borderRadius: 5, backgroundColor: "#FF2F6C", borderRadius:25, alignItems: 'center', marginHorizontal:7},
    buttonText: {fontSize: 13, color: "#fff", fontFamily: "Tommy", textAlign:"center"},

    accountContainer: {backgroundColor:"white", marginHorizontal:10, borderRadius:8, elevation:3},
    infoCont: {borderBottomColor: "#d6d6d6", paddingHorizontal: 15, paddingVertical: 12, borderBottomWidth: 0.5},
    title: {fontSize: 13, color: "#444", fontFamily: "Tommy"},
    itemCont: {width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10},
    label: {fontSize: 15, color: "#666", fontFamily: "Roboto", width:80, textAlign: "right", paddingRight: 10},
    value: {fontSize: 15, color: "#333", fontFamily: "RobotoB"},

    label2: {fontSize: 15, color: "#444", fontFamily: "TommyR"},

    optionsContainer: {alignItems: 'center', paddingHorizontal: 15,},
    optionButton: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        borderTopWidth: 1, 
        borderColor: "#eee", 
        paddingVertical: 15, 
        paddingHorizontal: 5, 
        alignItems: 'center'
    },
    optionButtonIcon: {width: 10, height: 10},

    eticosSerranoContainer: { alignItems: 'flex-end', marginTop: 12, marginRight:18},
    eticosSerranoText: {fontSize: 13, color: "#999", fontFamily: "Roboto"},
}
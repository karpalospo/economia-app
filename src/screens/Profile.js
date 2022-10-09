import React, { useState, useEffect, useContext }  from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";

import { UtilitiesContext } from '../context/UtilitiesContext'

import Header from "../components/Header";

import BottomMenu from "../components/BottomMenu";

const Profile = ({navigation}) => {

    const { setUser, user } = useContext(UtilitiesContext)

    return(
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
            
            <Header navigation={navigation} />

            {user.email != '' &&
            <View style={styles.profileContainer}>
                
                <View style={styles.profileImageContainer}>
                    <Image style={styles.profileImage} source={require('../../assets/icons/profile_image.png')} />
                </View>

                <View style={styles.profileEditContainer}>
                    <Text style={styles.profileNameText}>{user.nombres}</Text>
                </View>

            </View>
            }

            <View style={{flexDirection:"row", justifyContent:"center"}}>

                <TouchableOpacity style={styles.profileEditButton} onPress={() => {}}>
                    <Text style={styles.profileEditButtonText}>EDITAR PERFIL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.profileEditButton, {backgroundColor: "#FF1412"}]} onPress={() => {setUser({}), navigation.navigate("Home")}}>
                    <Text style={styles.profileEditButtonText}>CERRAR SESIÓN</Text>
                </TouchableOpacity>

            </View>

            <View style={{height:20}} />


            {user.email != '' &&
            <View style={styles.accountContainer}>

                <View style={styles.accountInfoContainer}>
                    <Text style={styles.accountInfoTitleText}>DATOS DE LA CUENTA</Text>
                </View>

                <View style={{height:20}} />
                <View style={styles.optionsContainer}>

                    {user.nombres &&
                    <View style={{paddingHorizontal:13, width:"100%"}} >
                        <View style={styles.accountItemContainer}>
                            <Text style={styles.accountItemTitleText}>Nombre de usuario</Text>
                            <View><Text style={styles.accountItemValueText}>{user.nombres.trim().split(' ')[0]}</Text></View>
                        </View>

                        <View style={styles.accountItemContainer}>
                            <Text style={styles.accountItemTitleText}>E-mail</Text>
                            <Text style={styles.accountItemValueText}>{user.email}</Text>
                        </View>
                    </View>
                    }


                    <View style={{height:10}} />
                    <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
                        <Text style={styles.accountItemTitleText}>Mis últimos Pedidos</Text>
                        <Image source={require('../../assets/icons/dropright_arrow.png')} resizeMode='contain' style={styles.optionButtonIcon} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.optionButton} onPress={() => {}}>
                        <Text style={styles.accountItemTitleText}>Mis direcciones guardadas</Text>
                        <Image source={require('../../assets/icons/dropright_arrow.png')} resizeMode='contain' style={styles.optionButtonIcon} />
                    </TouchableOpacity>
                    <View style={{height:5}} />

                </View>


            </View>}

                                
            <View style={styles.eticosSerranoContainer}>
                <Text style={styles.eticosSerranoText}>Powered by <Text style={{fontFamily: "RobotoB"}}>Eticos Serrano</Text></Text>
            </View>

            <BottomMenu navigation={navigation} />

        </SafeAreaView>
    )
    

}

export default Profile 

const styles = StyleSheet.create({
    container: {flex: 1, position:"relative"},

    profileContainer: {padding: 20, paddingTop:10, justifyContent:"center", alignItems:"center"},
    profileImageContainer: {padding: 5, width: 70, height: 70, alignItems: 'center', justifyContent: 'center'},
    profileImage: {width: '100%', height: '100%'},

    profileEditContainer: {padding: 10, justifyContent: 'center'},
    profileNameText: {fontSize: 20,color: "#444", fontFamily: "Tommy"},
    profileEditButton: {paddingVertical: 12, paddingHorizontal:17, borderRadius: 5, backgroundColor: "#1B42CB", alignItems: 'center', marginHorizontal:7, maxWidth: 150,},
    profileEditButtonText: {fontSize: 13, color: "white", fontFamily: "RobotoB", textAlign:"center"},

    accountContainer: {backgroundColor:"white", marginHorizontal:10, borderRadius:8, elevation:3},
    accountInfoContainer: {borderBottomColor: "#d6d6d6", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5},
    accountInfoTitleText: {fontSize: 13, color: "#444", fontFamily: "Tommy"},
    accountItemContainer: {width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10},
    accountItemTitleText: {fontSize: 16, color: "#888", fontFamily: "Roboto"},
    accountItemValueText: {fontSize: 16, color: "#657272", fontFamily: "RobotoB", paddingLeft: 10},

    optionsContainer: {alignItems: 'center', paddingHorizontal: 15,},
    optionButton: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: "#eee", paddingVertical: 15, paddingHorizontal: 10, alignItems: 'center'},
    optionButtonIcon: {width: 10, height: 10},

    eticosSerranoContainer: { alignItems: 'flex-end', marginTop: 12, marginRight:18},
    eticosSerranoText: {fontSize: 13, color: "#999", fontFamily: "Roboto"},
})
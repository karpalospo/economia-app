import React, { useState, useContext} from "react";
import { View, TouchableOpacity, Text, TextInput, Modal, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import { API } from "../services/services";
import { UtilitiesContext } from '../context/UtilitiesContext'

const eye = require("../../assets/icons/eye.png")
const eyeno = require("../../assets/icons/eye-no.png")
const volver = require('../../assets/icons/times.png')

export const SignInCard = ({ onRegister = () => {}, onLogin = () => {}, visible = false, onCancel = () => {}}) =>
{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pass_visible, setPass_visible] = useState(true);
    const [passwordModal, setPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const { user, setUser } = useContext(UtilitiesContext)

    onPressSubmit = async (email, password) => {
        if(email != '' && password != '') {

            setLoading(true)
            setError(false)
            const res = await API.POST.signin(email + "::" + password)
            setLoading(false)
            if(res.message.success == false) {
                setError(true)
                setPassword("")
            } else if(res.message.nit) {
                setUser({
                    logged: true,
                    nit: res.message.nit,
                    token: res.message.auth_token,
                    nombres: res.message.nombres,
                    email: res.message.email
                })
                onLogin(true)
            }
        }
        else Alert.alert('Atención', "Debe llenar todos los campos");
    }

    return(
        <Modal
            animationType='fade'
            visible={visible}
            transparent={true}
            onRequestClose={() => {}}
        >
            
            <View style={styles.container}>

                <View style={styles.signInContainer}>
                    
                    <View style={styles.imageContainer}>
                        <View style={{width:40}}></View>
                        <View style={{flex:1, alignItems:"center"}}><Text style={styles.inicio}>Iniciar Sesión</Text></View>
                        <TouchableOpacity onPress={onCancel} style={{width:35, height:35, borderRadius:18, backgroundColor:"#ccc", alignItems:"center", justifyContent:"center"}}>
                            <Image source={volver} tintColor="#333" resizeMode='contain' style={{width:16, height:16}} />
                        </TouchableOpacity>
                        
                    </View>


                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Correo Electrónico</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            editable={!loading}
                            placeholderTextColor={"#A5A5A5"}
                            style={styles.inputText}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            onChangeText={(email) => setEmail(email)}
                            value={email}
                        />
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Contraseña</Text>
                    </View>

                    <View style={[styles.inputContainer, {flexDirection: "row"}]}>
                        <View style={{flex:1}}>
                            <TextInput
                                editable={!loading}
                                placeholderTextColor={"#A5A5A5"}
                                style={styles.inputText}
                                secureTextEntry={pass_visible}
                                onChangeText={(password) => setPassword(password)}
                                value={password}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.95} style={{width:40, backgroundColor:"white", justifyContent:"center", alignItems:"center"}} onPress={() => setPass_visible(!pass_visible)}>
                            <Image source={pass_visible ? eyeno : eye} style={{width:24, height: 24}} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                    {error && <Text style={styles.errorText}>El correo electrónico o la contraseña son incorrectos.</Text>}

                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setPasswordModal(true)}>
                        <Text style={styles.forgotPasswordButtonText}>Olvidé la contraseña</Text>
                    </TouchableOpacity>

                    {!loading && 
                    <TouchableOpacity style={styles.positiveButton} onPress={() => onPressSubmit(email, password)}>
                        <Text style={styles.positiveButtonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    }
                    {loading  && 
                    <View style={styles.positiveButton} >
                        <ActivityIndicator color="white" size={20} />
                    </View>
                    }

                    {!loading  && 
                    <TouchableOpacity style={styles.negativeButton} onPress={onRegister}>
                        <Text style={styles.negativeButtonText}>Registrarse</Text>
                    </TouchableOpacity>
                    }

                    <View style={{height:20}} />

                </View>

            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={passwordModal}
                onRequestClose={() => {}}
            >

            </Modal>

        </Modal>
    )

}


const styles = StyleSheet.create({
    
    container: {flex: 1, backgroundColor: 'rgba(10,10,40,0.8)', justifyContent: 'center', paddingHorizontal: 20,}, 
    inicio: {fontSize:25, color: "#333"},
    signInContainer: {backgroundColor: "white", paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
    signInTitleText: {fontSize: 20, color: "#657272", fontFamily: "RobotoB", marginBottom: 20, textAlign: 'center'},
    imageContainer: { alignItems: 'center', flexDirection:"row", paddingBottom: 30 },

    titleContainer: { marginVertical: 2, marginLeft:5},
    titleText: { fontSize: 16, color: "#444", fontFamily: "RobotoB" },

    forgotPasswordButton: {padding: 10, alignItems: 'center',},
    forgotPasswordButtonText: {fontSize: 18, color: "#1B42CB", fontFamily: "Roboto" },

    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:6, borderWidth:1, borderColor: "#ddd"},
    inputText: { color: "#657272", fontSize: 16, paddingVertical: 8, fontFamily: "Roboto" },

    positiveButton: { padding: 13, backgroundColor: "#1B42CB", alignItems: 'center', marginVertical: 20, borderRadius: 6, marginHorizontal:20 },
    positiveButtonText: { fontSize: 18, color: "white", fontFamily: "RobotoB" },

    negativeButton: { padding: 12, alignItems: 'center', borderRadius: 6, marginHorizontal:20, borderWidth:1, borderColor:"#1B42CB" },
    negativeButtonText: { fontSize: 18, color: "#1B42CB"},

    errorText: {fontSize: 16, color: "#FF1412", alignSelf: 'center', textAlign: 'center', fontFamily: "Roboto"},
})
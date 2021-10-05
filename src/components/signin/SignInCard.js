import React, { useState, } from "react";
import { View, TouchableOpacity, Text, TextInput, Modal, StyleSheet, Alert, Image } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import { PasswordRecoveryForm } from "../../components/profile/PasswordRecoveryForm";

const eye = require("../../../assets/icons/eye.png")
const eyeno = require("../../../assets/icons/eye-no.png")
const volver = require('../../../assets/icons/times.png')

export const SignInCard = (props) =>
{
    const { navigation, visible = false, onSubmit = () => {}, onCancel = () => {}, error = false,} = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pass_visible, setPass_visible] = useState(true);
    const [passwordModal, setPasswordModal] = useState(false);
    

    onPressSubmit = (email, password) =>
    {
        if(email != '' && password != '') onSubmit(email, password)
        else Alert.alert('Atención', 'Dejaste uno o más campos vacíos.');
    }

    onPressSignUp = () =>
    {
        onCancel()
        navigation.navigate('SignUpFromCard')
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
                            placeholderTextColor={COLORS._A5A5A5}
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
                                placeholderTextColor={COLORS._A5A5A5}
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

                    <TouchableOpacity style={styles.positiveButton} onPress={() => onPressSubmit(email, password)}>
                        <Text style={styles.positiveButtonText}>Iniciar sesión</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.negativeButton} onPress={() => onPressSignUp()}>
                        <Text style={styles.negativeButtonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <View style={{height:20}} />

                </View>

            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={passwordModal}
                onRequestClose={() => {}}
            >
                <PasswordRecoveryForm onClose={() => setPasswordModal(false)} />
            </Modal>

        </Modal>
    )

}


const styles = StyleSheet.create({
    
    container: {flex: 1, backgroundColor: COLORS.MAIN_BLUE_80, justifyContent: 'center', paddingHorizontal: 20,}, 
    inicio: {fontSize:25, color: "#333"},
    signInContainer: {backgroundColor: COLORS._FFFFFF, paddingHorizontal: 20, paddingVertical: 15, borderRadius: 10 },
    signInTitleText: {fontSize: 20, color: COLORS._657272, fontFamily: FONTS.BOLD, marginBottom: 20, textAlign: 'center'},
    imageContainer: { alignItems: 'center', flexDirection:"row", paddingBottom: 30 },

    titleContainer: { marginVertical: 2, marginLeft:5},
    titleText: { fontSize: 16, color: "#444", fontFamily: FONTS.BOLD },

    forgotPasswordButton: {padding: 10, alignItems: 'center',},
    forgotPasswordButtonText: {fontSize: 18, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR },

    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:6, borderWidth:1, borderColor: "#ddd"},
    inputText: { color: COLORS._657272, fontSize: 16, paddingVertical: 8, fontFamily: FONTS.REGULAR },

    positiveButton: { padding: 13, backgroundColor: COLORS._1B42CB, alignItems: 'center', marginVertical: 20, borderRadius: 6, marginHorizontal:20 },
    positiveButtonText: { fontSize: 18, color: COLORS._FFFFFF, fontFamily: FONTS.BOLD },

    negativeButton: { padding: 12, alignItems: 'center', borderRadius: 6, marginHorizontal:20, borderWidth:1, borderColor:COLORS._1B42CB },
    negativeButtonText: { fontSize: 18, color: COLORS._1B42CB},

    errorText: {fontSize: 16, color: COLORS._FF1412, alignSelf: 'center', textAlign: 'center', fontFamily: FONTS.REGULAR},
})
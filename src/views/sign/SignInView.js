import React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, ScrollView, Dimensions, Modal, Alert, DeviceEventEmitter } from "react-native";
import { COLORS, SIGNIN_EVENT, FONTS } from "../../utils/constants";
import { API } from "../../services/service";
import { SafeAreaView } from 'react-navigation';
import { FullScreenLoading } from "../../components/loading/FullScreenLoading";
import { PasswordRecoveryForm } from "../../components/profile/PasswordRecoveryForm";

const eye = require("../../../assets/icons/eye.png")
const eyeno = require("../../../assets/icons/eye-no.png")
const volver = require('../../../assets/icons/volver.png')
const logo = require('../../../assets/la_economia_h.png')


export default class SignIn extends React.Component
{
    state = 
    {
        loading: false,
        passwordRecoveryVisible: false,
        pass_visible: false,
        email: '',
        password: ''
    }


    signIn = async () =>
    {
        let msg = '';

        if(this.state.email == '' || this.state.password == '')
        {
            msg = 'El correo electrónico y la contraseña no pueden estar vacíos.'
        }
        else
        {
            this.setState({loading: true})
            const res = await API.POST.PerformSignIn(this.state.email, this.state.password)

            if(!res.error)
            {   
                DeviceEventEmitter.emit(SIGNIN_EVENT, {credentials: {email: this.state.email, password: this.state.password}, session:{token: res.message.data.auth_token, email: res.message.data.email, name: res.message.data.nombres, document: res.message.data.nit}})
                //await RegisterForPushNotificationsAsync(this.state.email)
                this.setState({loading: false})
                this.props.navigation.navigate('Home')
            }
            else
            {
                this.setState({loading: false})
                msg = 'El correo electrónico o la contraseña son incorrectos.';
            }
        }

        if(msg != '')
        {
            Alert.alert('Atención', msg)
        }
    }


    render()
    {


        return(
            <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>


                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Home")} style={{marginLeft:17, width:35, height:35, borderRadius:18, backgroundColor:"#ccc", alignItems:"center", justifyContent:"center"}}>
                        <Image source={volver} tintColor="#333" resizeMode='contain' style={{width:16, height:16}} />
                    </TouchableOpacity>
                    <View style={{flex:1, alignItems:"center"}}><Image style={{width: 150, height: 40}} resizeMode='contain' source={logo} /></View>
                    <View style={{width:60}}></View>
                </View>



                <View style={{paddingHorizontal:25, backgroundColor: "#f0f0f0", flex:1, justifyContent:"center"}}>

                    <Text style={styles.inicio}>Inicio de Sesión</Text>
                    <View style={styles.titleContainer}> 
                        <Text style={styles.titleText}>E-mail</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            autoCapitalize='none'
                            style={styles.inputStyle}
                            keyboardType='email-address'
                            onChangeText={(text) => this.setState({email: text})}
                            value={this.state.email}
                        />
                    </View>

                    <View style={{height:10}} />

                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>Contraseña</Text>
                    </View>
                    <View style={[styles.inputContainer, {flexDirection: "row"}]}>
                        <View style={{flex:1}}>
                            <TextInput
                                style={styles.inputStyle}
                                secureTextEntry={!this.state.pass_visible}
                                onChangeText={(text) => this.setState({password: text})}
                                value={this.state.password}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.95} style={{width:40, backgroundColor:"white", justifyContent:"center", alignItems:"center"}} onPress={() => this.setState({pass_visible: !this.state.pass_visible})}>
                            <Image source={this.state.pass_visible ? eyeno : eye} style={{width:24, height: 24}} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                    <View style={{height:10}} />

                    <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => this.setState({passwordRecoveryVisible: true})}>
                        <Text style={styles.forgotPasswordButtonText}>Olvidé la contraseña</Text>
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.signInButton} onPress={this.signIn.bind(this)}>
                        <Text style={styles.signInButtonText}>Iniciar sesión</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.signUpButton} onPress={() => this.props.navigation.navigate('SignUp')}>
                        <Text style={styles.signUpButtonText}>Registrarse</Text>
                    </TouchableOpacity>


                </View>

     

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.passwordRecoveryVisible}
                    onRequestClose={() => {}}
                >
                    <PasswordRecoveryForm onClose={() => this.setState({passwordRecoveryVisible: false})} />
                </Modal>


                {this.state.loading && <FullScreenLoading/>}

            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    inicio: {fontSize:25, textAlign:"center", marginBottom:30, paddingBottom: 7, marginHorizontal:20, color: "#333", borderBottomWidth: 0.5, borderColor: "#999"},
    imageContainer: { alignItems: 'center', flexDirection:"row", backgroundColor:"white", paddingBottom: 20, borderBottomColor:"#ccc", borderBottomWidth:1 },


    titleContainer: { marginVertical: 2, marginLeft:5},
    titleText: { fontSize: 16, color: "#444", fontFamily: FONTS.BOLD },
    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:6, borderWidth:1, borderColor: "#ddd"},
    inputStyle: { color: COLORS._657272, fontSize: 16, paddingVertical: 8, fontFamily: FONTS.REGULAR },

    signInButton: { padding: 13, backgroundColor: COLORS._1B42CB, alignItems: 'center', marginVertical: 20, borderRadius: 6, marginHorizontal:20 },
    signInButtonText: { fontSize: 18, color: COLORS._FFFFFF, fontFamily: FONTS.BOLD },
    
    signUpButton: { padding: 13, alignItems: 'center', borderRadius: 6, marginHorizontal:20, borderWidth:1, borderColor:COLORS._1B42CB },
    signUpButtonText: { fontSize: 18, color: COLORS._1B42CB},
    
    forgotPasswordButton: {padding: 10, alignItems: 'center',},
    forgotPasswordButtonText: {fontSize: 18, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR },

    goBackContainer: { padding: 10,},
    goBackImage: {width: 20, height: 20, tintColor: 'white'},
})

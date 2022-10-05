import React, {useState, useContext, useEffect }  from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TextInput, TouchableOpacity, Alert, Linking, StatusBar, SafeAreaView } from "react-native";
import Checkbox from '../components/Checkbox';
import { API } from '../services/services';
import  Button  from "../components/Button";
import { ValidateEmail } from '../utils/helper';

import { UtilitiesContext } from '../context/UtilitiesContext'

const volver = require('../../assets/icons/volver.png')
const logo = require('../../assets/la_economia_h.png')
const arrow_up = require('../../assets/icons/dropup_arrow.png')
const arrow_down = require('../../assets/icons/dropdown_arrow.png')

const Registro = ({navigation}) => {

    const [panelExpanded, setPanelExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [terms, setTerms] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [document, setDocument] = useState("")
    const [cellphone, setCellphone] = useState("")

    const { setUser } = useContext(UtilitiesContext)

    const vidaSanaSignUp = async (document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender) => {

        /*const vidaSanaRes = await VIDA_SANA_API.POST.PerformVidaSanaSignUp(this.location, document, { document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender }, "APP")

        this.setState({ loading: false })
        if (!vidaSanaRes.error) {
            Alert.alert('Felicidades', 'Se ha completado el proceso de registro.')
            navigation.navigate('Home')
        }
        else {
            Alert.alert('Atención', 'No se pudo completar tu registro en Vida Sana. ¿Desea volver a intentarlo?', [
                { text: 'Si', onPress: async () => { await this.vidaSanaSignUp(document, firstname, secondname, lastname, secondlastname, dateOfBirth, address, phone, cellphone, email, terms, gender) } },
                {
                    text: 'No', onPress: () => {
                        Alert.alert('Felicidades', "Se ha completado el proceso de registro.")
                        navigation.navigate('Home')
                    }
                },
            ])
        }*/
    }

    const login = async (email, password) => {
        
        if(email != '' && password != '') {

            setLoading(true)
            const res = await API.POST.signin(email + "::" + password)
            setLoading(false)
            if(!res.error && res.message.nit) {
                setUser({
                    logged: true,
                    nit: res.message.nit,
                    token: res.message.auth_token,
                    nombres: res.message.nombres,
                    email: res.message.email
                })
            }
        }
        else Alert.alert('Atención', "Debe llenar todos los campos");
    }

    const signUp = async () => {
     
        let msg = '';

        if (terms) {

            const checkFields = checkEmptyOrInvalidFields();

            if (checkFields.allFieldsAreCorrect === true) {
                setLoading(true)
                const res = await API.POST.SignUp({
                    email, 
                    nombres: name + " " + lastname,
                    nit: document,
                    fecha_nacimiento: '',
                    telefono: '',
                    celular: cellphone,
                    password: password,
                    confirm_password: confirmPassword,
                    acepta_condiciones: terms
                })
                setLoading(false)
        
                if (!res.error && res.message.success) {
                    await login(email, password)
                    Alert.alert('Felicidades', "Se ha completado el proceso de registro.")
                    navigation.navigate('Home')
                }
                else {
                    msg = res.message.message
                }
            } else {
                msg = "Uno o más campos son inválidos.";
            }
        } else {
            msg = "Para continuar con el registro debes aceptar políticas y términos de uso."
        }

        if (msg != '') {
            Alert.alert('Atención', msg)
        }
    }


    const checkEmptyOrInvalidFields = () => {
        const email_error = (email.trim() == '' || !ValidateEmail(email))
        const password_error = (password == '' || (password != confirmPassword))
        const name_error = (name.trim() == '');
        const lastname_error = (lastname.trim() == '');
        const cellphone_error = (cellphone.trim() == '');
        const document_error = (document.trim() == '');
        const allFieldsAreCorrect = (!email_error && !password_error && !name_error && !lastname_error && !cellphone_error && !document_error );

        return {
            allFieldsAreCorrect,
            email_error,
            password_error,
            name_error,
            lastname_error,
            cellphone_error,
            document_error,
        }
    }

    return (
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>

            <ScrollView>

                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft:17, width:35, height:35, borderRadius:18, backgroundColor:"white", alignItems:"center", justifyContent:"center", elevation: 10}}>
                        <Image source={volver} tintColor="#333" resizeMode='contain' style={{width:16, height:16}} />
                    </TouchableOpacity>
                    <View style={{flex:1, alignItems:"center"}}><Image style={{width: 150, height: 40}} resizeMode='contain' source={logo} /></View>
                    <View style={{width:60}}></View>
                </View>

    
                <View style={{paddingHorizontal:25, backgroundColor: "#f0f0f0"}}>


                    <View style={styles.sectionContainer}>

                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>DATOS BÁSICOS</Text>
                        </View>

                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Nombres'
                                placeholderTextColor={"#A5A5A5"}
                                style={styles.inputStyle}
                                onChangeText={text => setName(text)}
                                value={name}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Apellidos'
                                style={styles.inputStyle}
                                onChangeText={text => setLastname(text)}
                                value={lastname}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Cédula Ciudadanía'
                                keyboardType='numeric'
                                style={styles.inputStyle}
                                onChangeText={text => setDocument(text)}
                                value={document}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Correo Electrónico'
                                autoCapitalize='none'
                                style={styles.inputStyle}
                                keyboardType='email-address'
                                onChangeText={text => setEmail(text)}
                                value={email}
                            />
                        </View>

                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Contraseña'
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                onChangeText={text => setPassword(text)}
                                value={password}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='Repetir contraseña'
                                secureTextEntry={true}
                                style={styles.inputStyle}
                                onChangeText={text => setConfirmPassword(text)}
                                value={confirmPassword}
                            />
                        </View>


                        <View style={[styles.inputContainer, { borderColor: true ? styles.inputContainer.borderColor : "#DF0109" }]}>
                            <TextInput
                                placeholder='Teléfono Celular'
                                keyboardType='numeric'
                                style={styles.inputStyle}
                                onChangeText={text => setCellphone(text)}
                                value={cellphone}
                            />
                        </View>

                        

                    </View>


                    <View style={styles.termsContainer}>
                        <Checkbox checked={terms} onPress={() => setTerms(!terms)} />
                        <Text style={styles.termsText}>Acepto <Text style={styles.linkText} onPress={() => Linking.openURL("https://www.droguerialaeconomia.com/empresa/politicas")}>políticas y términos de uso</Text></Text>
                    </View>

                    {/*
                    <View style={styles.termsContainer}>
                        <Checkbox checked={this.state.vidaSana} color={COLORS._0A1E63} size={20} onPress={() => this.setState({ vidaSana: !this.state.vidaSana })} />
                        <Text style={styles.termsText}>Acepto ser parte del Club Vida Sana.</Text>
                    </View>*/}

                    <View style={styles.eticosPanelContainer}>
                        <TouchableOpacity style={styles.eticosPanelButton} onPress={() => setPanelExpanded(!panelExpanded)}>
                            <Text style={styles.eticosPanelButtonText}>Leer políticas de privacidad...</Text>
                            <Image style={styles.eticosPanelCollapseIcon} resizeMode='contain' source={panelExpanded ? arrow_up : arrow_down} />
                        </TouchableOpacity>

                        {panelExpanded &&
                        <View style={styles.eticosPanelExpanded}>
                            <Text style={styles.eticosPanelExpandedText}>ETICOS SERRANO GOMEZ LTDA le informa que los datos suministrados a traves de este sitio web seran tratados para efecto de gestionar la informacion que se requiere por usted de nuestra organizacion, peticion que conlleva el consentimiento de forma inequivoca para el tratamiento de sus datos en el sentido antes dicho. Le rogamos abstenerse de suministrar informacion de caracter sensible, si no es absolutamente necesario para resolver su inquietud. Puede consultar la politica de Proteccion de datos de ETICOS en el siguiente enlace web <Text style={styles.linkText} onPress={() => Linking.openURL("https://www.droguerialaeconomia.com/empresa/habeas")}>www.droguerialaeconomia.com/empresa/habeas</Text> y ejecer sus derechos a conocer, actualizar, rectificar su informacion, o bien solicitar la cancelacion del proceso en el siguiente correo electronico <Text style={styles.linkText} onPress={() => Linking.openURL(`mailto:habeasdata@eticos.com`)}>habeasdata@eticos.com</Text>.</Text>
                        </View>
                        }
                    </View>

                    <View style={{height:40}} />

                    
                    <Button styleMode='blue' title="REGISTRARME" loading={loading} onPress={() => signUp()} />
                    

                    <View style={{height:60}} />
                    
                </View>


            </ScrollView>




        </SafeAreaView>

    )
    
}

export default Registro

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white", paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },

    imageContainer: { alignItems: 'center', flexDirection:"row", backgroundColor:"white", paddingBottom: 20, borderBottomColor:"#ccc", borderBottomWidth:1 },


    sectionContainer: { width: '100%', marginVertical: 15 },
    titleContainer: { marginVertical: 10, width: '100%' },
    titleText: { fontSize: 14, color: "#444", fontFamily: "RobotoB" },
    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:6, borderWidth:1, borderColor: "#ddd"},
    inputStyle: { color: "#657272", fontSize: 16, paddingVertical: 8, fontFamily: "Roboto" },

    locationSectionContainer: { width: '100%', borderBottomWidth: 1, borderBottomColor: "#B2C3C3", marginVertical: 2, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, alignItems: 'center' },
    locationText: { color: "#A5A5A5", backgroundColor: "#FFFFFF", fontSize: 18, fontFamily: "Roboto" },
    locationImage: { width: 10, height: 10, },

    datePickerContainer: { width: '100%', margin: 10, justifyContent: 'flex-start', },
    datePickerInputStyle: { width: '100%', color: "#657272", backgroundColor: "#FFFFFF", fontSize: 18, paddingVertical: 10, alignItems: 'flex-start', borderWidth: 0, fontFamily: "Roboto" },
    datePickerPlaceholderText: { fontSize: 18, color: "#A5A5A5", fontFamily: "Roboto" },
    datePickerText: { fontSize: 18, color: "#657272", fontFamily: "Roboto" },

    termsContainer: { margin: 20, marginLeft:10, alignItems: 'center', flexDirection: 'row' },
    termsText: { fontSize: 16, color: "#666", margin: 10, fontFamily: "Roboto" },

    signUpButton: { padding: 13, backgroundColor: "#1B42CB", alignItems: 'center', marginVertical: 15, borderRadius: 6, marginHorizontal:10 },
    signUpButtonText: { fontSize: 18, color: "#FFFFFF", fontFamily: "RobotoB" },

    linkText: { color: "#1111A0", fontFamily: "Roboto", textDecorationLine:"underline"  },

    eticosPanelContainer: { width: '100%', padding: 20, borderWidth: 1, borderColor: "#bbb", borderRadius: 6, backgroundColor: "#fffee0" },
    eticosPanelButton: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eticosPanelButtonText: { fontSize: 16, color: "#555", fontFamily: "Roboto" },
    eticosPanelCollapseIcon: { width: 15, height: 15 },
    eticosPanelExpanded: { width: '100%', marginVertical: 10 },
    eticosPanelExpandedText: { fontSize: 16, color: "#666", fontFamily: "Roboto", textAlign:"justify", lineHeight:24 },

})
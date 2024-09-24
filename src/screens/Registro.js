import React, {useState, useContext, useEffect }  from 'react';
import { View, Image, ScrollView, Text, TextInput, TouchableOpacity, Alert, Linking, SafeAreaView } from "react-native";
import { API } from '../services/services';
import  Button  from "../components/Button";
import  Title  from "../components/Title";
import { styles } from '../global/styles';
import { UtilitiesContext } from '../context/UtilitiesContext'
import BouncyCheckbox from "react-native-bouncy-checkbox";

const arrow_up = require('../../assets/icons/dropup_arrow.png')
const arrow_down = require('../../assets/icons/dropdown_arrow.png')
const eye = require("../../assets/icons/eye.png")
const eyeno = require("../../assets/icons/eye-no.png")

const ValidateEmail = (email) =>
{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const Registro = ({navigation}) => {

    const [panelExpanded, setPanelExpanded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [terms, setTerms] = useState(false)
    const [pass_visible, setPass_visible] = useState(true);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [lastname, setLastname] = useState("")
    const [document, setDocument] = useState("")
    const [cellphone, setCellphone] = useState("")

    const { setUser } = useContext(UtilitiesContext)

    const login = async (email, password) => {
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
            
            <View style={{paddingHorizontal:10, borderBottomWidth: 2, borderColor: "#ddd"}}>
                <Title title="Crear una cuenta" onBack={() => navigation.goBack()} />
            </View>
            
            <ScrollView>

                <View style={{paddingHorizontal:25, paddingVertical:20}}>

                    <Text style={_styles.titleText}>DATOS BÁSICOS</Text>

                    <View style={[_styles.inputContainer, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                        <TextInput
                            editable={!loading}
                            placeholder='Nombres'
                            placeholderTextColor={"#A5A5A5"}
                            style={_styles.input}
                            onChangeText={text => setName(text)}
                            value={name}
                        />
                    </View>

                    <View style={[_styles.inputContainer, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                        <TextInput
                            editable={!loading}
                            placeholder='Apellidos'
                            style={_styles.input}
                            onChangeText={text => setLastname(text)}
                            value={lastname}
                        />
                    </View>

                    <View style={[_styles.inputContainer, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                        <TextInput
                            editable={!loading}
                            placeholder='Cédula Ciudadanía'
                            keyboardType='numeric'
                            style={_styles.input}
                            onChangeText={text => setDocument(text)}
                            value={document}
                        />
                    </View>

                    <View style={[_styles.inputContainer, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                        <TextInput
                            editable={!loading}
                            placeholder='Correo Electrónico'
                            autoCapitalize='none'
                            style={_styles.input}
                            keyboardType='email-address'
                            onChangeText={text => setEmail(text)}
                            value={email}
                        />
                    </View>

                    <View style={[_styles.inputContainer, {flexDirection: "row"}, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                
                        <View style={{flex:1}}>
                            <TextInput
                                editable={!loading}
                                placeholder='Contraseña'
                                secureTextEntry={pass_visible}
                                style={_styles.input}
                                onChangeText={text => {setPassword(text); setConfirmPassword(text)}}
                                value={password}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.95} style={{width:40, justifyContent:"center", alignItems:"center"}} onPress={() => setPass_visible(!pass_visible)}>
                            <Image source={pass_visible ? eyeno : eye} style={{width:24, height: 24}} resizeMode="contain" />
                        </TouchableOpacity>
                      
                    </View>

                    <View style={[_styles.inputContainer, { borderColor: true ? _styles.inputContainer.borderColor : "#DF0109" }]}>
                        <TextInput
                            editable={!loading}
                            placeholder='Teléfono Celular'
                            keyboardType='numeric'
                            style={_styles.input}
                            onChangeText={text => setCellphone(text)}
                            value={cellphone}
                        />
                    </View>

                    <View style={{height:20}} />
                    <Text style={_styles.titleText}>TÉRMINOS Y CONDICIONES</Text>

                    <View style={_styles.termsContainer}>

                        <BouncyCheckbox
                            size={26}
                            fillColor="#333"
                            unfillColor="white"
                            iconStyle={{ borderColor: "#999", borderRadius: 8 }}
                            innerIconStyle={{ borderWidth: 1, borderRadius: 8 }}
                            onPress={isChecked => setTerms(isChecked)}
                        />
                        <Text style={_styles.termsText}>Acepto</Text>
                        <Text style={_styles.linkButton} onPress={() => Linking.openURL("https://www.droguerialaeconomia.com/empresa/politicas")}>políticas y términos de uso</Text>
                    </View>

                    <View style={_styles.eticosPanelContainer}>
                        <TouchableOpacity style={_styles.eticosPanelButton} onPress={() => setPanelExpanded(!panelExpanded)}>
                            <Text style={_styles.eticosPanelButtonText}>{panelExpanded ? "" : "Ver políticas de privacidad..."}</Text>
                            <Image style={_styles.eticosPanelCollapseIcon} resizeMode='contain' source={panelExpanded ? arrow_up : arrow_down} />
                        </TouchableOpacity>

                        {panelExpanded &&
                        <View style={_styles.eticosPanelExpanded}>
                            <Text style={_styles.eticosPanelExpandedText}>ETICOS SERRANO GOMEZ LTDA. le informa que los datos suministrados a traves de este sitio web seran tratados para efecto de gestionar la informacion que se requiere por usted de nuestra organizacion, peticion que conlleva el consentimiento de forma inequivoca para el tratamiento de sus datos en el sentido antes dicho. Le rogamos abstenerse de suministrar informacion de caracter sensible, si no es absolutamente necesario para resolver su inquietud. Puede consultar la politica de Proteccion de datos de ETICOS en el siguiente enlace web <Text style={_styles.linkText} onPress={() => Linking.openURL("https://www.droguerialaeconomia.com/empresa/habeas")}>www.droguerialaeconomia.com/empresa/habeas</Text> y ejecer sus derechos a conocer, actualizar, rectificar su informacion, o bien solicitar la cancelacion del proceso en el siguiente correo electronico <Text style={_styles.linkText} onPress={() => Linking.openURL(`mailto:habeasdata@eticos.com`)}>habeasdata@eticos.com</Text>.</Text>
                        </View>
                        }
                    </View>

                    <View style={{height:40}} />

                    <View style={{marginHorizontal:30}}>
                        <Button title="REGISTRARME" loading={loading} onPress={() => signUp()} />
                    </View>

                    <View style={{height:30}} />
                    
                </View>


            </ScrollView>




        </SafeAreaView>

    )
    
}

export default Registro

const _styles = {


    titleText: { marginVertical: 10, fontSize: 14, color: "#444", fontFamily: "Tommy" },

    inputContainer: { marginVertical: 7, paddingHorizontal:10, backgroundColor: "white", borderRadius:25, borderWidth:1, borderColor: "#ddd"},
    input: { color: "#444", fontSize: 16, paddingVertical: 5, paddingLeft: 5, fontFamily: "TommyR" },

    termsContainer: { marginTop:5, marginBottom: 25, alignItems: 'center', flexDirection: 'row' },
    termsText: { fontSize: 16, color: "#666", marginRight: 8, fontFamily: "TommyR" },


    linkText: { color: "#1111A0", fontFamily: "Roboto", textDecorationLine:"underline"  },
    linkButton: {fontSize: 15, color: "#464646", fontFamily: "Tommy", textAlign:"center", backgroundColor:"#f2f2f2" , paddingVertical:7, paddingHorizontal:10, borderRadius:20},

    eticosPanelContainer: { width: '100%', padding: 15, borderRadius: 10, backgroundColor: "#ffeecc" },
    eticosPanelButton: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eticosPanelButtonText: { fontSize: 16, color: "#555", fontFamily: "Roboto" },
    eticosPanelCollapseIcon: { width: 15, height: 15, tintColor: "#222" },
    eticosPanelExpanded: { width: '100%', marginVertical: 10 },
    eticosPanelExpandedText: { fontSize: 16, color: "#666", fontFamily: "Roboto", textAlign:"justify", lineHeight:24 },

}
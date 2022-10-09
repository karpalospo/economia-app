import React, { useState, useContext} from "react";
import { View, TouchableOpacity, Text, TextInput, Modal, Image } from "react-native";
import { API } from "../services/services";
import { UtilitiesContext } from '../context/UtilitiesContext'
import Title from "./Title";
import Button from "../components/Button";
import { styles } from '../global/styles';

const eye = require("../../assets/icons/eye.png")
const eyeno = require("../../assets/icons/eye-no.png")


const Login = ({ onRegister = () => {}, onLogin = () => {}, visible = false, onCancel = () => {}}) =>
{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pass_visible, setPass_visible] = useState(true);
    const [passwordModal, setPasswordModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { setUser } = useContext(UtilitiesContext)

    const login = async () => {
        
        if(email != '' && password != '') {

            setLoading(true)
            setError("")
            const res = await API.POST.signin(email + "::" + password)
            setLoading(false)
            setPassword("")
            if(res.message.success == false) {
                setError("El correo electrónico o la contraseña son incorrectos.")
            } else if(res.message.nit) {
                setEmail("")
                setUser({
                    logged: true,
                    nit: res.message.nit,
                    token: res.message.auth_token,
                    nombres: res.message.nombres,
                    email: res.message.email
                })
                onLogin()
            }
        }
        else setError("Debe llenar todos los campos");
    }

    const _onCancel = () => {
        setEmail("")
        setPassword("")
        setError("")
        onCancel()
    }

    return(
        <Modal
            animationType='fade'
            visible={visible}
            transparent={true}
            onRequestClose={() => {}}
        >
            
            <View style={styles.containerTrans}>

                <View style={_styles.loginContainer}>
                    
                    <Title title="Iniciar Sesión" onCancel={_onCancel} />

                    <View style={{height:20}} />

                    <Text style={_styles.label}>Correo Electrónico</Text>
                    <View style={_styles.inputContainer}>
                        <TextInput 
                            editable={!loading}
                            style={_styles.input}
                            autoCapitalize='none'
                            keyboardType='email-address'
                            onChangeText={(email) => setEmail(email)}
                            value={email}
                        />
                    </View>

           
                    <Text style={_styles.label}>Contraseña</Text>
                    <View style={[_styles.inputContainer, {flexDirection: "row"}]}>
                        <View style={{flex:1}}>
                            <TextInput
                                editable={!loading}
                                style={_styles.input}
                                autoCapitalize='none'
                                secureTextEntry={pass_visible}
                                onChangeText={(password) => setPassword(password)}
                                value={password}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.95} style={{width:40, justifyContent:"center", alignItems:"center"}} onPress={() => setPass_visible(!pass_visible)}>
                            <Image source={pass_visible ? eyeno : eye} style={{width:24, height: 24}} resizeMode="contain" />
                        </TouchableOpacity>
                    </View>

                    {error != "" && <Text style={_styles.errorText}>{error}</Text>}

                    
                    <View style={{height:20}} />
                    <Button loading={loading} title="INICIAR SESIÓN" onPress={() => login()} buttonStyle={{minWidth:250}} />
                    
                    {loading && <View style={{height:30}} />}
                    {!loading  && 
                    <View style={{marginVertical:20}}>
                        <TouchableOpacity style={_styles.button} onPress={() => setPasswordModal(false)}>
                            <Text style={_styles.buttonText}>Olvidé mi contraseña</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.rowLeft, _styles.button]} onPress={onRegister}>
                            <Text style={_styles.buttonText}>Crear una cuenta nueva</Text>
                        </TouchableOpacity>
                    </View>
                    }

                    
    
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

export default Login

const _styles = {
    
    loginContainer: { 
        width:"100%",
        alignItems: 'center', 
        backgroundColor: 'white', 
        borderRadius: 10, borderWidth: 1, 
        borderColor:"#eee",
        marginHorizontal:10
    },

    inicio: {fontSize:25, color: "#333"},
    signInTitleText: {fontSize: 20, color: "#657272", fontFamily: "RobotoB", marginBottom: 20, textAlign: 'center'},
    imageContainer: { alignItems: 'center', flexDirection:"row", paddingBottom: 30 },

    titleContainer: { marginVertical: 2, marginLeft:5},
    label: { fontSize: 16, color: "#444", fontFamily: "TommyR", width:"80%", textAlign:"left" },

    button: {marginVertical: 8},
    buttonText: {fontSize: 16, color: "#464646", fontFamily: "Tommy", textAlign:"center", backgroundColor:"#f2f2f2" , paddingVertical:7, paddingHorizontal:20, borderRadius:20},

    inputContainer: { marginVertical: 5, paddingHorizontal:10, backgroundColor: "white", borderRadius:25, borderWidth:1, borderColor: "#ddd", width:"85%"},
    input: { color: "#444", fontSize: 16, paddingVertical: 8, fontFamily: "TommyR" },

    errorText: {
        fontSize: 14,
        paddingHorizontal: 15,
        width: "85%",
        color: "#FF4455", 
        alignSelf: 'center', 
        textAlign: 'left', 
        fontFamily: "Roboto", 
        marginTop: 10,
        borderWidth: 1,
        paddingVertical: 5,
        borderColor: "#FFaaaa",
        borderRadius: 8
    },
}
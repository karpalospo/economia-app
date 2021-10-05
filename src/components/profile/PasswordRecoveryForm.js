import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import { ValidateEmail } from "../../utils/helper";
import { FullWidthLoading } from "../loading/FullWidthLoading";
import { API } from "../../services/service";

export const PasswordRecoveryForm = props => {

    const {onClose} = props

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [code, setCode] = useState(false)
    const [codigo, setCodigo] = useState("")
    const [pass1, setPass1] = useState("")
    const [pass2, setPass2] = useState("")

    const onPressSubmit = async () => 
    {
        if(!ValidateEmail(email))
        {
            Alert.alert('Atención', 'El correo electrónico no es válido.')
        }
        else
        {
            setLoading(true)
            const res = await API.POST.checkEmail(email)
            setLoading(false)

            if(!res.error)
            {
                setCode(true)
            }
        }

    }


    const onPressSubmit2 = async () => 
    {

        if(codigo == "" || codigo.length < 6)  return Alert.alert('Atención', 'EL código ingresado no es válido.')
        if(pass1 == "" || pass1.length < 4)  return Alert.alert('Atención', 'La contraseña no es válida. Ingrese mas caracteres.')
        if(pass1 !== pass2)  return Alert.alert('Atención', 'Las contraseñas no coinciden.')
     
        
        setLoading(true)
            const res = await API.POST.cambiarContrasena(email, codigo, pass1)
        setLoading(false)

        if(!res.error && res.message.success)
        {
            Alert.alert('Cambiar Contraseña', 'Contraseña actualizada correctamente.')
            onClose()
        } else {
            setCodigo("")
            Alert.alert('Atención', res.message.message)
        }
        

    } 


    return(
        <View style={styles.container}>

            {code ?

            <View>
                <View style={styles.formContainer}>

                    <Text style={styles.titleText}>Revise en todas las carpetas de entrada de su correo el código que le acabamos de enviar</Text>

                <TextInput 
                    placeholder='Código'
                    placeholderTextColor={COLORS._A5A5A5}
                    style={styles.inputText}
                    autoCapitalize='none'
                    keyboardType='numeric'
                    maxLength={6}
                    onChangeText={(value) => setCodigo(value)}
                    value={codigo}
                />
                
                <TextInput 
                    placeholder='Nuevo Password'
                    placeholderTextColor={COLORS._A5A5A5}
                    style={styles.inputText}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={(value) => setPass1(value)}
                    value={pass1}
                />

                <TextInput 
                    placeholder='Repita Password'
                    placeholderTextColor={COLORS._A5A5A5}
                    style={styles.inputText}
                    autoCapitalize='none'
                    secureTextEntry={true}
                    onChangeText={(value) => setPass2(value)}
                    value={pass2}
                />

                <TouchableOpacity disabled={loading} style={styles.positiveButton} onPress={() => onPressSubmit2()}>
                    {!loading && <Text style={styles.positiveButtonText}>Continuar</Text>}
                    {loading && <FullWidthLoading style={styles.loadingContainer} size='small' color={COLORS._FFFFFF} />}
                </TouchableOpacity>

                <TouchableOpacity disabled={loading} style={styles.negativeButton} onPress={onClose}>
                    <Text style={styles.negativeButtonText}>Cancelar</Text>
                </TouchableOpacity>
                </View>
            </View>
            :
            <View style={styles.formContainer}>

                
                <Text style={styles.titleText}>Enviaremos a su correo eléctronico registrado un código que le permitirá establecer una nueva contraseña</Text>

                <View style={{height:15}} />
                <TextInput 
                    placeholder='Correo Electrónico'
                    placeholderTextColor={COLORS._A5A5A5}
                    style={styles.inputText}
                    autoCapitalize='none'
                    keyboardType='email-address'
                    onChangeText={(email) => setEmail(email)}
                    value={email}
                />
                <View style={{height:15}} />
                <TouchableOpacity disabled={loading} style={styles.positiveButton} onPress={() => onPressSubmit()}>
                    {!loading && <Text style={styles.positiveButtonText}>Continuar</Text>}
                    {loading && <FullWidthLoading style={styles.loadingContainer} size='small' color={COLORS._FFFFFF} />}
                </TouchableOpacity>

                <TouchableOpacity disabled={loading} style={styles.negativeButton} onPress={onClose}>
                    <Text style={styles.negativeButtonText}>Cancelar</Text>
                </TouchableOpacity>

            </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {width: '100%', height: '100%', paddingHorizontal: 15, backgroundColor: COLORS.MAIN_BLUE_80, justifyContent: 'center',},
    formContainer: { width: '100%', backgroundColor: COLORS._FFFFFF, padding: 25, alignItems: 'center', borderRadius: 10, },

    titleText: { fontSize: 17, color: "#444"},
    inputText: {fontSize: 16, paddingVertical: 8, paddingHorizontal:10, borderWidth: 1, borderColor: COLORS._A5A5A5, marginBottom: 10, width: '100%', fontFamily: FONTS.REGULAR, borderRadius: 6},
    
    positiveButton: {borderRadius: 10, backgroundColor: COLORS._1B42CB, padding: 15, minWidth:250, alignItems: 'center', marginTop: 10},
    positiveButtonText: {fontSize: 18, color: COLORS._FFFFFF, fontFamily: FONTS.BOLD},

    negativeButton: {borderRadius: 10, borderColor: COLORS._1B42CB, borderWidth: 1, padding: 13, minWidth:250, alignItems: 'center', marginTop: 10},
    negativeButtonText: {fontSize: 18, color: COLORS._1B42CB},

    loadingContainer: {width: '100%', alignItems: 'center'},
})

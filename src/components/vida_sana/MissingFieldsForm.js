import React, {useState} from 'react'
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import Checkbox from '../checkbox/Checkbox'
import { COLORS, FONTS } from '../../utils/constants'


export const MissingFieldsForm = props =>
{
    const {onAccept, onCancel} = props

    const [address, setAddress] = useState('')
    const [gender, setGender] = useState(true)

    const onSubmit = () => 
    {
        if(address.trim() == '')
        {
            Alert.alert('Atención', 'La dirección no puede estar vacía.')
        }
        else
        {
            onAccept(address, gender)
        }
    }

    return (
        <View style={styles.vidaSanaFormWrapper}>
            <View style={styles.vidaSanaFormContainer}>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Completa la siguiente información</Text>
                </View>

                <TextInput
                    placeholder = 'Dirección'
                    placeholderTextColor = {COLORS._A5A5A5}
                    style={styles.inputVidaSanaFormStyle}
                    onChangeText={(_address) => setAddress(_address)}
                    value={address}
                />

                <Text style={styles.checkboxTitleText}>Género</Text>

                <View style={styles.checkboxContainer}>
                    <Checkbox checked={gender} color={COLORS._0A1E63} size={20} onPress={() => setGender(!gender)}/>
                    <Text style={styles.checkboxText}>Masculino</Text>
                </View>

                <View style={styles.checkboxContainer}>
                    <Checkbox checked={!gender} color={COLORS._0A1E63} size={20} onPress={() => setGender(!gender)}/>
                    <Text style={styles.checkboxText}>Femenino</Text>
                </View>

                <TouchableOpacity style={styles.vidaSanaPositiveButton} onPress = {onSubmit.bind(this)}>
                    <Text style={styles.vidaSanaPositiveButtonText}>Aceptar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.vidaSanaNegativeButton} onPress = {onCancel}>
                    <Text style={styles.vidaSanaNegativeButtonText}>Cancelar</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    vidaSanaFormWrapper: {width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.MAIN_BLUE_80},
    vidaSanaFormContainer: {width: '80%', backgroundColor: COLORS._FFFFFF, padding: 15, borderRadius: 10},
    titleContainer: {width: '100%', alignItems: 'center'},
    titleText: {fontSize: 20, color: COLORS._657272, textAlign: 'center', fontFamily: FONTS.BOLD},

    inputVidaSanaFormStyle: {width: '100%', color: COLORS._657272, backgroundColor: COLORS._FFFFFF, fontSize: 18, paddingVertical: 10, marginVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS._B2C3C3, fontFamily: FONTS.REGULAR},

    checkboxTitleText: {fontSize: 18, color: COLORS._657272, fontFamily: FONTS.REGULAR},
    checkboxContainer: {marginVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'center'},
    checkboxText: {fontSize: 15, color: COLORS._A5A5A5, marginHorizontal: 10, fontFamily: FONTS.REGULAR},

    vidaSanaPositiveButton: { width: '100%', padding: 15, borderRadius: 25, backgroundColor: COLORS._1B42CB, marginBottom: 10, alignItems: 'center'},
    vidaSanaPositiveButtonText: { fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR },  
    vidaSanaNegativeButton: { width: '100%', padding: 10, borderRadius: 25, backgroundColor: COLORS.NO_COLOR, alignItems: 'center'},
    vidaSanaNegativeButtonText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR }, 

})
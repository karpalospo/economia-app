import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet, Modal, Alert } from "react-native";
import DatePicker from 'react-native-datepicker';

import { COLORS, INPUT_TYPE, FONTS } from '../../utils/constants';
import { ToISODateString, ValidateEmail } from '../../utils/helper';
import { CustomDatePicker } from '../date/CustomDatePicker';

export const InputCard = (props) => 
{
    const {visible = false, inputKey = '', placeholder = '', maxLength = 50, inputType = INPUT_TYPE.INPUT, onSubmit, onCancel} = props;

    const [input, setInput] = useState('');
    const [passwordRepeatInput, setPasswordRepeatInput] = useState('');

    useEffect(() => {
        setInput('')
    }, [inputKey])


    const onSubmitInput = () => 
    {
        if(input == '')
        {
            Alert.alert('Atención', 'El campo no puede estar vacío.')
        }
        else if(inputType == INPUT_TYPE.PASSWORD && input != passwordRepeatInput)
        {
            Alert.alert('Atención', 'Las contraseñas no coinciden.')
        }
        else if(inputType == INPUT_TYPE.EMAIL && !ValidateEmail(input))
        {
            Alert.alert('Atención', 'El correo electrónico es inválido.')
        }
        else
        {
            onSubmit(input, inputKey)
        }
    }


    const renderForm = () => 
    {
        let renderedInput = null;

        switch (inputType) {
            case INPUT_TYPE.INPUT:
            case INPUT_TYPE.EMAIL:
                renderedInput = (<TextInput 
                            placeholder={placeholder}
                            placeholderTextColor={COLORS._A5A5A5}
                            style={styles.cardInputText}
                            autoCapitalize='none'
                            onChangeText={(input) => setInput(input)}
                            maxLength={maxLength}
                            value={input}
                        />);
                break;

            case INPUT_TYPE.PASSWORD:
                renderedInput = (<View style={styles.cardInputWrapper}>

                            <TextInput 
                                placeholder={'Nueva contraseña'}
                                placeholderTextColor={COLORS._A5A5A5}
                                style={styles.cardInputText}
                                secureTextEntry={true}
                                onChangeText={(input) => setInput(input)}
                                maxLength={maxLength}
                                value={input}
                            />
                            <TextInput 
                                placeholder={'Repetir contraseña'}
                                placeholderTextColor={COLORS._A5A5A5}
                                style={styles.cardInputText}
                                secureTextEntry={true}
                                onChangeText={(passwordRepeatInput) => setPasswordRepeatInput(passwordRepeatInput)}
                                maxLength={maxLength}
                                value={passwordRepeatInput}
                            />

                        </View>
                    );
                break;
            
            case INPUT_TYPE.DATE:
                renderedInput = (
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateText}>Fecha de nacimiento</Text>
                        <CustomDatePicker onChangeDate={(date) => setInput(date)} />
                    </View>
                );
                break;
        
            
        }

        return renderedInput;

    }


    return (
        <Modal 
            transparent={true}
            visible={visible}
            animationType='slide'
            onRequestClose = {() => {}}
        >
            <View style={styles.container}>
                <View style = {styles.cardContainer}>
                    <Text style={styles.cardTitleText}>{inputType == INPUT_TYPE.PASSWORD ? 'Cambiar contraseña' : ''}</Text>

                    {renderForm()}

                    <TouchableOpacity style={styles.positiveButton} onPress={onSubmitInput.bind(this)}>
                        <Text style={styles.positiveButtonText}>Actualizar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.negativeButton} onPress={onCancel}>
                        <Text style={styles.negativeButtonText}>Cancelar</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    
    container: {flex: 1, backgroundColor: COLORS.WHITE_60, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15},
    inputContainer: { width: '100%', borderBottomWidth: 1, borderBottomColor: COLORS._B2C3C3, marginVertical: 2, },
    dateText: { color: COLORS._A5A5A5, backgroundColor: COLORS._FFFFFF, fontSize: 18, fontFamily: FONTS.REGULAR },

    cardContainer: {width: '100%', backgroundColor: COLORS._FFFFFF, borderRadius: 12, padding: 20, alignItems: 'center', elevation: 5, shadowColor: COLORS._BABABA, shadowOpacity: 8, shadowRadius: 5, shadowOffset: {height: 5, width: 5} },
    cardInputWrapper: {width: '100%'},
    cardTitleText: {fontSize: 22, color: COLORS._657272, marginBottom: 30,  fontFamily: FONTS.BOLD,},
    cardInputText: {fontSize: 16, width: '100%', paddingVertical: 15, color: COLORS._657272, borderBottomWidth: 1, borderColor: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    
    cardDatePickerContainer: {width: '100%', paddingVertical: 15, borderBottomWidth: 1, borderColor: COLORS._A5A5A5},
    datePickerInputStyle: { width: '100%', color: COLORS._657272, backgroundColor: COLORS._FFFFFF, fontSize: 16, paddingVertical: 10, alignItems: 'flex-start', borderWidth: 0, fontFamily: FONTS.REGULAR },
    datePickerPlaceholderText: { fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR },
    datePickerText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },

    positiveButton: {borderRadius: 25, backgroundColor: COLORS._1B42CB, padding: 15, alignItems: 'center', marginTop: 20, width: '100%'},
    positiveButtonText: {fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR},
    negativeButton: {backgroundColor: COLORS.NO_COLOR, alignItems: 'center', padding: 15, width: '100%' },
    negativeButtonText: {fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR},
})
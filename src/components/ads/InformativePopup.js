import React from 'react'
import { View, TouchableOpacity, Image, StyleSheet, Modal, Text, Dimensions } from 'react-native'
import { Ionicons } from "@expo/vector-icons";

import { COLORS, FONTS } from '../../utils/constants'

const { height } = Dimensions.get('screen')

export const InformativePopup = ({
    onClose, // Callback called on close the modal
    showNegativeButton = true,  // Should show the negative button (equal to close button)
    showPositiveButton = false, // Should show the positive button
    onContinue = () => {} // Callback called on press positive button (must be set if showPositiveButton is true)
}) => 
{
    return (
        <Modal transparent visible onRequestClose={() => {}} animationType='slide'>
            <View style={styles.wrapper}>
                <View style={styles.container}>
                    
                    {/* Header */}
                    <View style={{width: '100%', paddingHorizontal: 15, alignItems: 'flex-end'}}>
                        <TouchableOpacity style={{width: 25, height: 25, alignItems: 'center', justifyContent: 'center'}} onPress={onClose}>
                            <Ionicons color={COLORS._BABABA} name='md-close' size={25}  />
                        </TouchableOpacity>
                    </View>

                    {/* Body */}
                    <View style={{width: '100%', padding: 10}}>
                        <Image style={{width: '100%', height: height * .55}} resizeMode='contain' source={require('../../../assets/banners/covid/covid.png')} />
                    </View>

                    {/* Footer */}
                    <View style={{width: '100%', paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'center'}}>
                        {showNegativeButton &&
                        <TouchableOpacity style={{width: '40%', marginHorizontal: 5, alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: COLORS._FF2F6C, borderRadius: 10}} onPress={onClose}>
                            <Text style={{fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR}}>Cerrar</Text>
                        </TouchableOpacity>}
                        {showPositiveButton &&
                        <TouchableOpacity style={{width: '40%', marginHorizontal: 5, alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: COLORS._1B42CB, borderRadius: 10}} onPress={onContinue}>
                            <Text style={{fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR}}>Continuar</Text>
                        </TouchableOpacity>}
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    wrapper: { height: '100%', width: '100%', backgroundColor: COLORS.BLACK_80, justifyContent: 'center', paddingHorizontal: 10,},
    container: { width: '100%', padding: 10, backgroundColor: COLORS._FFFFFF, borderRadius: 10 },


})
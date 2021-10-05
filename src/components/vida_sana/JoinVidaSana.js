import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";

export const JoinVidaSana = props => 
{
    const {onBack = () => {}, onAccept = () => {} } = props

    return(
        <View style = {styles.container}>
            
            <TouchableOpacity style={styles.backButtonContainer} onPress={onBack}>
                <Image style = {styles.backButtonImage} resizeMode = 'contain' source = {require('../../../assets/icons/dropleft_arrow.png')} />
            </TouchableOpacity>

            <View style={styles.cardContainer}>
                <View style = {styles.iconContainer}> 
                   
                </View>

                <Text style={styles.vidaSanaTitleText}>Club Vida Sana</Text>
                <Text style={styles.vidaSanaSubtitleText}>Vemos que aún no eres parte del club.</Text>
                <Text style={styles.vidaSanaDescriptionText}>Acepta y empieza a disfrutar de los descuentos y beneficios que tenemos para ti.</Text>
            </View>

            <View style={styles.termsContainer}>
                <TouchableOpacity style={styles.accepTermsButton} onPress = {onAccept}>
                    <Text style={styles.accepTermsButtonText}>Aceptar</Text>
                </TouchableOpacity>
                <Text style={styles.acceptTermsText}>Al aceptar quedará inscrito en nuestro club</Text>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({

    container: { width: '100%', height: '100%', backgroundColor: COLORS._FFFFFF, },

    backButtonContainer: { width: '100%', padding: 10, height: '10%'},
    backButtonImage: { width: 20, height: 20 },

    cardContainer: { width: '100%', height: '60%', paddingHorizontal: 15, alignItems: 'center', justifyContent: 'center' },

    iconContainer: { width: '100%', alignItems: 'center', padding: 15, },
    iconStyle: { width: 60, height: 60, tintColor: COLORS._657272 },
    vidaSanaTitleText: { fontSize: 20, color: COLORS._657272, marginBottom: 20, textAlign: 'center', fontFamily: FONTS.BOLD },
    vidaSanaSubtitleText: { fontSize: 18, color: COLORS._657272, marginBottom: 10, textAlign: 'center', fontFamily: FONTS.BOLD },
    vidaSanaDescriptionText: { fontSize: 16, color: COLORS._657272, marginBottom: 30, textAlign: 'center', fontFamily: FONTS.REGULAR },

    termsContainer: { width: '100%', height: '30%', paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', },

    accepTermsButton: { width: '100%', padding: 15, borderRadius: 25, backgroundColor: COLORS._1B42CB, marginBottom: 10, alignItems: 'center'},
    accepTermsButtonText: { fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR },  
    acceptTermsText: { fontSize: 14, color: COLORS._657272, marginBottom: 10, fontFamily: FONTS.REGULAR},
    
    
})
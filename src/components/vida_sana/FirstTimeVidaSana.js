import React, {useState} from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";

export const FirstTimeVidaSana = props => {

    const {onClose = () => {}, onAccept = () => {}} = props;

    const [imageHeight, setImageHeight] = useState(0)

    return (
        <View style={styles.container}>

            <View style={styles.closeButtonContainer}>
                <TouchableOpacity style={styles.closeButton} onPress = {onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer} onLayout={(evt) => {
                const {width} = evt.nativeEvent.layout
                if(imageHeight === 0)
                {
                    setImageHeight(width * .45)
                }
            }}>
                <Image source={require('../../../assets/banners/vida_sana/bannervidasana.png')} style={[styles.banner, {height: imageHeight}]} resizeMode = 'cover' />

                <View style={styles.bodyContainer}>
                    <Text style={styles.titleText}>Haz parte de este gran club</Text>
                    <Text style={styles.descriptionText}>Acepta y empieza a disfrutar de los descuentos y beneficios que tenemos para ti.</Text>
                    <TouchableOpacity style={styles.accepTermsButton} onPress = {onAccept}>
                        <Text style={styles.accepTermsButtonText}>Ir a Vida Sana</Text>
                    </TouchableOpacity>
                    <Text style={styles.acceptTermsText}>Al aceptar quedará inscrito en nuestro club</Text>
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    
    container: { height: '100%', width: '100%', backgroundColor: COLORS.MAIN_COLOR_90, padding: 15, alignItems: 'center', justifyContent: 'center', },
    
    closeButtonContainer: { width: '100%', backgroundColor: COLORS.NO_COLOR, paddingVertical: 15, alignItems: 'flex-end', },
    closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._FFFFFF },
    closeButtonText: { fontSize: 22, color: COLORS._657272, fontFamily: FONTS.BOLD },
    
    cardContainer: { width: '100%', borderRadius: 15, overflow: 'hidden', backgroundColor: COLORS._FFFFFF,  },
    banner: { width: '100%', },

    bodyContainer: { width: '100%', padding: 20, alignItems: 'center',  },
    titleText: { fontSize: 20, color: COLORS._657272, fontFamily: FONTS.BOLD, marginBottom: 10, },
    descriptionText: { fontSize: 16, color: COLORS._657272, marginBottom: 10, fontFamily: FONTS.REGULAR },

    accepTermsButton: { width: '100%', padding: 15, borderRadius: 25, backgroundColor: COLORS._1B42CB, marginBottom: 10, alignItems: 'center'},
    accepTermsButtonText: { fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR },  
    acceptTermsText: { fontSize: 14, color: COLORS._657272, marginBottom: 10, fontFamily: FONTS.REGULAR },

})
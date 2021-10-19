import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';

export const PurchaseCard = (props) => 
{
    const {onPress = () => {}, exito = true} = props;

    return(
        <View style={styles.container}>

            <View style={styles.cardContainer}>
                {exito == "P" && <View>
                <Text style={styles.cardTitleText}>¡Tu pedido ha sido exitoso!</Text>

                <Image source = {require('../../../assets/icons/status/success.png')} style = {styles.cardImage} resizeMode = 'contain' />

                <Text style={styles.cardDescriptionText}>Nuestro personal de servicio a domicilio lo estará contactando para confirmar los datos de su pedido.</Text>
                </View>}

                {exito == "R" && <View>
                    <Text style={styles.cardTitleText}>¡Transacción Fallida!</Text>
                    <Text style={styles.cardDescriptionText}>Hubo un problema con el pago y no se puede procesar tu pedido.</Text>
                </View>
                }

                {exito == "L" && <View>
                    <Text style={styles.cardTitleText}>¡Pago Pendiente!</Text>
                    <Text style={styles.cardDescriptionText}>Estamos esperando que el banco confirme tu pago. Una vez confirmado, procederemos a enviar tu pedido.</Text>
                </View>
                }

                <TouchableOpacity style={styles.cardButton} onPress={onPress}>
                    <Text style={styles.cardButtonText}>Entendido</Text>
                </TouchableOpacity>
            </View>

        </View>
    )

}


const styles = StyleSheet.create({
    
    container: { width: '100%', height: '100%', backgroundColor: COLORS.WHITE_90, alignItems: 'center', justifyContent: 'center' },

    cardContainer: { width: '80%', padding: 20, backgroundColor: COLORS._FFFFFF, alignItems: 'center', borderRadius: 10, elevation: 5, shadowColor: COLORS._BABABA, shadowOpacity: 15, shadowRadius: 5, shadowOffset: {height: 7, width: 0} },
    cardTitleText: { fontSize: 22, color: COLORS._657272, marginVertical: 10, textAlign: 'center', fontFamily: FONTS.BOLD },
    cardDescriptionText: { fontSize: 16, color: COLORS._BABABA, marginVertical: 10, textAlign: 'center', fontFamily: FONTS.REGULAR },
    cardImage: { width: 85, height: 85, marginVertical: 15,},
    cardButton: { width: '100%', backgroundColor: COLORS.NO_COLOR, paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center', borderRadius: 25, borderColor: COLORS._FF2F6C, borderWidth: 1.5, marginVertical: 10, },
    cardButtonText: { fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.REGULAR }


})
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";

export const PaymentMethodCard = (props) => 
{
    const {name = '', icon, selected = false, selectedColor = COLORS._1B42CB, onPress = () => {} } = props;

    return(
        <TouchableOpacity style={[styles.container, {borderColor: selected ? selectedColor : styles.container.borderColor, backgroundColor: selected ? "#f2f2f2" : styles.container.backgroundColor}]} onPress={onPress}>
            <Image source={icon} resizeMode='contain' style={styles.paymentIcon} />
            <View style={styles.paymentNameContainer}>
                <Text style={[styles.paymentMethodText, {color: selected ? selectedColor : styles.paymentMethodText.color}]}>{name}</Text>
            </View>
        </TouchableOpacity>
    )

}


const styles = StyleSheet.create({
    container: { width: 140, backgroundColor: COLORS._FFFFFF, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.NO_COLOR,  elevation: 5, shadowRadius: 4, shadowOpacity: .2, shadowOffset: {width: 0, height: 3}, shadowColor: COLORS._657272, },
    paymentIcon: {width: 40, height: 40},
    paymentNameContainer: {alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10,},
    paymentMethodText: { fontSize: 14, color: COLORS._657272, fontFamily: FONTS.REGULAR },
})
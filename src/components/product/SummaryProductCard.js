import React from 'react'
import { View, StyleSheet, Text, } from "react-native";
import { COLORS, FONTS } from '../../utils/constants';
import { ToCurrencyFormat } from '../../utils/helper';


export const SummaryProductCard = props => 
{
    const {quantity = 0, name = '', price = 0 } = props;


    return(
        <View style={styles.container}>

            <View style={styles.quantityContainer}>
                <Text style={styles.quantityTitleText}>Cant:</Text>
                <Text style={styles.quantityValueText}>{quantity}</Text>
            </View>

            <View style = {styles.productNameContainer}>
                <Text style={styles.productNameText}>{name}</Text>
            </View>

            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>{ToCurrencyFormat(price)}</Text>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {width: '100%', justifyContent: 'space-between', flexDirection: 'row',},

    quantityContainer: { width: '15%', alignItems: 'center', justifyContent: 'center' },
    quantityTitleText: { fontSize: 14, color: COLORS._9EA6A6, fontFamily: FONTS.REGULAR },
    quantityValueText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD },

    productNameContainer: { width: '60%', justifyContent: 'center', },
    productNameText: { fontSize: 15, color: COLORS._9EA6A6,  fontFamily: FONTS.REGULAR },

    priceContainer: { width: '25 %', alignItems: 'center', justifyContent: 'center' },
    priceText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD },

})
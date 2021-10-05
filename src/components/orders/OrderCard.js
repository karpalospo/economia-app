import React from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from '../../utils/constants';
import { ToCurrencyFormat, } from '../../utils/helper';


const arrow = require('../../../assets/icons/dropright_arrow.png')

export const OrderCard = props =>
{
    const {reference = '', totalAmount = 0, date = '', image, onPress, onBuyAgain=() => {} } = props
    
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={onPress}>
            
            <View style={styles.container2}>
                <View style={styles.imageWrapper}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} resizeMode='contain' source={image} />
                    </View>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.referenceText}>{`#${reference}`}</Text>
                    <Text style={styles.deliveryDateText}>{date}</Text>
                </View>

                <View style={styles.deliveryContainer}>
                    <Text style={styles.priceText}>{ToCurrencyFormat(totalAmount)}</Text>
                    <Image source={arrow} tintColor="#ccc" resizeMode='contain' style={{width:16, height:16, marginLeft:15}} />
                </View>
            </View>

            <View style={[styles.container2, {justifyContent:"flex-end", marginTop:5}]}>
                <TouchableOpacity style={styles.button} onPress={() => onBuyAgain(props.reference)}>
                    <Text style={styles.buttonText}>Comprar Nuevamente</Text>
                </TouchableOpacity>
            </View>

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: { backgroundColor: COLORS._FFFFFF, borderRadius: 10, paddingHorizontal:10, paddingVertical: 15, borderWidth:1, borderColor:"#ddd"}, 
    container2: {flexDirection: 'row', alignItems: 'center'},
    imageWrapper: { width: '20%', alignItems: 'center'},
    imageContainer: { width: 56, height: 56, backgroundColor: COLORS.NO_COLOR, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
    image: { width: 65, height: 65, },

    priceContainer: { width: '45%', justifyContent: 'center', paddingLeft: 7, },
    priceText: { fontSize: 17, color: COLORS._1B42CB, fontFamily: FONTS.BOLD }, 
    referenceText: { fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD }, 

    deliveryContainer: { width: '35%', justifyContent: 'flex-end', flexDirection:"row", alignItems:"center"},
    deliveryDateText: {fontSize: 13, color: "#444", fontFamily: FONTS.REGULAR},

    button: {backgroundColor: "#ddd", padding:5, paddingHorizontal:10, borderRadius:7, borderWidth:1, borderColor:"#ccc"},
    buttonText: {color: "#222"},

})
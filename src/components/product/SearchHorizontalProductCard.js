import React, { useState, } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import { Truncate, ToCurrencyFormat, CapitalizeWord, CapitalizeWords } from "../../utils/helper";

export const SearchHorizontalProductCard = props =>
{
    const {product, onPressCard = () => {}, onAddProductToCart = () => {}} = props

    const [emptyImage, setEmptyImage] = useState('');

    return(
        <TouchableOpacity style={styles.container} onPress={onPressCard}>
            
            <View style={styles.imageContainer} >
                <Image source={emptyImage != '' ? emptyImage : product.image} style={styles.image} resizeMode='contain' onError={() => {setEmptyImage(require('../../..//assets/icons/product/noimage.png'))}} />
            </View>

            <View style={styles.productDetailsContainer}>
                <Text style={styles.productNameText}>{CapitalizeWord(product.name)}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceWithDiscountText}>{ToCurrencyFormat(product.price)}</Text>

                    {(product.discount > 0) &&
                    <View style={styles.productDetailsPriceDiscountPercentContainer}>
                        <Text style={styles.productDetailsPricePercentDiscount}>{`-${product.discount}%`}</Text>
                    </View>
                    }

                    {(product.discount > 0) &&
                    <Text style={styles.priceText}>{ToCurrencyFormat(product.antes)}</Text>
                    }
                </View>
                {product.unit != '' &&
                <Text style={styles.productDetailsPricePerUnitText}>{CapitalizeWords(product.unit)}</Text>
                }

                <View style={styles.addToCartContainer}>

                    <TouchableOpacity style={styles.addToCartButton} onPress={onAddProductToCart}> 
                        <Text style={styles.addToCartButtonText}>Agregar</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </TouchableOpacity>
    )

} 

const styles = StyleSheet.create({
    
    container: { width: '100%', backgroundColor: COLORS._FFFFFF, flexDirection: 'row',},

    imageContainer: { width: '35%', alignItems: 'center', justifyContent: 'center', padding: 5},
    image: { width: '100%', height: 100, },
    
    productDetailsContainer: { width: '65%', justifyContent: 'center'},
    productNameText: { fontSize: 16, color: COLORS._657272, marginBottom: 5, fontFamily: FONTS.REGULAR },

    priceContainer: { width: '100%', flexDirection: 'row', marginBottom: 5, alignItems: 'center'},
    priceWithDiscountText: { fontSize: 18, color: COLORS._657272, fontFamily: FONTS.BOLD },
    priceText: {fontSize: 14, color: COLORS._A5A5A5, textDecorationLine: 'line-through', fontFamily: FONTS.REGULAR},
    productDetailsPricePerUnitText: {fontSize: 11, color: COLORS._657272, fontFamily: FONTS.BOLD},

    productDetailsPriceDiscountPercentContainer: {width: 36, paddingHorizontal: 2, paddingVertical: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderColor: COLORS._FF2F6C, borderWidth: 1, marginHorizontal: 4},
    productDetailsPricePercentDiscount: {fontSize: 8, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD},


    addToCartContainer: {marginTop: 15, width: '80%', alignItems: 'center', paddingHorizontal: 20,},
    addToCartButton: {width: '100%', height: 40, borderRadius: 20, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS._1B42CB},
    addToCartButtonText: {fontSize: 15, color: COLORS._1B42CB, textAlignVertical: 'center', fontFamily: FONTS.BOLD},
    addToCartContainer2: {width: '100%', height: 40, borderRadius: 20, padding: 5, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS._1B42CB, flexDirection: 'row'},
    addToCartContainerButton2: {paddingHorizontal: 5,},
    addToCartModifierButtonText: {fontSize: 17, color: COLORS._1B42CB, fontFamily: FONTS.BOLD},


})


import React from 'react';

import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';
import { ToCurrencyFormat, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../utils/helper";

const {width} = Dimensions.get('window')
 
export default class ProductCard extends React.PureComponent
{

    state = {
        emptyImage: null,
    }

    render()
    {
        const {
            image, 
            product = {price: 0, discount: 0, /* <= discount percent, accepted values from 0 to 1 */ name: '', unit: '', pricePerUnit: 0,},
            onPressCard = () => {},
        } = this.props;

        const hasDiscount = product.discount > 0 && !IsExcludedCategory(product.subgrupo36)
        return(
            <View style={styles.cardContainer}>
                
                {/* Main image */}
                <TouchableOpacity style={styles.mainImageContainer} onPress={onPressCard}>
                    
                    
                    <Image source={this.state.emptyImage ? this.state.emptyImage : image} style={styles.mainImage} resizeMode='contain' onError={(error) => {this.setState({emptyImage: require('../../../assets/icons/product/noimage.png')})}} />

                    {hasDiscount &&
                        <View style={styles.vidaSanaIndicatorContainer}>
                            <Image source={require("../../../assets/icons/oferta2.png")} style={styles.discountImg} resizeMode="contain"/>
                            <Text style={styles.productDetailsPricePercentDiscount}>{`${product.discount}%`}</Text>
                        </View>
                    }

                </TouchableOpacity>

                {/* Product details */}
                <View style={styles.productDetailsContainer}>

                    <Text style={styles.productDetailsNameText}>{CapitalizeWord(product.name)}</Text>

                    <View style={styles.productDetailsPriceContainer}>

                        {hasDiscount && <Text style={styles.productDetailsPriceText}>{ToCurrencyFormat(product.antes)}</Text>}
                        <Text style={[styles.productDetailsPriceWithDiscountText, hasDiscount ? {color: COLORS._FF2F6C} : {}]}>{ToCurrencyFormat(product.price)}</Text>


                    </View>

                    <Text style={styles.productDetailsPricePerUnitText}>{CapitalizeWords(product.unit)}</Text>
                    
                </View>

                <View style={styles.addToCartContainer}>

                    <TouchableOpacity style={styles.addToCartButton} onPress={() => {}}> 
                        <Text style={styles.addToCartButtonText}>AGREGAR</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {
        width: (width * .5) - 2,
        marginHorizontal: 1,
        marginVertical:1, 
        paddingTop:10,
        paddingBottom:25,
        backgroundColor: COLORS._FFFFFF, 
    },

    mainImageContainer: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    productDetailsContainer: {paddingHorizontal: 10, width: '100%'},
    productDetailsPriceContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30},
    productDetailsPriceWithDiscountText: {fontSize: 20, color: "#333", fontFamily: FONTS.BOLD},
    productDetailsPriceDiscountContainer: {paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 14, textDecorationLine: 'line-through', color: COLORS._9EA6A6, fontFamily: FONTS.REGULAR, paddingRight:14},

    productDetailsNameText: {fontSize: 15, color: "#444", marginVertical: 8, fontFamily: FONTS.REGULAR, textAlign:"center", minHeight:60},
    productDetailsPricePerUnitText: {fontSize: 12, color: "#666", fontFamily: FONTS.REGULAR, textAlign:"center", height:30, lineHeight:30},

    addToCartContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingVertical:5},
    addToCartButton: {width: '100%', height: 40, borderRadius: 6, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: "#0a61d0", marginTop:5, elevation: 6,
    shadowColor: "#000", 
    shadowOffset: {width: 0, heigth: 0}, 
    shadowOpacity: 7, 
    shadowRadius: 20,},
    addToCartButtonText: {fontSize: 14, color: "#fff", textAlignVertical: 'center', fontFamily: FONTS.BOLD},
    addToCartContainer2: {width: '100%', height: 40, borderRadius: 20, padding: 5, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS._1B42CB, flexDirection: 'row'},
    addToCartContainerButton2: {paddingHorizontal: 5,},
    addToCartModifierButtonText: {fontSize: 17, color: COLORS._1B42CB, fontFamily: FONTS.BOLD},

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 10, width: 38, width: 38, justifyContent: 'center'},
    discountImg: {width:38, height: 38, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 13, color:"white", fontFamily: FONTS.BOLD, width:38, height: 38, position:"absolute", textAlign:"center", zIndex:1, top:12, right:3},
})
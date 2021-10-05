import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, DeviceEventEmitter } from 'react-native';
import { COLORS, FONTS, ON_MODIFY_CART_EVENT } from '../../utils/constants';
import { Truncate, ToCurrencyFormat, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../../utils/helper";
import { AddToShopCart} from "../../utils/shopcartHelper";


const {width} = Dimensions.get('window')
 
export default class ProductCard extends React.PureComponent
{

    static propTypes = {
        image: PropTypes.any.isRequired,
        product: PropTypes.object.isRequired,
        onPressCard: PropTypes.func,
    }


    state = {
        emptyImage: null,
    }


    addCart() {
        let quantity = 1
        AddToShopCart(this.props.product, quantity).then(res => {
            DeviceEventEmitter.emit(ON_MODIFY_CART_EVENT, {quantity: res.totalProductsInCart + quantity})
        })
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

                    <View style={styles.productDetailsPriceContainer}>

                        {hasDiscount && <Text style={styles.productDetailsPriceText}>{ToCurrencyFormat(product.antes)}</Text>}
                        <Text style={[styles.productDetailsPriceWithDiscountText, hasDiscount ? {color: COLORS._FF2F6C} : {}]}>{ToCurrencyFormat(product.price)}</Text>


                    </View>

                    <Text style={styles.productDetailsNameText}>{Truncate(CapitalizeWord(product.name), 30)}</Text>

                    <Text style={styles.productDetailsPricePerUnitText}>{CapitalizeWords(product.unit)}</Text>
                    

                </View>

                <View style={styles.addToCartContainer}>

                    <TouchableOpacity style={styles.addToCartButton} onPress={this.addCart.bind(this)}> 
                        <Text style={styles.addToCartButtonText}>Agregar</Text>
                    </TouchableOpacity>

                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardContainer: {width: (width * .5) - 20, marginHorizontal:10, marginVertical:10, height: 295, backgroundColor: COLORS._FFFFFF, borderRadius: 10, shadowRadius: 4, shadowOpacity: .15, shadowOffset: {width: 2, height: 3}, shadowColor: COLORS._657272, elevation: 4},

    mainImageContainer: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    productDetailsContainer: {paddingVertical: 10, paddingHorizontal: 20, width: '100%', height: 115},
    productDetailsPriceContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30},
    productDetailsPriceWithDiscountText: {fontSize: 20, color: COLORS._1B42CB, fontFamily: FONTS.BOLD},
    productDetailsPriceDiscountContainer: {paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 14, textDecorationLine: 'line-through', color: COLORS._9EA6A6, fontFamily: FONTS.REGULAR, paddingRight:14},

    productDetailsNameText: {fontSize: 15, color: COLORS._657272, marginVertical: 8, fontFamily: FONTS.REGULAR},
    productDetailsPricePerUnitText: {fontSize: 12, color: "#999", marginVertical: 2, fontFamily: FONTS.REGULAR, textAlign:"center"},

    addToCartContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingVertical:5},
    addToCartButton: {width: '100%', height: 40, borderRadius: 6, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._1B42CB, marginTop:5},
    addToCartButtonText: {fontSize: 15, color: "#fff", textAlignVertical: 'center', fontFamily: FONTS.BOLD},
    addToCartContainer2: {width: '100%', height: 40, borderRadius: 20, padding: 5, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: COLORS._1B42CB, flexDirection: 'row'},
    addToCartContainerButton2: {paddingHorizontal: 5,},
    addToCartModifierButtonText: {fontSize: 17, color: COLORS._1B42CB, fontFamily: FONTS.BOLD},

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, right: 0, width: 38, width: 38, justifyContent: 'center'},
    discountImg: {width:38, height: 38, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 13, color:"white", fontFamily: FONTS.BOLD, width:38, height: 38, position:"absolute", textAlign:"center", zIndex:1, top:12, right:3},
})
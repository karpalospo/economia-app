import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';


import { COLORS, FONTS } from '../../utils/constants';
import { Truncate, ToCurrencyFormat, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../../utils/helper";

export const ProductCard = (props) =>
{
    const {
        totalNetAmount = 0,
        image, 
        product = {price: 0, discount: 0, name: '', unit: '', pricePerUnit: 0, qty: 0, minTotalAmount: 0},
        onPressCard = () => {},
        editable = true,
    } = props;

    const [emptyImage, setEmptyImage] = useState('');
    const [showDiscount, setShowDiscount] = useState(true);

    useEffect(() => {
        setEmptyImage('');
    }, [emptyImage]);

    useEffect(() => {
        setShowDiscount(showPrice().showDiscount)
    }, [props.product.qty, totalNetAmount]); 

    const onIncreaseProductCart = () => {
        props.onAddProductToCart(props.product.qty + 1);
    }

    const onDecreaseProductCart = () => {
        if(props.product.qty > 0)
        {
            if((props.product.qty - 1) === 0)
            {
                Alert.alert('Atención', '¿Seguro que desea remover este producto?', [
                    {text: 'Si', onPress: () => props.onAddProductToCart(props.product.qty - 1)},
                    {text: 'No',}
                ])
            }
            else 
            {
                props.onAddProductToCart(props.product.qty - 1)
            }
        }
    }

    const showPrice = () => 
    {
        let showDiscount = true;
        
        if(totalNetAmount > 0)
        {
            if(totalNetAmount < product.minTotalAmount)
            {
                showDiscount = false;
                discount = 0
            }
        }

        let productPrice = ('oldPrice' in product) ? product.oldPrice : product.price
        let price = ToCurrencyFormat(productPrice)
        
        return {price, showDiscount, total: ToCurrencyFormat(productPrice * product.qty)};
    }

    const hasDiscount = product.discount > 0 && !IsExcludedCategory(product.subgrupo36)

    return(
        <View style={styles.cardContainer}>
            
            {product._notFound && <View style={styles.noDisponible}><Text style={{color:COLORS._FF4822, textShadowColor:"white", textShadowRadius:5, paddingLeft:7, fontFamily: FONTS.BOLD}}>No Disponible</Text></View>}
        
            <View style={{flexDirection: "row"}} >

                <View style={styles.mainImageContainer} onPress={onPressCard}>
                    
                    <Image source={emptyImage != '' ? emptyImage : image} style={styles.mainImage} resizeMode='contain' onError={() => {setEmptyImage(require('../../../assets/icons/product/noimage.png'))}} />
                
                    {hasDiscount &&
                        <View style={styles.vidaSanaIndicatorContainer}>
                            <Image source={require("../../../assets/icons/oferta2.png")} style={styles.discountImg} resizeMode="contain"/>
                            <Text style={styles.productDetailsPricePercentDiscount}>{`${product.discount}%`}</Text>
                        </View>
                    }
                </View>


                <View style={styles.productDetailsContainer}>

                    <Text style={styles.productDetailsNameText}>{product.name}</Text>

                    {hasDiscount && 
                        <View style={styles.productDetailsPriceContainer}>
                            <Text style={styles.productDetailsPriceText}>{ToCurrencyFormat(product.antes)}</Text>
                        </View>
                    }

                    <View style={styles.productDetailsPriceContainer}>

                        <Text style={styles.productDetailsPriceWithDiscountText}>{showPrice().price}</Text>

                        <Image source={require('../../../assets/icons/times.png')} tintColor="#999" resizeMode='contain' style={{width:10, height:10}} />
               
                        <View style={styles.cardQtyContainer}>
                            <TouchableOpacity style={styles.decreaseQtyButton} onPress={() => { onDecreaseProductCart() }} disabled={!editable}>
                                {(props.product.qty > 1 && editable) && <Image source={require('../../../assets/icons/minus.png')} style={[styles.increaseQtyButtonImage]} resizeMode='contain' />}
                                {props.product.qty === 1  && editable && <Image source={require('../../../assets/icons/trash.png')} tintColor="#666" resizeMode='contain' style={{width:18, height:18}} />}
                            </TouchableOpacity>
                            <View style={styles.qytContainer}>
                                <Text style={styles.qytText}>{props.product.qty}</Text>
                            </View>
                            <TouchableOpacity style={styles.increaseQtyButton} onPress={() => { onIncreaseProductCart() }} disabled={!editable}>
                                {editable && <Image source={require('../../../assets/icons/plus.png')} style={styles.increaseQtyButtonImage} resizeMode='contain' />}
                            </TouchableOpacity>
                        </View>
                      

                        
                        <Text style={[styles.productDetailsTotalPriceWithDiscountText, hasDiscount ? {color: COLORS._FF2F6C} : {}]}>{showPrice().total}</Text>

                    </View>

                    
                 
                </View>


                

            </View>

            {product._oldPrice && <Text style={styles.precio}> El precio anterior era: {ToCurrencyFormat(product._oldPrice)}</Text>}

        </View>
    )
    
}


const styles = StyleSheet.create({
    cardContainer: {position:"relative"},
    noDisponible: {position: "absolute", justifyContent:"center", zIndex:100, top:0, left:0, width: "100%", height:"100%", backgroundColor:"rgba(255,255,255,0.6)"},
    precio: {padding:5, fontSize:13, color: COLORS._FF1412},
    mainImageContainer: {width: 100, justifyContent: 'center', alignItems: 'center', position:"relative"},
    mainImage: {width: '100%', height: 80, position:"relative", zIndex:-2},

    productDetailsContainer: {flex: 1},

    productDetailsPriceContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
    productDetailsPriceWithDiscountText: {fontSize: 14, color: COLORS._657272, fontFamily: FONTS.BOLD},
    productDetailsTotalPriceWithDiscountText: {fontSize: 17, color: COLORS._1B42CB, fontFamily: FONTS.BOLD},
    productDetailsPriceDiscountContainer: {padding: 2, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 13, textDecorationLine: 'line-through', color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR},
    productDetailsPriceDiscountPercentContainer: {width: 36, paddingHorizontal: 2, paddingVertical: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderColor: COLORS._FF2F6C, borderWidth: 1},
    productDetailsPricePercentDiscount: {fontSize: 10, color: COLORS._FF2F6C, fontFamily: FONTS.BOLD},

    productDetailsNameText: {fontSize: 15, color: "#555", marginVertical: 5, fontFamily: FONTS.BOLD},
    productDetailsPricePerUnitText: {fontSize: 11, color: COLORS._657272, marginVertical: 5, fontFamily: FONTS.BOLD},

    cardQtyContainer: {width: 100, flexDirection:"row", height: 34, borderRadius: 50, backgroundColor: COLORS._F4F4F4, alignItems: 'center', justifyContent: "space-between"},
    increaseQtyButton: {alignItems: 'center', width: 30, height: 30, justifyContent: 'center'},
    qytContainer: {width: 30, height: 30, justifyContent: 'center', alignItems: 'center'},
    decreaseQtyButton: {alignItems: 'center', width: 30, height: 30, justifyContent: 'center'},
    increaseQtyButtonImage: {width: 15, height: 15},
    qytText: {fontSize: 18, color: COLORS._707070, fontFamily: FONTS.BOLD},
    
    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 0, width: 33, width: 33, justifyContent: 'center'},
    discountImg: {width:33, height: 33, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 11, color:"white", fontFamily: FONTS.BOLD, width:30, height: 30, position:"absolute", textAlign:"center", zIndex:1, top:10, left:-1},
})
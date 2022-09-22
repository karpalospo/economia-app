import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { UtilitiesContext } from '../context/UtilitiesContext'

import { f, CapitalizeWords, IsExcludedCategory } from "../utils/helper";
import Cantidad from "./Cantidad";

const x = require('../../assets/icons/times.png')

const oferta = require("../../assets/icons/oferta2.png")

const ProductCard = ({product}) =>
{

    const { setCartItem } = useContext(UtilitiesContext)

    const hasDiscount = product.discount > 0 && !IsExcludedCategory(product.subgrupo36)

    const onChange = (value, item) => {
        setCartItem(item.id, undefined, value, product)
    }

    return(
        <View style={styles.cardContainer}>
            
            {product._notFound && <View style={styles.noDisponible}><Text style={{color: "#FF4822", textShadowColor:"white", textShadowRadius:5, paddingLeft:7, fontFamily: "RobotoB"}}>No Disponible</Text></View>}
        
            <View style={{flexDirection: "row"}} >

                <View style={styles.mainImageContainer}>
                    <Image source={product.image} style={styles.mainImage} resizeMode='contain' />
                    {hasDiscount &&
                        <View style={styles.vidaSanaIndicatorContainer}>
                            <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                            <Text style={styles.productDetailsPricePercentDiscount}>{`${product.discount}%`}</Text>
                        </View>
                    }
                </View>

                <View style={styles.productDetailsContainer}>
                    <Text style={styles.productDetailsNameText}>{CapitalizeWords(product.name)}</Text>
                    <View style={styles.productDetailsPriceContainer}>
                        <Text style={styles.productDetailsPriceWithDiscountText}>{f(product.price)}</Text>
                        <Image source={x} tintColor="#999" resizeMode='contain' style={{width:10, height:10, marginHorizontal:4}} />
                        <Cantidad value={product._quanty} onChange={onChange} item={product} showStock={true} />
                        <Text style={[styles.productDetailsTotalPriceWithDiscountText, hasDiscount ? {color: "#FF2F6C"} : {}]}>{f(product.price * product._quanty)}</Text>
                    </View>
                    {product._oldprice && <Text style={styles.precioVariacion}>El precio al momento de agregarlo era de {f(product._oldprice)}</Text>}
                </View>
            </View>

    
        </View>
    )
    
}

export default ProductCard

const styles = StyleSheet.create({
    cardContainer: {position:"relative"},
    noDisponible: {position: "absolute", justifyContent:"center", zIndex:100, top:0, left:0, width: "100%", height:"100%", backgroundColor:"rgba(255,255,255,0.6)"},
    precio: {padding:5, fontSize:13, color: "#FF1412"},
    mainImageContainer: {width: 70, justifyContent: 'center', alignItems: 'center', position:"relative", marginRight:10},
    mainImage: {width: '100%', height: 80, position:"relative", zIndex:-2},

    productDetailsContainer: {flex: 1},

    precioVariacion: {
        padding:5,
        marginTop: 12,
        fontSize:12,
        paddingLeft: 8,
        borderRadius: 10,
        borderColor: "#FF9999",
        borderWidth: 1,
        color: "#FF3333"
    },

    productDetailsPriceContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingBottom: 25
    },
    productDetailsPriceWithDiscountText: {fontSize: 14, color: "#555", fontFamily: "RobotoB"},
    productDetailsTotalPriceWithDiscountText: {fontSize: 17, color: "#333", fontFamily: "RobotoB", marginLeft:8},
    productDetailsPriceDiscountContainer: {padding: 2, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 13, textDecorationLine: 'line-through', color: "#A5A5A5", fontFamily: "Roboto"},
    productDetailsPriceDiscountPercentContainer: {width: 36, paddingHorizontal: 2, paddingVertical: 1, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderColor: "#FF2F6C", borderWidth: 1},
    productDetailsPricePercentDiscount: {fontSize: 10, color: "#FF2F6C", fontFamily: "RobotoB"},

    productDetailsNameText: {fontSize: 15, color: "#333", marginBottom: 15, fontFamily: "RobotoB"},

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 0, width: 33, width: 33, justifyContent: 'center'},
    discountImg: {width:33, height: 33, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {fontSize: 11, color:"white", fontFamily: "RobotoB", width:30, height: 30, position:"absolute", textAlign:"center", zIndex:1, top:10, left:-1},
})
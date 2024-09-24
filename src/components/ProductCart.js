import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { UtilitiesContext } from '../context/UtilitiesContext'

import { f, CapitalizeWords, IsExcludedCategory } from '../global/functions';
import Cantidad from "./Cantidad";


const oferta = require("../../assets/icons/oferta2.png")

const ProductCart = ({product}) =>
{

    const { setCartItem } = useContext(UtilitiesContext)

    const hasDiscount = product.discount > 0 && !IsExcludedCategory(product.subgrupo36)

    const onChange = (value, item) => {
        setCartItem(item.id, undefined, value, product)
    }

    return(
        <View style={styles.container}>
            
            {product._notFound && <View style={styles.noDisponible}><Text style={{color: "#FF4822", textShadowColor:"white", textShadowRadius:5, paddingLeft:7, fontFamily: "RobotoB"}}>No Disponible</Text></View>}
        
            <View style={{flexDirection: "row"}} >

                <View style={styles.imgContainer}>
                    <Image source={product.image} style={styles.image} resizeMode='contain' />
                    {hasDiscount &&
                        <View style={styles.descuento}>
                            <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                            <Text style={styles.porcentajeDescuento}>{`${product.discount}%`}</Text>
                        </View>
                    }
                </View>

                <View style={styles.detalles}>
                    <Text style={styles.nombre}>{CapitalizeWords(product.name)}</Text>
                    <View style={styles.precioContainer}>
                        <View>
                            {hasDiscount && <Text style={styles.precioAntes}>{f(product.antes)}</Text>}
                            <Text style={[styles.precio, hasDiscount ? {color: "#FF2F6C"} : {}]}>{f(product.price)}</Text>
                        </View>
                        <Cantidad style={2} value={product._quanty} onChange={onChange} item={product} showStock={true} />
                        <Text style={[styles.precioTotal, hasDiscount ? {color: "#FF2F6C"} : {}]}>{f(product.price * product._quanty)}</Text>
                    </View>
                    {product._oldprice && <Text style={styles.precioVariacion}>El precio al momento de agregarlo era de {f(product._oldprice)}</Text>}
                </View>
            </View>

    
        </View>
    )
    
}

export default ProductCart

const styles = StyleSheet.create({
    container: {position:"relative", padding: 10, backgroundColor: "#FFFFFF", borderColor: "#eee", borderBottomWidth: 2},
    noDisponible: {position: "absolute", justifyContent:"center", zIndex:100, top:0, left:0, width: "100%", height:"100%", backgroundColor:"rgba(255,255,255,0.6)"},
    imgContainer: {width: 70, justifyContent: 'flex-start', alignItems: 'center', position:"relative", marginRight:15},
    image: {width: '100%', height: 80, position:"relative", zIndex:-2},

    detalles: {flex: 1},

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

    precioContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingBottom: 25
    },
    precio: {fontSize: 15, color: "#444", fontFamily: "Tommy"},
    precioAntes: {fontSize: 13, color: "#999", fontFamily: "Tommy", textDecorationLine:"line-through"},
    precioTotal: {fontSize: 18, color: "#333", fontFamily: "Tommy", marginLeft:8},
    nombre: {fontSize: 15, color: "#333", marginBottom: 15, fontFamily: "TommyR"},
    descuento: { position: 'absolute', top: 0, left: 0, width: 33, width: 33, justifyContent: 'center'},
    discountImg: {width:33, height: 33, position:"absolute", zIndex:-1, top:3, right:3},
    porcentajeDescuento: {fontSize: 11, color:"white", fontFamily: "RobotoB", width:30, height: 30, position:"absolute", textAlign:"center", zIndex:1, top:10, left:-1},
})
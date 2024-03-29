import React, {useState, useContext, useEffect } from "react";
import { FlatList, Dimensions, View, TouchableOpacity, Image, Text, ActivityIndicator, Platform } from 'react-native';
import { f, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../utils/helper";
import { UtilitiesContext } from '../context/UtilitiesContext'
import Cantidad from "../components/Cantidad";
import { ProductDetail } from "./ProductDetail";
import Button from "../components/Button";


const oferta = require("../../assets/icons/oferta2.png")

const ProductList = ({items = [], loading = false}) => {


    const [showDetail, setShowDetail] = useState(false);
    const [productID, setProductID] = useState(0);

    const { cart, setCartItem } = useContext(UtilitiesContext)


    const addCart = (item) => {
        setCartItem(item.id, 1, 0, item)
    }

    const onChange = (value, item) => {
        console.log(setCartItem(item.id, undefined, value, cart.items[item.id]))
    }

    return (

        <View style={{marginHorizontal:10}}>
            {loading &&
                <View style={{paddingVertical:30}} >
                    <ActivityIndicator color="#1B42CB" size={24} />
                </View>
            }
            <FlatList
                keyExtractor={(item, index) => `items_${index}`}
                numColumns={2}
                data={items}
                renderItem={({ item, index }) => {

                    let hasDiscount = item.discount > 0 && !IsExcludedCategory(item.subgrupo36)
                    let itemCart = false
                    if(cart.items) itemCart = cart.items[item.id]

                    return (
          
                            <View style={styles.cardContainer}>
                            
                                <TouchableOpacity activeOpacity={0.85} style={styles.mainImageContainer} onPress={() => {setProductID(item.id); setShowDetail(true)}}>
                                    <Image source={item.image} style={styles.mainImage} resizeMode='contain' onError={(error) => {}} />
                                    {hasDiscount &&
                                        <View style={styles.vidaSanaIndicatorContainer}>
                                            <Image source={oferta} style={styles.discountImg} resizeMode="contain"/>
                                            <Text style={styles.productDetailsPricePercentDiscount}>{`${item.discount}%`}</Text>
                                        </View>
                                    }
                                
                                    <View style={styles.productDetailsContainer}>
                                        <Text style={styles.productDetailsNameText}>{CapitalizeWord(item.name)}</Text>
                                        <View style={styles.productDetailsPriceContainer}>
                                            {hasDiscount && <Text style={styles.productDetailsPriceText}>{f(item.antes)}</Text>}
                                            <Text style={[styles.productDetailsPriceWithDiscountText, hasDiscount ? {color: "#FF2F6C"} : {}]}>{f(item.price)}</Text>
                                        </View>
                                        <Text style={styles.productDetailsPricePerUnitText}>{CapitalizeWords(item.unit)}</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.addToCartContainer}>
                                    {itemCart && itemCart._quanty > 0 && <Cantidad value={itemCart._quanty} item={item} onChange={onChange} />}
                                    {!itemCart && <Button title="AGREGAR" onPress={() => addCart(item)} /> }
                                </View>

                            </View>
                       
                    )
                }}
            />
            <ProductDetail visible={showDetail} productID={productID} onClose={() => setShowDetail(false)} addCart={addCart} />
            
        </View>
    )

}

export default ProductList


const styles = {
    cardContainer: {
        flex:0.5, 
        margin: 1,
        paddingTop:10,
        paddingBottom:18,
        backgroundColor: "#FFFFFF",
        borderRadius: 4
    },

    mainImageContainer: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    productDetailsContainer: {paddingHorizontal: 10, width: '100%'},
    productDetailsPriceContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30},
    productDetailsPriceWithDiscountText: {fontSize: 20, color: "#333", fontFamily: "Tommy"},
    productDetailsPriceDiscountContainer: {paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 14, textDecorationLine: 'line-through', color: "#aaa", fontFamily: "Tommy", paddingRight:14},

    productDetailsNameText: {fontSize: 15, color: "#444", marginVertical: 8, fontFamily: "TommyR", textAlign:"center", minHeight:60},
    productDetailsPricePerUnitText: {fontSize: 12, color: "#666", fontFamily: "TommyR", textAlign:"center", height:20, marginTop:5, lineHeight:20},

    addToCartContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingVertical:5, marginTop:10},
    addToCartButton: {
        width: '100%', 
        height: 40, 
        borderRadius: 25, 
        paddingHorizontal: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: "#0a61d0", 
        elevation: 6,
        shadowColor: "rgba(0,0,0,0.3)", 
        shadowOffset: {width: 1, heigth: 2}, 
        shadowOpacity: 2, 
        shadowRadius: 8
    },
    addToCartButtonText: {
        fontSize: 14, 
        color: "#fff", 
        textAlignVertical: 'center', 
        fontFamily: "RobotoB"
    },
    addToCartContainer2: {width: '100%', height: 40, borderRadius: 20, padding: 5, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: "#1B42CB", flexDirection: 'row'},
    addToCartContainerButton2: {paddingHorizontal: 5,},
    addToCartModifierButtonText: {fontSize: 17, color: "#1B42CB", fontFamily: "RobotoB"},

    vidaSanaIndicatorContainer: { position: 'absolute', top: 0, left: 10, width: 38, width: 38, justifyContent: 'center'},
    discountImg: {width:38, height: 38, position:"absolute", zIndex:-1, top:3, right:3},
    productDetailsPricePercentDiscount: {
        fontSize: 15, 
        color:"white", 
        fontFamily: "RobotoB", 
        width:38, 
        height: 38, 
        position:"absolute", 
        textAlign:"center", 
        zIndex:1, 
        top: Platform == "ios" ? 14 : 10, 
        right:3
    },
}
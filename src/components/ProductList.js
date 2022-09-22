import React, {useState, useContext, useEffect } from "react";
import { FlatList, Dimensions, View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { f, CapitalizeWord, CapitalizeWords, IsExcludedCategory } from "../utils/helper";
import { UtilitiesContext } from '../context/UtilitiesContext'
import Cantidad from "../components/Cantidad";
import { ProductDetail } from "./ProductDetail";

const {width} = Dimensions.get('window')
const oferta = require("../../assets/icons/oferta2.png")
const noimage = require('../../assets/icons/product/noimage.png')

const ProductList = ({items = [], loading = false, height = 0}) => {

    const [noimageStatus, setNoimageStatus] = useState(false);

    const [showDetail, setShowDetail] = useState(false);
    const [productID, setProductID] = useState(0);

    const { location, cart, setCartItem } = useContext(UtilitiesContext)


    const addCart = (item) => {
        setCartItem(item.id, 1, 0, item)
    }

    const onChange = (value, item) => {
        setCartItem(item.id, undefined, value, cart.items[item.id])
    }

    return (

        <View>
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
                                {!itemCart && 
                                <TouchableOpacity style={styles.addToCartButton} onPress={() => addCart(item)}> 
                                    <Text style={styles.addToCartButtonText}>AGREGAR</Text>
                                </TouchableOpacity>
                                }
                            </View>

                        </View>
                        )
                    }
                }
            />
            <ProductDetail visible={showDetail} productID={productID} onClose={() => setShowDetail(false)} addCart={addCart} />
            
        </View>
    )

}

export default ProductList


const styles = {
    cardContainer: {
        width: (width * .5) - 2,
        marginHorizontal: 1,
        marginVertical:1, 
        paddingTop:10,
        paddingBottom:25,
        backgroundColor: "#FFFFFF", 
    },

    mainImageContainer: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingTop: 10, overflow: 'hidden'},
    mainImage: {width: '100%', height: 100, position:"relative", zIndex:-2},

    productDetailsContainer: {paddingHorizontal: 10, width: '100%'},
    productDetailsPriceContainer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30},
    productDetailsPriceWithDiscountText: {fontSize: 20, color: "#333", fontFamily: "RobotoB"},
    productDetailsPriceDiscountContainer: {paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center'},
    productDetailsPriceText: {fontSize: 14, textDecorationLine: 'line-through', color: "#9EA6A6", fontFamily: "Roboto", paddingRight:14},

    productDetailsNameText: {fontSize: 15, color: "#444", marginVertical: 8, fontFamily: "Roboto", textAlign:"center", minHeight:60},
    productDetailsPricePerUnitText: {fontSize: 12, color: "#666", fontFamily: "Roboto", textAlign:"center", height:30, lineHeight:30},

    addToCartContainer: {width: '100%', alignItems: 'center', paddingHorizontal: 20, paddingVertical:5, marginTop:10},
    addToCartButton: {
        width: '100%', 
        height: 40, 
        borderRadius: 6, 
        paddingHorizontal: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: "#0a61d0", 
        elevation: 6,
        shadowColor: "#000", 
        shadowOffset: {width: 0, heigth: 0}, 
        shadowOpacity: 7, 
        shadowRadius: 20
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
    productDetailsPricePercentDiscount: {fontSize: 13, color:"white", fontFamily: "RobotoB", width:38, height: 38, position:"absolute", textAlign:"center", zIndex:1, top:12, right:3},
}
import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { sortByKey} from "../utils/helper";
import { UtilitiesContext } from '../context/UtilitiesContext'

import { f } from "../utils/helper";

import { SignInCard } from "../components/SignInCard";

import { Arrayfy } from "../global/functions";
import { getUpdatedCartItems } from "../services/products";

import ProductCard from "../components/ProductCart";

const arrow = require('../../assets/icons/dropleft_arrow.png')
const nocart = require('../../assets/nocart.png')

const MIN_COMPRA_BOGOTA = 30000 
const MIN_COMPRA_CIUDADES = 15000 




const Cart = ({navigation}) => {
    
    const { location, user, cart, rectificarCart } = useContext(UtilitiesContext)
    const [cartItems, setCartItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [signInVisible, setSignInVisible] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const cartItemsArray = Arrayfy(cart.items)
                setCartItems([])
                if(cartItemsArray.length == 0) return
                setLoading(true)
                const retificados = await getUpdatedCartItems(cartItemsArray, location.id)
                const newCart = await rectificarCart(retificados)
                setLoading(false)
                setCartItems(sortByKey(Arrayfy(newCart.items), "_date", "desc"))
            })()
        }, [])
    )

    useEffect(() => {
        setCartItems(sortByKey(Arrayfy(cart.items), "_date", "desc"))
    }, [cart])

    onCancelSignIn = () => {
        setSignInVisible(false)
    }

    onRegisterSignIn = () => {
        setSignInVisible(false)
        navigation.navigate("SignUp")
    }

    const shopNow = () => {
        if(!user.logged) {
            return Alert.alert('Atención', 'Primero debe iniciar sesión o registrarse.', [
                {text: 'Iniciar Sesión', onPress: async () => setSignInVisible(true)},
                {text: 'Cancelar',}
            ])
        }
        if(location.id == "11001" && cart.total < MIN_COMPRA_BOGOTA) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_BOGOTA) + " para generar el pedido")
        if(location.id != "11001" && cart.total < MIN_COMPRA_CIUDADES) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_CIUDADES) + " para generar el pedido")

        navigation.navigate("Checkout")
    }

    return (
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
 
            <View style={styles.sectionWrapper}>

    
                {!loading && cartItems.length == 0 &&
                <View style={styles.emptyCartContainer}>
                    <Image source={nocart} style={{width:100, height: 90}} resizeMode="contain" tintColor="#bbb" />
                    <Text style={styles.emptyCartText}>Aún no tienes productos en tu carrito. Agrega productos a pedido para continuar con la compra.</Text>
                </View>}

                {loading && 
                <View>
                    <Text style={styles.emptyCartText}>Actualizando precios del carrito...</Text>
                    <ActivityIndicator color="#1b23c0" size={22} />
                </View>}                 

           
                <FlatList 
                    keyExtractor={(item, index) => `product_${index}`}
                    data={loading ? [] : cartItems}
                    renderItem={({ item, index }) => {
                        
                        let total = item.price * item._quanty
                        return (
                            <View style={styles.productItemContainer}>
                                <ProductCard product={item} quanty={item._quanty} total={total} />
                            </View>
                        )
                    }}
                />
            

                <View style={styles.purchaseDetailContainer}>
                    <View style={{flex:0.5, paddingLeft:20, flexDirection:"row", alignItems: "center"}}>
                        <Text>Domicilio:</Text>
                        <Text style={styles.purchaseDetailItemText}>{f(location.homeService)}</Text>
                    </View>
                
                    <View style={{flex:0.5, flexDirection:"row", alignItems: "center"}}>
                        <Text>Total Carrito:</Text>
                        <Text style={[styles.purchaseDetailItemText, {color: "#1B42CB"}]}>{f(cart.total)}</Text>
                    </View>
                </View>


                <View style={styles.footerContainer}>

                    <TouchableOpacity style={styles.footerBackButton} onPress={() => navigation.goBack()} >
                        <Image source={arrow} style={[styles.footerBackButtonImage, { tintColor: "#1B42CB"}]} resizeMode='contain' />
                        <Text style={styles.footerBackButtonText}>REGRESAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.footerAddToCartButton} onPress={() => shopNow()} >
                        <Text style={[styles.footerAddToCartButtonText, {color: "#FFFFFF"}]}>COMPRAR AHORA</Text>
                    </TouchableOpacity>

                </View>
              
            </View>

            <SignInCard 
                visible={signInVisible} 
                onLogin={() => setSignInVisible(false)} 
                onCancel={onCancelSignIn} 
                onRegister={onRegisterSignIn} 
            />
        </SafeAreaView>
    )



}
export default Cart

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },

    purchaseDetailContainer: { 
        paddingVertical: 15, 
        backgroundColor: "white", 
        alignItems: 'center', 
        flexDirection: "row", 
        justifyContent: "space-between",
        borderColor: "#ddd",
        borderTopWidth: 1
    },
    purchaseDetailItemContainer: { width: '100%', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
    purchaseDetailItemText: { fontSize: 19, color: "#333", fontFamily: "RobotoB" , paddingLeft: 7},
    purchaseDetailItemTotalText: { fontSize: 16, color: "#657272", fontFamily: "Roboto" },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: "#FF2F6C", fontFamily: "RobotoB"},

    sectionWrapper: {
        flex: 1, 
        paddingBottom: 60,
        backgroundColor: "#f2f2f2"
    },

    cartSectionWrapper: { opacity: 0, height: 0, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor:"#f2f2f2" },
    sectionContainer: { width: '25%', alignItems: 'center', },
    imageSectionWrapper: { width: '100%', flexDirection: 'row', alignItems: 'center' },
    imageSeparator: { width: '25%', height: 1, },
    imageSectionContainer: { width: '50%', borderWidth: 1, borderColor: "#FF2F6C", alignItems: 'center', justifyContent: 'center', },
    imageSection: { width: 20, height: 20, tintColor: "#FF2F6C", },
    sectionText: { fontSize: 15, color: "#FF2F6C", marginVertical: 10, fontFamily: "Roboto" },
    emptyCartContainer: {width: '100%', padding: 15, alignItems: "center"},
    emptyCartText: {fontSize: 16, color: "#555", fontFamily: "Roboto", padding:20, textAlign:"center"},

    productItemContainer: {padding: 15, backgroundColor: "#FFFFFF", borderColor: "#F4F4F4", borderTopWidth: 1.5,},

    footerContainer: { 
        position: 'absolute', 
        width: '100%', 
        flexDirection: 'row', 
        ustifyContent: 'space-between', 
        paddingVertical: 10, 
        bottom: 0,
        backgroundColor: "white",
    },
    footerBackButton: { width: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 2, borderColor: "#1B42CB", borderRadius: 6, marginHorizontal: "2.5%" },
    footerBackButtonImage: { width: 10, height: 10, tintColor: "#A5A5A5" },
    footerBackButtonText: { fontSize: 13, color: "#1B42CB", marginLeft: 10, fontFamily: "RobotoB"},
    footerAddToCartButton: { width: '45%', alignItems: 'center', padding: 15, backgroundColor: "#1B42CB", borderRadius: 6,  marginHorizontal: "2.5%" },
    footerAddToCartButtonText: { fontSize: 13, color: "#FF2F6C", fontFamily: "RobotoB" },
})
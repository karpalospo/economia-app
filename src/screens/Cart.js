import React, {useState, useEffect, useContext} from 'react';
import { View, StyleSheet, Text, FlatList, StatusBar, TouchableOpacity, Image, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { sortByKey} from "../utils/helper";
import { UtilitiesContext } from '../context/UtilitiesContext'

import { f } from "../utils/helper";

import Login from "../components/Login";
import { Arrayfy } from "../global/functions";
import { getUpdatedCartItems } from "../services/products";

import ProductCart from "../components/ProductCart";
import { styles } from '../global/styles';
import { FontAwesome5 } from '@expo/vector-icons'; 
import Button from "../components/Button";
import Toast from 'react-native-toast-message';

const nocart = require('../../assets/nocart.png')

const MIN_COMPRA_BOGOTA = 30000 
const MIN_COMPRA_CIUDADES = 15000 


const Cart = ({navigation}) => {
    
    const { location, user, cart, rectificarCart, clearCartItems } = useContext(UtilitiesContext)
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

    const showToast = () => {
        Toast.show({
          type: 'success',
          text1: 'Hello',
          text2: 'This is some something 👋'
        });
    }

    const shopNow = () => {
        if(!user.logged) {
            return Alert.alert('Atención', 'Primero debe iniciar sesión o registrarse.', [
                {text: 'Iniciar Sesión', onPress: async () => setSignInVisible(true)},
                {text: 'Cancelar',}
            ])
        }
        if(location.id == "11001" && cart.total < MIN_COMPRA_BOGOTA) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_BOGOTA) + " para generar el pedido")
        if(location.id != "11001" && cart.total < MIN_COMPRA_CIUDADES) {
            return showToast()
            return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_CIUDADES) + " para generar el pedido")
        }

        navigation.navigate("Checkout")
    }

    return (
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
            
            <View style={_styles.header}>
                <TouchableOpacity style={{paddingHorizontal: 5, paddingVertical:5}} onPress={() => navigation.goBack()} >
                    <FontAwesome5 name="arrow-circle-left" size={28} color="black" />
                </TouchableOpacity>
                <Text style={[styles.h2, {flex:1}]}>Carrito de Compras</Text>
                <TouchableOpacity style={{paddingHorizontal: 10, paddingVertical:5, backgroundColor:"#ee3344", borderRadius:25}} onPress={() => clearCartItems()} >
                    <Text style={{color:"white", fontFamily: "TommyR", fontSize:14}}>Vaciar</Text>
                </TouchableOpacity>
            </View>
  

            <View style={{flex:1, backgroundColor:"#f2f2f2"}}>
                {!loading && cartItems.length == 0 &&
                <View style={_styles.emptyCartContainer}>
                    <Image source={nocart} style={{width:100, height: 90}} resizeMode="contain" tintColor="#bbb" />
                    <Text style={_styles.emptyCartText}>Aún no tienes productos en tu carrito. Agrega productos al carrito para continuar con la compra.</Text>
                </View>}

                {loading && 
                <View>
                    <Text style={_styles.emptyCartText}>Actualizando precios del carrito...</Text>
                    <ActivityIndicator color="#1b23c0" size={22} />
                </View>}                 

                {!loading && cartItems.length > 0 &&
                <FlatList 
                    keyExtractor={(item, index) => `product_${index}`}
                    data={cartItems}
                    contentContainerStyle={{paddingBottom:70, backgroundColor:"#f2f2f2"}}
                    renderItem={({ item, index }) => {
                        let total = item.price * item._quanty
                        return (
                            <ProductCart product={item} quanty={item._quanty} total={total} />
                        )
                    }}
                />
                }
            


                <View style={_styles.footerContainer}>

                    
                    <View style={{flex:0.6, marginVertical:8}}>
                        <View style={styles.rowLeft}>
                            <Text style={_styles.label}>Subtotal:</Text>
                            <Text style={[_styles.precioFooter, {color: "#1B42CB"}]}>{f(cart.total)}</Text>
                        </View>
                    </View>
                    <View style={{flex:0.4}}>
                        <Button title="PAGAR" onPress={() => shopNow()} />
                    </View>
                    

                </View>
              
            </View>

            <Login 
                visible={signInVisible} 
                onLogin={() => setSignInVisible(false)} 
                onCancel={onCancelSignIn} 
                onRegister={onRegisterSignIn} 
            />
        </SafeAreaView>
    )



}
export default Cart

const _styles = StyleSheet.create({

    
    header: {backgroundColor:"white", flexDirection:"row", alignItems:"center", justifyContent:"flex-start", borderColor: "#eee", borderBottomWidth: 2, paddingBottom:6, paddingRight:20, paddingLeft:10},
    label: {width:67, textAlign:"right", fontFamily:"TommyR"},
    purchaseDetailItemContainer: { width: '100%', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
    precioFooter: { fontSize: 20, color: "#333", fontFamily: "Tommy" , paddingLeft: 7},
    purchaseDetailItemTotalText: { fontSize: 16, color: "#657272", fontFamily: "Roboto" },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: "#FF2F6C", fontFamily: "RobotoB"},

    sectionWrapper: {
        flex: 1, 
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

    footerContainer: { 
        position: 'absolute', 
        width: '100%',
        backgroundColor:"white",
        height:60,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: "center",
        bottom: 0,
        paddingHorizontal:20,
        borderTopWidth: 2,
        borderTopColor: "#eee"
    },

    footerBackButtonImage: { width: 10, height: 10, tintColor: "#A5A5A5" },
    footerBackButtonText: { fontSize: 13, color: "#1B42CB", marginLeft: 10, fontFamily: "RobotoB"},
    footerAddToCartButton: { width: '45%', alignItems: 'center', padding: 15, backgroundColor: "#1B42CB", borderRadius: 6,  marginHorizontal: "2.5%" },
    footerAddToCartButtonText: { fontSize: 13, color: "#FF2F6C", fontFamily: "RobotoB" },
})
import React, { useState, useEffect, useContext }  from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, FlatList, TextInput, Platform, StatusBar, Alert, Modal, ActivityIndicator, SafeAreaView, Dimensions } from "react-native";

import AutoHeightWebView from 'react-native-autoheight-webview'
import { UtilitiesContext } from '../context/UtilitiesContext'

import { f } from '../utils/helper';
import { API } from '../services/services';
import { Direcciones } from "../components/Direcciones";
import  Pagos  from "../components/Pagos";
import  Button  from "../components/Button";
import BottomMenu from "../components/BottomMenu";
import Cupones from "../components/Cupones";
import AddAddress from "../components/AddAddress";

import { Arrayfy } from "../global/functions";

const down = require('../../assets/icons/dropdown_arrow.png')

const MIN_COMPRA_BOGOTA = 30000 
const MIN_COMPRA_CIUDADES = 15000 

const pagosContraentrega = [
    {id: 1, name: 'Efectivo', icon: require('../../assets/cash.png')},
    {id: 2, name: 'Datáfono', icon: require('../../assets/dataphone.png')},
    {id: 3, name: 'TCO', icon: require('../../assets/tco.png')},
]

const pagosOnline = [
    {id: 4, name: 'PSE', icon: require('../../assets/logo-pse.png')},
]


const Checkout = ({navigation}) => {
    
    const { location, cart, setCupon, cupon, user, clearCartItems } = useContext(UtilitiesContext)


    const [orderDiscount, setOrderDiscount] = useState(0)
    const [couponName, setCouponName] = useState("")
    const [couponToOrder, setCouponToOrder] = useState({Aplica:false})
    const [selectedMethod, setSelectedMethod] = useState(-1)
    const [selectedAddress, setSelectedAddress] = useState(-1)
    const [cuponesVisible, setCuponesVisible] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [psebody, setPsebody] = useState("");
    const [currentPedido, setCurrentPedido] = useState("");

    const [loading, setLoading] = useState(false)
    const [modalPSEVisible, setModalPSEVisible] = useState(false)
    const [modalAddressVisible, setModalAddressVisible] = useState(false)
    
    if(!user.logged) {
        navigation.navigate("Home")
    }
 
    useEffect(() => {
        if(cupon.NombreCupon) setCouponName(cupon.NombreCupon)
    }, [cupon])

    useEffect(() => {
        setCouponToOrder({Aplica:false})
        setOrderDiscount(0)
    }, [couponName])

    useEffect(() => {
        (async () => {
            if(addresses.length == 0) getAddresses()
        })()
    })

    const getAddresses = async() => {
        const res = await API.POST.PerformRetrieveAddressList(user.nit, user.nombres, user.email, user.token)
        setAddresses(res.message.data)
    }

    const checkCoupon = async(coupon) => 
    {

        if(coupon == "") return
        
        if(user.token != '')
        {
            setLoading(true)
            let res = await API.GET.RetrieveWhetherCouponIsValidOrNot(coupon, user.nit, user.name, user.email, user.token);
            setLoading(false)
            let cupon = {};
            let error = res.error;

            function setError(msg) {
                error = true;
                Alert.alert('Atención', msg)
            }
     
            if(!error) {   
                cupon = res.message.data[0]
                if((cupon.Condicion.toString() == "0") && (cart.total < cupon.VlrMinimo)) setError(`El cupón ${cupon.NombreCupon} solo es válido para compras mínimas de ${f(cupon.VlrMinimo)}.`)
                else if(cupon.Condicion.toString() != "0") {
         
                    setLoading(true)
                    res = await API.POST.PerformValidateTypeOfCoupon(cupon.Condicion, Arrayfy(cart.items).map(product => ({codigo: product.id, price: product.price, cantidad: product._quanty})))
                    setLoading(false)

                    if(res.error) setError(res.message.Messag)
                    else if(res.message.ValorProductos < cupon.VlrMinimo) setError(`El cupón ${cupon.NombreCupon} solo es válido para compras mínimas de ${f(cupon.VlrMinimo)}. Aplica para ${cupon.Descripcion}.`)
                    
                } else Alert.alert(`El cupón ${cupon.NombreCupon} por valor de ${cupon.ValorCupon} ha sido aplicado al pedido`)
            } else {
                Alert.alert("Redimir Cupón", "Este cupón no es válido")
            }
            
            cupon.Aplica = !error;
       
            if(cupon.Aplica) setOrderDiscount(cupon.ValorCupon)
            else setOrderDiscount(0)
            setCupon(cupon)
            setCouponToOrder(cupon)
        }

    }

    const getCurrentTime = () => {
        let today = new Date();
        let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
        let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
        let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
        return hours + ':' + minutes + ':' + seconds;
    }

    const checkoutOrder = async () => 
    {


        let metodoPago, direccion, productos = [];
        

        if(location.id == "11001" && cart.total < MIN_COMPRA_BOGOTA) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_BOGOTA) + " para generar el pedido")
        if(location.id != "11001" && cart.total < MIN_COMPRA_CIUDADES) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_CIUDADES) + " para generar el pedido")

        if(couponName != "" && !couponToOrder.IdCupon) return Alert.alert("La Economia", "Tiene un cupon sin aplicar, presione el boton APLICAR.")
        if(selectedMethod < 0) return Alert.alert("La Economia", "Seleccione un método de pago")
        if(selectedMethod < 4) metodoPago = pagosContraentrega[selectedMethod - 1].name
        if(selectedMethod == 4) metodoPago = pagosOnline[0].name

        if(selectedAddress < 0) return Alert.alert("La Economia", "Seleccione una dirección")
        if(selectedAddress >= 0) direccion = addresses[selectedAddress].direccion

        if(!cart || !cart.items) return Alert.alert("La Economia", "No hay productos en el carrito")

        Object.keys(cart.items).forEach(key => {
            const item = cart.items[key]
            productos.push(
                {
                    codigo: item.id, 
                    descripcion: item.name, 
                    price: item.price,
                    stock: item.stock,
                    idoferta: item.idoferta != undefined ? item.idoferta : 0,
                    cantidad: item._quanty,
                    descuento: item.discount,
                    IdUnidad: item.IdUnidad
                }
            )
        })

        if(productos.length == 0) return Alert.alert("La Economia", "No hay productos en el carrito")

        productos.push({codigo: "999992", descripcion: "domicilio", price: location.homeService, stock:1, idoferta:0, cantidad: 1, descuento:0, IdUnidad:1})

        setLoading(true)

        const res = await API.POST.checkout(
            {
                a: metodoPago, 
                b: metodoPago == "PSE" ? "OnLine" : "ContraEntrega", 
                c: direccion, 
                d: location.id, 
                e: 0, 
                f: location.id, 
                g: location.name, 
                h: cart.total - orderDiscount, 
                s: location.homeService, 
                v: orderDiscount, 
                i: "APP" + Platform.OS === 'ios' ? "ios" : "android", 
                time: getCurrentTime(), 
                obs: "APP NUEVA EN CONSTANTE ACTUALIZACION" 
            },
            {j:{Aplica: false}},
            {k: {nit: user.nit, nombres: user.nombres, email: user.email, auth_token: user.token}},
            {l: couponToOrder.Aplica ? couponToOrder : {Aplica: false}},
            {m:productos}
        )

        
          
        if(!res.error)
        {
            if(res.message.codeError) Alert.alert('Atención', res.message.message)
            else {
                if(res.message.order == 0) {
                    return Alert.alert('Atención', 'No se pudo generar el pedido, por favor vuelve a intentarlo.', [
                        {text: 'Reintentar', onPress: async () => await checkoutOrder()},
                        {text: 'Cancelar',}
                    ])   
                }
                setCurrentPedido(res.message.order)
                if(metodoPago == "PSE") {
                
                    let d = {
                        nombre: user.nombres.split(" ")[0],
                        apellido: user.nombres.split(" ")[1] || "",
                        celular: "",
                        telefono: "",
                        email: user.email,
                        ciudad: res.message.city,
                        direccion: direccion,
                        cedula: user.nit,
                        total: cart.total - orderDiscount + location.homeService,
                        numero_orden: res.message.order
                    }
                    
                    setPsebody(encodeURI(`Acid=83791&Accountpassword=1234&FNm=${d.nombre}&LNm=${d.apellido}&Mob=${d.celular}&Pho=${d.telefono}&Ema=${d.email}&CI=${d.ciudad}&Add=${d.direccion}&IdNumber=${d.cedula}&IdType=CC&MOpt1=001&Total=${d.total}&Tax=0&BDev=0&Ref1=${d.numero_orden}&Desc=0&MOpt3=https://www.droguerialaeconomia.com/economia/pagos/Online&ReturnURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&CancelURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&EnablePSE=true&EnableCard=false&EnableCash=false&EnableEfecty=false&Version=2`))
                    setModalPSEVisible(true)

                } else finishCompra()
            }
            
        } else {
            Alert.alert('Atención', 'No se pudo generar el pedido, por favor vuelve a intentarlo.', [
                {text: 'Reintentar', onPress: async () => await checkoutOrder()},
                {text: 'Cancelar',}
            ])
        }
        
    
       
   

    }

    const finishCompra = async () => {

        setLoading(false)
        const pedido = await API.POST.getPedido(currentPedido)

        let _state = {}

        if(!pedido.error) _state.pedidoexito = pedido.message.data[0].Estado
        
        // Clear the shop cart
        //SetProductsInShopCart([]);

        console.log(_state)
        clearCartItems()
        Alert.alert('Atención', 'Su pedido fue creado satisfactoriamente.')
        navigation.navigate("Home")
    }

    return (
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
             
            <FlatList 
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `item_${index}`}
                data={[0]}
                renderItem={() => {
                    return (
                        <View>
                        
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>INGRESA TU CUPÓN DE DESCUENTO</Text>
                            </View>

                            <View style={styles.couponSectionContainer}>
                                <TextInput 
                                    style={styles.couponInputText}
                                    placeholder='INGR3S4TUCUP0N'
                                    placeholderTextColor={"#A5A5A5"}
                                    autoCapitalize='characters'
                                    maxLength={15}
                                    editable={false}
                                    value={couponName}
                                />
                                {loading &&
                                    <View style={[styles.botonVerde, {minWidth: 108}]} >
                                        <ActivityIndicator color="white" size={22} />
                                    </View> 
                                }
                                {!loading &&
                                    <TouchableOpacity activeOpacity={0.8} style={styles.botonVerde} onPress={() => checkCoupon(couponName)}>
                                        <Text style={styles.botonVerdeText}>APLICAR</Text>
                                    </TouchableOpacity>
                                }

                    
                            </View>

                            {couponToOrder.IdCupon && couponToOrder.Aplica && 
                                <View style={{margin:15, marginHorizontal:40, backgroundColor:"#70AA70", padding: 10, borderColor:"#fff", borderWidth: 1, borderRadius: 10}}><Text style={{fontSize: 18, textAlign:"center", color: "white", fontFamily:"RobotoB"}}>¡Cupón aplicado con éxito!</Text></View>
                            }

                            {couponToOrder.IdCupon && !couponToOrder.Aplica && 
                                <View style={{margin:15, marginHorizontal:40, backgroundColor:"#AA7070", padding: 10, borderColor:"#fff", borderWidth: 1, borderRadius: 10}}><Text style={{fontSize: 18, textAlign:"center", color: "white", fontFamily:"RobotoB"}}>¡Cupón inválido!</Text></View>
                            }


                            <TouchableOpacity onPress={() => setCuponesVisible(true)} style={{padding:10, borderWidth: 1, borderColor: "#ccc", marginHorizontal:30, marginTop:10, borderRadius:8, flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                                <Text style={{textAlign:"center", color: "#666"}}>Ver Cupones Disponibles </Text>
                                <Image source={down} tintColor="#999" resizeMode='contain' style={{width:12, height:12, marginLeft:5}} />
                            </TouchableOpacity>

                            <View style={{height:30}}></View>
                        
                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>FORMA DE PAGO</Text>
                            </View>
                            <Text style={styles.label}>Pago Contraentrega</Text>
                            <View style={{flexDirection:"row", justifyContent:"center"}}>
                                <Pagos items={pagosContraentrega} onChange={id => setSelectedMethod(id)} selected={selectedMethod} />
                            </View>
                            <View style={{height:10}}></View>
                            <Text style={styles.label}>Pago Online</Text>
                            <View style={{flexDirection:"row", justifyContent:"center"}}>
                                <Pagos items={pagosOnline} onChange={id => setSelectedMethod(id)} selected={selectedMethod} />
                            </View>
                            
                            <View style={{height:30}}></View>


                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>DIRECCION DE ENTREGA</Text>
                            </View>
                                    
                            <Direcciones 
                                addresses = {addresses} 
                                selectedAddress = {selectedAddress} 
                                onSelectAddress = {index => setSelectedAddress(index)} 
                                onPressAddNewAddress = {() => setModalAddressVisible(true)} 
                            />

                            <View style={{height:30}}></View>

                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>RESUMEN DE ORDEN</Text>
                            </View>

                            <View style={styles.rowCenter}>
                                <View style={{width: 240}}>
                                    <View style={styles.row}>
                                        <Text style={styles.label2}>Subtotal</Text>
                                        <Text style={styles.label3}>{f(cart.total)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label2}>Descuentos</Text>
                                        <Text style={[styles.label3, (orderDiscount > 0 ? {color: "#FF2F6C"} : {})]}>{orderDiscount > 0 ? "-" : ""}{f(orderDiscount)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label2}>Domicilio</Text>
                                        <Text style={styles.label3}>{f(location.homeService)}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={[styles.label2, {fontSize: 18}]}>Total a Pagar</Text>
                                        <Text style={[styles.label3, {color: "#222", fontSize: 20}]}>{f(cart.total - orderDiscount + parseInt(location.homeService))}</Text>
                                    </View>
                                </View>
                            </View>

                   

                            <View style={{marginTop:40, marginHorizontal:30}}>
                                <Button title="CONFIRMAR PEDIDO" styleMode="blue" loading={loading}  onPress={() => checkoutOrder()} />
                            </View>
                            <View style={{marginTop:25, marginHorizontal:30}}>
                                <Button title="REGRESAR" styleMode="outlineBlue" onPress={() => navigation.navigate("Cart")} />
                            </View>

                            <View style={{height:70}}></View>

                        </View>
                    )
                }}
            />  
            <Cupones visible={cuponesVisible} onclose={() => setCuponesVisible(false)} />
            <BottomMenu navigation={navigation} />

            <AddAddress visible={modalAddressVisible} onCancel={() => setModalAddressVisible(false)} onSuccess={() => getAddresses()}/>
            <Modal
                animationType = 'fade'
                transparent = {true}
                visible = {modalPSEVisible}
                onRequestClose = {() => {}}
            >
                <View style={{height:50, backgroundColor: "white"}}></View>
                <AutoHeightWebView
                    style={{ width: Dimensions.get('window').width}}
                    source={{uri:'https://ecommerce.pagosinteligentes.com/checkout/Gateway.aspx', method: 'POST', body: psebody }}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                    onLoadProgress={({ nativeEvent }) => {
                        if(nativeEvent.progress == 1) {
                            if(nativeEvent.url == "https://www.droguerialaeconomia.com/") {
                                setModalPSEVisible(false)
                                finishCompra()
                            }
                        }
                    }}
                />
            
            </Modal>

        </SafeAreaView>
    )



}

export default Checkout

const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor:"white", paddingBottom: 15, paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 15 },
    rowCenter: {flexDirection:"row", alignItems:"center", justifyContent: "center"},
    row: {width:"100%", flexDirection:"row", alignItems:"center", justifyContent: "space-between"},

    purchaseDetailItemTotalText: { fontSize: 16, color: "#657272", fontFamily: "Roboto" },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: "#FF2F6C", fontFamily: "RobotoB"},

    sectionWrapper: {flex: 1, paddingBottom: 60},

    cartSectionWrapper: { opacity: 0, height: 0, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 2, borderBottomColor:"#f2f2f2" },
    sectionContainer: { width: '25%', alignItems: 'center', },
    imageSectionWrapper: { width: '100%', flexDirection: 'row', alignItems: 'center' },
    imageSeparator: { width: '25%', height: 1, },
    imageSectionContainer: { width: '50%', borderWidth: 1, borderColor: "#FF2F6C", alignItems: 'center', justifyContent: 'center', },
    imageSection: { width: 20, height: 20, tintColor: "#FF2F6C", },
    sectionText: { fontSize: 15, color: "#FF2F6C", marginVertical: 10, fontFamily: "Roboto" },
    emptyCartContainer: {width: '100%', padding: 15},
    emptyCartText: {fontSize: 16, color: "#A5A5A5", fontFamily: "Roboto"},

    productItemContainer: {padding: 15, backgroundColor: "#FFFFFF", borderColor: "#F4F4F4", borderTopWidth: 1.5,},

    footerContainer: { position: 'absolute', width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "#F4F4F4", paddingVertical: 10, bottom: 0 },
    footerBackButton: { width: '45%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderWidth: 2, borderColor: "#1B42CB", borderRadius: 6, marginHorizontal: "2.5%" },
    footerBackButtonImage: { width: 10, height: 10, tintColor: "#A5A5A5" },
    footerBackButtonText: { fontSize: 13, color: "#1B42CB", marginLeft: 10, fontFamily: "RobotoB"},
    footerAddToCartButton: { width: '45%', alignItems: 'center', padding: 15, backgroundColor: "#1B42CB", borderRadius: 6,  marginHorizontal: "2.5%" },
    footerAddToCartButtonText: { fontSize: 13, color: "#FF2F6C", fontFamily: "RobotoB" },

    botonVerde: {backgroundColor: "#0a8623", justifyContent:"center", paddingHorizontal:25, paddingVertical:10, borderBottomRightRadius: 10, borderTopRightRadius: 10},
    botonVerdeText: {color: "#fff", fontWeight: "bold"},
    headerContainer: {paddingVertical: 5, backgroundColor: "#cdd2e1", borderRadius:10, margin: 15, paddingHorizontal:15},
    headerText: { fontSize: 15, color: "#657272", fontFamily: "RobotoB" },

    couponSectionContainer: { paddingVertical: 10, paddingHorizontal: 40, flexDirection: "row"},

    couponInputText: {
        flex:1, 
        fontSize: 15,
        color: "#333",
        padding: 8, 
        alignItems: 'center', 
        borderWidth: 0.5, 
        borderColor: "#B2C3C3", 
        backgroundColor: "#F2F2F2", 
        borderTopLeftRadius:10, 
        borderBottomLeftRadius:10, 
        fontFamily: "Roboto" 
    },

    loadingCouponContainer: {position: 'absolute', width: '100%', height: '100%', backgroundColor: "rgba(0,0,0,0.5)",},

    purchaseDetailContainer: { paddingVertical: 10, paddingHorizontal:40 },
    purchaseDetailItemText: { fontSize: 16, color: "#A5A5A5", fontFamily: "Roboto" },
    purchaseDetailItemTotalText: { fontSize: 16, color: "#657272", fontFamily: "Roboto" },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: "#1B42CB", fontFamily: "RobotoB" },

    customerSupportContainer: {padding: 25, alignItems: 'center', backgroundColor: "#F2F2F2", borderRadius: 10, marginTop: 15},
    customerSupportText: {fontSize: 16, color: "#657272", textAlign: 'center'},
    customerSupportScheduleText: {fontSize: 16, color: "#657272", textAlign: 'center', fontFamily: "RobotoB"},

    label: {
        fontFamily: "Roboto",
        textAlign: "center",
        color:"#555"
    },
    label2: {fontSize:15, color: "#666", fontFamily: "Roboto", paddingVertical:5, textAlign: "right", width:120, marginLeft: -7},
    label3: {fontSize:15, color: "#555", fontFamily: "RobotoB", paddingVertical:5, textAlign: "left", width:120, paddingLeft: 7},

})
import React, { useState, useEffect, useContext }  from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput, Platform, Alert, Modal, ActivityIndicator, SafeAreaView, Dimensions } from "react-native";

import AutoHeightWebView from 'react-native-autoheight-webview'
import { UtilitiesContext } from '../context/UtilitiesContext'

import { API } from '../services/services';
import { Direcciones } from "../components/Direcciones";
import  Pagos  from "../components/Pagos";
import  Button  from "../components/Button";
import Cupones from "../components/Cupones";
import AddAddress from "../components/AddAddress";
import Title from "../components/Title";
import { styles } from '../global/styles';
import { Arrayfy, f, CapitalizeWord } from "../global/functions";
import { FontAwesome  } from '@expo/vector-icons'; 
import TextArea from "../components/TextArea";

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
    
    const { cart, setCupon, cupon, user, setUser, clearCartItems, params, setMustShowLocation } = useContext(UtilitiesContext)

    const [orderDiscount, setOrderDiscount] = useState(0)
    const [couponName, setCouponName] = useState("")
    const [especificaciones, setEspecificaciones] = useState("")
    const [couponToOrder, setCouponToOrder] = useState({Aplica:false})
    const [selectedMethod, setSelectedMethod] = useState(-1)
    const [selectedAddress, setSelectedAddress] = useState(-1)
    const [cuponesVisible, setCuponesVisible] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [psebody, setPsebody] = useState("");
    const [currentPedido, setCurrentPedido] = useState("");

    const [loading, setLoading] = useState(false)
    const [loadingAddress, setLoadingAddress] = useState(false)
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
    }, [addresses])

    const getAddresses = async() => {
        setLoadingAddress(true)
        const res = await API.POST.getAddresses(user.nit, user.nombres, user.email, user.token)
        setLoadingAddress(false)
        if(res.message.data == undefined) {
            if(res.message.message.indexOf("privilegios") > -1) {
                Alert.alert('Error de autenticación', "Se ha iniciado sesión en otro dispositivo. Para continuar en este dispositivo inicie sesión nuevamente.")
                await setUser({})
                navigation.navigate("Home")
            }
        } else setAddresses(res.message.data)
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
                Alert.alert('Error de Cupón', msg)
            }
     
            if(!error) {   
                cupon = res.message.data[0]
                if((cupon.Condicion.toString() == "0") && (cart.total < cupon.VlrMinimo)) setError(`El cupón ${cupon.NombreCupon} solo es válido para compras mínimas de ${f(cupon.VlrMinimo)}.`)
                else if(cupon.Condicion.toString() != "0") {
         
                    setLoading(true)
                    res = await API.POST.PerformValidateTypeOfCoupon(cupon.Condicion, Arrayfy(cart.items).map(product => ({codigo: product.id, price: product.price, cantidad: product._quanty})))
                    setLoading(false)

                    if(res.error) setError(res.message.Message)
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

        let metodoPago, direccion, productos = [], cc = params.cc;

        if(cc.id == "11001" && cart.total < MIN_COMPRA_BOGOTA) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_BOGOTA) + " para generar el pedido")
        if(cc.id != "11001" && cart.total < MIN_COMPRA_CIUDADES) return Alert.alert("La Economia", "El monto de la compra debe ser igual o superior a " + f(MIN_COMPRA_CIUDADES) + " para generar el pedido")

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

        productos.push({codigo: "999992", descripcion: "domicilio", price: cc.shipping, stock:1, idoferta:0, cantidad: 1, descuento:0, IdUnidad:1})

        setLoading(true)

        const res = await API.POST.checkout(
            {
                a: metodoPago, 
                b: metodoPago == "PSE" ? "OnLine" : "ContraEntrega", 
                c: direccion, 
                d: cc.id, 
                e: 0, 
                f: cc.id, 
                g: cc.city,
                h: cart.total - orderDiscount, 
                s: cc.shipping, 
                v: orderDiscount, 
                i: "APP" + Platform.OS === 'ios' ? "ios" : "android", 
                time: getCurrentTime(), 
                obs: especificaciones 
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
                        total: cart.total - orderDiscount + cc.shipping,
                        numero_orden: res.message.order
                    }

                    //const body = encodeURI(`Acid=83791&Accountpassword=1234&FNm=${d.nombre}&LNm=${d.apellido}&Mob=${d.celular}&Pho=${d.telefono}&Ema=${d.email}&CI=${d.ciudad}&Add=${d.direccion}&IdNumber=${d.cedula}&IdType=CC&MOpt1=001&Total=${d.total}&Tax=0&BDev=0&Ref1=${d.numero_orden}&Desc=0&MOpt3=https://www.droguerialaeconomia.com/economia/pagos/Online&ReturnURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&CancelURL=https://www.droguerialaeconomia.com/economia/pagos/returndle&EnablePSE=true&EnableCard=false&EnableCash=false&EnableEfecty=false&Version=2`)
                    setPsebody(res.message.form)
                    setModalPSEVisible(true)

                } else finishCompra()
            }
            
        } else Alert.alert('Atención', 'No se pudo generar el pedido, por favor vuelve a intentarlo.')

    }

    const finishCompra = async () => {
        setLoading(false)
        const pedido = await API.POST.getPedido(currentPedido)

        let _state = {}

        if(!pedido.error) _state.pedidoexito = pedido.message.data[0].Estado
        
        clearCartItems()
        Alert.alert('Atención', 'Su pedido fue creado satisfactoriamente.')
        navigation.navigate("Home")
    }


    const cancelPSE = async () => {

        Alert.alert(
            "La Economía",
            "¿Esta seguro que desea abandonar el pago por PSE?\n\nSu pedido será cancelado.",
            [
              {
                text: "ABANDONAR",
                onPress: () => {setModalPSEVisible(false); finishCompra()},
                style: "cancel"
              },
              { text: "CONTINUAR PAGO", onPress: () => {} }
            ]
          );

        
    }

    

    return (
        <SafeAreaView style={styles.container} forceInset={{top: "never", bottom: "never"}}>
            
            <View style={{backgroundColor: "white", padding:5, borderBottomWidth: 2, borderBottomColor: "#eee"}} >
                <Title title="Checkout" onBack={() => navigation.goBack()} />
            </View>

            <FlatList 
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `item_${index}`}
                data={[0]}
                contentContainerStyle={{paddingBottom:40}}
                renderItem={() => {
                    return (
                        <View>
                        
                            <View style={[_styles.seccion, {marginTop:0, borderTopWidth: 0}]}>
                                <Text style={styles.h4}>Ingresa tu cupón de descuento</Text>
                                <View style={[styles.row, {marginTop: 15}]}>
                                    
                                    <TextInput 
                                        style={_styles.couponInput}
                                        placeholder='INGR3S4TUCUP0N'
                                        placeholderTextColor={"#A5A5A5"}
                                        autoCapitalize='characters'
                                        maxLength={15}
                                        onChange={text => setCouponName(text)}
                                        value={couponName}
                                    />
                                    {loading &&
                                        <View style={[_styles.botonVerde, {minWidth: 108}]} >
                                            <ActivityIndicator color="white" size={22} />
                                        </View> 
                                    }
                                    {!loading &&
                                        <TouchableOpacity activeOpacity={0.8} style={_styles.botonVerde} onPress={() => checkCoupon(couponName)}>
                                            <Text style={_styles.botonVerdeText}>APLICAR</Text>
                                        </TouchableOpacity>
                                    }
                                </View>

                                {couponToOrder.IdCupon && couponToOrder.Aplica && 
                                    <View style={_styles.cuponResult}>
                                        <Text style={{fontSize: 15, textAlign:"center", color: "#0a8623", fontFamily:"Tommy"}}><FontAwesome name="check" size={17} color="#0a8623" /> Cupón aplicado con éxito</Text>
                                    </View>
                                }

                                {couponToOrder.IdCupon && !couponToOrder.Aplica && 
                                    <View style={[_styles.cuponResult, {borderColor:"#aa232366"}]}>
                                        <Text style={{fontSize: 15, textAlign:"center", color: "#aa2323", fontFamily:"Tommy"}}><FontAwesome name="times" size={17} color="#aa2323" /> Cupón inválido</Text>
                                    </View>
                                }
                                <View style={[styles.rowCenter, {marginTop:11}]}>
                                    <TouchableOpacity style={_styles.button} onPress={() => setCuponesVisible(true)}>
                                        <Text style={_styles.buttonText}>Cupones Disponibles</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={_styles.seccion}>
                                <Text style={styles.h4}>Forma de pago</Text>
                                <View style={{height:10}}></View>
                                <Text style={_styles.label}>Pago Contraentrega</Text>
                                <View style={styles.rowCenter}>
                                    <Pagos items={pagosContraentrega} onChange={id => setSelectedMethod(id)} selected={selectedMethod} />
                                </View>
                                <View style={{height:10}}></View>
                                <Text style={_styles.label}>Pago Online</Text>
                                <View style={styles.rowCenter}>
                                    <Pagos items={pagosOnline} onChange={id => setSelectedMethod(id)} selected={selectedMethod} />
                                </View>
                            </View>
                            
                            <View style={_styles.seccion}>
                                <Text style={styles.h4}>Dirección de entrega</Text>
                                <View style={{height:10}}></View>
                                <Text style={{fontFamily:"TommyL", fontSize:15, color:"#666"}}>Tus productos fueron calculados con base en la ciudad de <Text style={{fontFamily:"TommyR", color: "#333"}}>{CapitalizeWord(params.cc.city)}</Text></Text>
                                <View style={[styles.rowCenter, {marginTop:11}]}>
                                    <TouchableOpacity style={_styles.button} onPress={() => {setMustShowLocation(true); navigation.navigate("Home")}}>
                                        <Text style={_styles.buttonText}>Cambiar Ubicación</Text>
                                    </TouchableOpacity>
                                </View>
                                <Direcciones 
                                    loading = {loadingAddress}
                                    addresses = {addresses} 
                                    selected = {selectedAddress} 
                                    onSelect = {index => setSelectedAddress(index)} 
                                    onPressNewAddress = {() => setModalAddressVisible(true)} 
                                />
                            </View>

                            <View style={_styles.seccion}>
                                <Text style={styles.h4}>Notas adicionales al pedido</Text>
                                <TextArea value={especificaciones} onChange={text => setEspecificaciones(text)} placeholder="Ejemplo: Dejar con el portero del edificio." />
                            </View>
  
                            

                            <View style={_styles.seccion}>
                                <Text style={styles.h4}>Resumen de la orden</Text>
                                <View style={{height:10}}></View>
                                <View style={styles.rowCenter}>
                                    <View style={{width: 240}}>
                                        <View style={styles.row}>
                                            <Text style={_styles.label2}>Subtotal</Text>
                                            <Text style={_styles.label3}>{f(cart.total)}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={_styles.label2}>Descuentos</Text>
                                            <Text style={[_styles.label3, (orderDiscount > 0 ? {color: "#FF2F6C"} : {})]}>{orderDiscount > 0 ? "-" : ""}{f(orderDiscount)}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={_styles.label2}>Domicilio</Text>
                                            <Text style={_styles.label3}>{f(params.cc.shipping)}</Text>
                                        </View>
                                        <View style={styles.row}>
                                            <Text style={[_styles.label2]}>Total a Pagar</Text>
                                            <Text style={[_styles.label3, {color: "#222", fontSize: 23, color:"#1B42CB"}]}>{f(cart.total - orderDiscount + parseInt(params.cc.shipping))}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={{marginTop:10, marginHorizontal:30}}>
                                <Button title="CONFIRMAR PEDIDO" styleMode="blue" loading={loading}  onPress={() => checkoutOrder()} />
                            </View>

                        </View>
                    )
                }}
            />  
            <Cupones visible={cuponesVisible} onclose={() => setCuponesVisible(false)} />

            <AddAddress visible={modalAddressVisible} onCancel={() => setModalAddressVisible(false)} onSuccess={() => {setModalAddressVisible(false), getAddresses()}}/>
            <Modal
                animationType = 'fade'
                transparent = {false}
                visible = {modalPSEVisible}
                onRequestClose = {() => {}}
            >
                <Title title="Pago en línea" onCancel={() => cancelPSE()} />
                <AutoHeightWebView
                    style={{ width: Dimensions.get('window').width}}
                    source={{uri:psebody}}
                    scalesPageToFit={true}
                    viewportContent={'width=device-width, user-scalable=no'}
                    onLoadProgress={({ nativeEvent }) => {
                        if(nativeEvent.progress == 1) {
                            if(nativeEvent.url.toString().indexOf("droguerialaeconomia") > -1) {
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

const _styles = StyleSheet.create({


    cuponResult: {marginTop:15, marginHorizontal:20, padding: 7, borderColor:"#0a862366", borderTopWidth: 1, borderBottomWidth: 1},
    button: {marginVertical: 8, backgroundColor:"#f2f2f2", borderRadius:20},
    buttonText: {fontSize: 16, color: "#464646", fontFamily: "Tommy", textAlign:"center",  paddingVertical:7, paddingHorizontal:20},

    botonVerde: {backgroundColor: "#FF2F6C", justifyContent:"center", paddingHorizontal:25, height:40, borderBottomRightRadius: 25, borderTopRightRadius: 25},
    botonVerdeText: {color: "#fff", fontFamily: "Tommy"},

  
    seccion: {padding:20, paddingTop:10, marginTop:10, borderTopWidth: 1, borderTopColor: "#eee"},
    couponInput: {
        flex:1, 
        fontSize: 15,
        color: "#333",
        padding: 5, 
        paddingLeft:10,
        alignItems: 'center', 
        borderWidth: 0.5, 
        borderColor: "#bbb", 
        backgroundColor: "#F2F2F2", 
        borderTopLeftRadius:25, 
        borderBottomLeftRadius:25, 
        fontFamily: "Roboto",
        height:40
    },

    label: {
        fontFamily: "TommyR",
        textAlign: "center",
        color:"#555"
    },
    label2: {fontSize:15, color: "#666", fontFamily: "TommyR", paddingVertical:5, textAlign: "right", width:120, marginLeft: -7},
    label3: {fontSize:15, color: "#333", fontFamily: "Tommy", paddingVertical:5, textAlign: "left", width:120, paddingLeft: 7},

})
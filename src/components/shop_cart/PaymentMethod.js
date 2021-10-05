import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, SectionList, Alert, TouchableOpacity } from "react-native";
import { COLORS, FONTS, BONUS } from '../../utils/constants';
import { ToCurrencyFormat } from '../../utils/helper';
import { FlatList } from 'react-native-gesture-handler';
import { PaymentMethodCard } from '../payment/PaymentMethodCard';
import { API, BONUS_API } from '../../services/service';
import SessionStore from '../../reducers/session.reducer';
import { FullWidthLoading } from '../loading/FullWidthLoading';
import { FormatCoupon, FormatProductForBonus } from '../../utils/formatter';
import { FullScreenLoading } from '../loading/FullScreenLoading';
import { Select, CheckIcon } from "native-base"
import { Delivery } from "../../components/shop_cart/Delivery";

export const PaymentMethod = (props) => 
{

    const {loadingOrder = false, orderSubtotal = 0, homeService = 0, orderTotal = 0, couponDiscount = 0, products = [], onApplyBonus = () => {}, onApplyCoupon = () => {}, onSelectPaymentMethod = () => {}, } = props;

    const [coupon, setCoupon] = useState('')
    const [paymentMethods,] = useState([
        {name: 'PSE', icon: require('../../../assets/icons/payment/logo-pse.png'),},
        {name: 'Efectivo', icon: require('../../../assets/icons/payment/cash.png'),},
        {name: 'Datáfono', icon: require('../../../assets/icons/payment/dataphone.png'),},
        {name: 'TCO', icon: require('../../../assets/icons/payment/tco.png'),},
    ])
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingBonus, setLoadingBonus] = useState(false)
    const [bonusDiscount, setBonusDiscount] = useState(0)

    useEffect(() => {
        onChangePaymentMethod(0)
        getBonuses()
    }, [])


    const getBonuses = async () =>
    {
        const {session} = SessionStore.getState();
        let bonus = {
            isValid: false,
        }

        if(session.token != '')
        {
            const res = await BONUS_API.GET.RetrieveBonuses(session.document)
  
            if(!res.error)
            {
                bonus = await shouldApplyBonus(res.message.data[0], products)
            }
            
            if(bonus.isValid)
            {
                setBonusDiscount(bonus.discount)
   
            }
            
        }

        onApplyBonus(bonus)
    }


    const shouldApplyBonus = async (bonus, products) =>
    {
        let applyBonus = {
            isValid: false,
            discount: 0,
            bonus: {...bonus, Aplica: false,}
        }
        
        // TODO: Pending percentage bonus
        if(bonus.Condicion == 0 && bonus.EsPorcentaje == BONUS.NEGATIVE && bonus.VlrMinimoCompra <= orderSubtotal)
        {
            applyBonus.isValid = true
            applyBonus.discount = bonus.VlrBono
            applyBonus.bonus.Aplica = true
        }
        else if(bonus.VlrMinimoCompra <= orderSubtotal)
        {
            let productsForBonus = []
            for (let index = 0; index < products.length; index++) {
                productsForBonus.push(FormatProductForBonus(products[index]))
            }   

            const res = await BONUS_API.POST.PerformSecondBonusVerification(bonus, productsForBonus)
            
            if(!res.error)
            {
                applyBonus.isValid = true
                applyBonus.discount = res.message.data
                applyBonus.bonus.Aplica = true
            }
        }
        
        return applyBonus
    }


    const checkCoupon = async() => 
    {

        if(coupon == "") return
        
        const {session} = SessionStore.getState();

        if(session.token != '')
        {
            setLoading(true)
            const res = await API.GET.RetrieveWhetherCouponIsValidOrNot(coupon, session.document, session.name, session.email, session.token);
            setLoading(false)
    
            let couponResponse = {};
            let error = res.error;
            
            if(!error)
            {   

                couponResponse = FormatCoupon(res.message.data[0])  

                if((couponResponse.type.toString() == "0") && (orderSubtotal < couponResponse.minAmount))
                {
                    error = true;
                    Alert.alert('Atención', `El cupón ${couponResponse.name} solo es válido para compras mínimas de ${ToCurrencyFormat(couponResponse.minAmount)}.`)
                } else if(couponResponse.type.toString() != "0") {
                    let _products = [];
                    for (let index = 0; index < products.length; index++) {
                        const discount = (products[index].minTotalAmount == 0 && products[index].discount != 0) ? Math.round(products[index].price * products[index].discount) : 0
                        _products.push({
                            codigo: products[index].id,
                            price: (products[index].price - discount),
                            cantidad: products[index].qty, 
                        })
                    }
                    
                    const resTypeOfCoupon = await API.POST.PerformValidateTypeOfCoupon(couponResponse.type, _products)
                    
                    if(resTypeOfCoupon.error)
                    {
                        error = true;
                        Alert.alert('Atención', 'Este cupón no es válido para ser redimido.')
                    }
                    else if(resTypeOfCoupon.message.ValorProductos < couponResponse.minAmount)
                    {
                        // If the total of the order is not greater than min value of the coupon, the coupon will be invalid
                        error = true;
                        Alert.alert('Atención', `El cupón ${couponResponse.name} solo es válido para compras mínimas de ${ToCurrencyFormat(couponResponse.minAmount)}. Aplica para ${couponResponse.description}.`)
                    }
                    
                } else Alert.alert(`El cupón ${coupon} por valor de ${couponResponse.value} ha sido aplicado al pedido`)


            }
            else
            {

                Alert.alert("Redimir Cupón", "Este cupón no es válido")
            }
            
            couponResponse.isValid = !error;
            onApplyCoupon(error, couponResponse)

        }

    }

    const onChangePaymentMethod = (index) => 
    {
        setSelectedMethod(index);
        onSelectPaymentMethod(paymentMethods[index].name)
    }


    return (
        <View style = {styles.container}>
            

            <FlatList 
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
                                    placeholderTextColor={COLORS._A5A5A5}
                                    autoCapitalize='characters'
                                    maxLength={15}
                                    onChangeText={coupon => setCoupon(coupon)}
                                    value={coupon}
                                />
                                <TouchableOpacity style={styles.botonVerde} onPress={() => checkCoupon()}>
                                    <Text style={styles.botonVerdeText}>APLICAR</Text>
                                </TouchableOpacity>
                                {loading &&
                                <View style={styles.loadingCouponContainer}>
                                    <FullWidthLoading size='small'/>
                                </View>}
                            </View>

                            <View style={{paddingHorizontal:40}}>    
                                <Select
                                    accessibilityLabel="Cupones Disponibles"
                                    placeholder="Cupones Disponibles"
                                    onValueChange={(v) => setCoupon(v)}
                                    _selectedItem={{
                                        bg: COLORS._1B42CB
                                    }}
                                >
                                    <Select.Item label="WEB3K" value="WEB3K" />
                                    <Select.Item label="WEB7K" value="WEB7K" />
                                    <Select.Item label="WEB13K" value="WEB13K" />
                                </Select>
                            </View>

                            <View style={{height:30}}></View>
                        

                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>DIRECCION DE ENTREGA</Text>
                            </View>

                                    
                            <Delivery 
                                reCalculateCart={props.reCalculateCart}
                                location={props.location} 
                                loading = {props.loading} 
                                addresses = {props.addresses} 
                                selectedAddress = {props.selectedAddress} 
                                onSelectAddress = {props.onSelectAddress} 
                                onPressAddNewAddress = {props.onPressAddNewAddress} 
                            />


                            <View style={{height:30}}></View>

                            

                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>FORMA DE PAGO</Text>
                            </View>

                            <View style={styles.paymentMethodContainer}>

                                <FlatList
                                    listKey="payment"
                                    keyExtractor={(item, index) => `method_${index}`}
                                    data={paymentMethods}
                                    numColumns={2}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View style={styles.paymentMethodItemContainer}>
                                                <PaymentMethodCard name = {item.name} icon = {item.icon} selected = {(index == selectedMethod)} onPress = {() => {onChangePaymentMethod(index)}} />
                                            </View>
                                        )
                                    }}

                                />
                            </View>
                            <View style={{height:30}}></View>


                            <View style={styles.headerContainer}>
                                <Text style={styles.headerText}>RESUMEN DE ORDEN</Text>
                            </View>

                            <View style={styles.purchaseDetailContainer}>

                                {/* Subtotal */}
                                <View style={styles.purchaseDetailItemContainer}>
                                    <Text style={styles.purchaseDetailItemText}>Subtotal:</Text>
                                    <Text style={styles.purchaseDetailItemText}>{ToCurrencyFormat(orderSubtotal)}</Text>
                                </View>

                                {/* Home service */}
                                <View style={styles.purchaseDetailItemContainer}>
                                    <Text style={styles.purchaseDetailItemText}>Domicilio:</Text>
                                    <Text style={styles.purchaseDetailItemText}>{ToCurrencyFormat(homeService)}</Text>
                                </View>

                                {/* Coupon */}
                                <View style={styles.purchaseDetailItemContainer}>
                                    <Text style={styles.purchaseDetailItemText}>Cupón de descuento:</Text>
                                    <Text style={styles.purchaseDetailItemText}>{`${couponDiscount > 0 ? `-${ToCurrencyFormat(couponDiscount)}` : 'N/A'}`}</Text>
                                </View>

                                {/* Bonus */}
                                {(bonusDiscount > 0) &&
                                <View style={styles.purchaseDetailItemContainer}>
                                    <Text style={styles.purchaseDetailItemText}>Bono de descuento:</Text>
                                    <Text style={styles.purchaseDetailItemText}>{`-${ToCurrencyFormat(bonusDiscount)}`}</Text>
                                </View>}

                                {/* Order total */}
                                <View style={styles.purchaseDetailItemContainer}>
                                    <Text style={styles.purchaseDetailItemTotalText}>A Pagar:</Text>
                                    <Text style={styles.purchaseDetailItemTotalValueText}>{ToCurrencyFormat(orderTotal)}</Text>
                                </View>

                                {/* Customer support */}
                                <View style={styles.customerSupportContainer}>
                                    <Text style={styles.customerSupportText}>Horario de atención y entrega de productos</Text>
                                    <Text style={styles.customerSupportScheduleText}>7:00 am a 8:00 pm</Text>
                                </View>

                            </View>

                            <View style={{height:50}}></View>


                            {(loadingOrder || loadingBonus) && <FullScreenLoading />}

        
                        </View>
                    )
                }}
            />



        </View>
    )
}

const styles = StyleSheet.create({
    container: {flex: 1},
    botonVerde: {backgroundColor: "#0a8623", justifyContent:"center", paddingHorizontal:25, paddingVertical:10, borderBottomRightRadius: 10, borderTopRightRadius: 10},
    botonVerdeText: {color: "#fff", fontWeight: "bold"},
    headerContainer: {paddingVertical: 5, backgroundColor: "#cdd2e1", borderRadius:10, margin: 15, paddingHorizontal:15},
    headerText: { fontSize: 15, color: COLORS._657272, fontFamily: FONTS.BOLD },

    couponSectionContainer: { paddingVertical: 10, paddingHorizontal: 40, flexDirection: "row"},
    couponTextTitle: {fontSize: 14, color: COLORS._657272, fontFamily: FONTS.REGULAR },
    couponInputText: {flex:1, fontSize: 14, padding: 10, alignItems: 'center', borderWidth: 0.5, borderColor: COLORS._B2C3C3, backgroundColor: COLORS._F2F2F2, borderTopLeftRadius:10, borderBottomLeftRadius:10, fontFamily: FONTS.REGULAR },

    loadingCouponContainer: {position: 'absolute', width: '100%', height: '100%', backgroundColor: COLORS.NO_COLOR,},

    purchaseDetailContainer: { paddingVertical: 10, paddingHorizontal:40 },
    purchaseDetailItemContainer: { width: '100%', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' },
    purchaseDetailItemText: { fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR },
    purchaseDetailItemTotalText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: COLORS._1B42CB, fontFamily: FONTS.BOLD },

    customerSupportContainer: {padding: 25, alignItems: 'center', backgroundColor: COLORS._F2F2F2, borderRadius: 10, marginTop: 15},
    customerSupportText: {fontSize: 16, color: COLORS._657272, textAlign: 'center'},
    customerSupportScheduleText: {fontSize: 16, color: COLORS._657272, textAlign: 'center', fontFamily: FONTS.BOLD},

    paymentMethodContainer: { paddingVertical: 10, paddingHorizontal: 40 },
    paymentMethodTitleText: {fontSize: 16, color: COLORS._657272, marginBottom: 10, fontFamily: FONTS.BOLD},
    paymentMethodItemContainer: {marginHorizontal: 10, marginVertical: 10},
    paymentMethodText: {fontSize: 20, fontFamily: FONTS.BOLD, color: COLORS._657272},



})
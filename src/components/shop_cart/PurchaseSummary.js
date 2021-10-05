import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SectionList, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { ToCurrencyFormat } from '../../utils/helper';
import { SummaryProductCard } from '../product/SummaryProductCard';
import { FullScreenLoading } from '../loading/FullScreenLoading';

const {height} = Dimensions.get('screen');

export const PruchaseSummary = props => 
{
    const { 
        loading = false,
        orderNumber = '',
        orderTotal = 0,
        orderSubtotal = 0,
        homeService = 0,
        couponDiscount = 0,
        bonusDiscount = 0,
        paymentMethod = '',
        products = [],
        onDismiss = () => {},
    } = props;

    return (
        <View style = {styles.container}>
            
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>RESUMEN DE TU PEDIDO:</Text>
                <Text style={styles.headerValueText}>{`#${orderNumber}`}</Text>
            </View>

            {/* Total amount */}
            <View style={styles.purchaseDetailContainer}>

                {/* Subtotal */}
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemText}>Total Compra:</Text>
                    <Text style={styles.purchaseDetailItemText}>{ToCurrencyFormat(orderSubtotal)}</Text>
                </View>
                
                {/* Home service */}
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemText}>Servicio a domicilio:</Text>
                    <Text style={styles.purchaseDetailItemText}>{ToCurrencyFormat(homeService)}</Text>
                </View>

                {/* Coupon */}
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemText}>Cupón de descuento:</Text>
                    <Text style={styles.purchaseDetailItemText}>{`${couponDiscount > 0 ? `-${ToCurrencyFormat(couponDiscount)}` : 'N/A'}`}</Text>
                </View>
                
                {/* Bonus */}
                {bonusDiscount > 0 &&
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemText}>Bono de descuento:</Text>
                    <Text style={styles.purchaseDetailItemText}>{`-${ToCurrencyFormat(bonusDiscount)}`}</Text>
                </View>}

                {/* Order total */}
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemTotalText}>Total:</Text>
                    <Text style={styles.purchaseDetailItemTotalValueText}>{ToCurrencyFormat(orderTotal)}</Text>
                </View>

                {/* Payment method */}
                <View style={styles.purchaseDetailItemContainer}>
                    <Text style={styles.purchaseDetailItemTotalText}>Método de pago:</Text>
                    <View style={styles.paymentMethodContainer}>
                        <Text style={styles.paymentMethodText}>{paymentMethod}</Text>
                    </View>
                </View>

            </View>

            {/* Products */}
            <View style={styles.productsContainer}>
                <FlatList 
                    keyExtractor={(item, index) => `product_${index}`}
                    data={products}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.productItemContainer}>
                                <SummaryProductCard name = {item.name} quantity = {item.qty} price = {item.price} />
                            </View>
                        )
                    }}
                />
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>

                <TouchableOpacity style={styles.negativeButton} onPress={onDismiss}>
                    <Text style={styles.negativeButtonText}>Volver al Inicio</Text>
                </TouchableOpacity>
            </View>

            {/* Loading */}
            {loading && <FullScreenLoading />}

        </View>
    )
} 

const styles = StyleSheet.create({
    container: {width: '100%', backgroundColor: COLORS._FFFFFF},

    headerContainer: { width: '100%', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: .7, borderColor: COLORS._F4F4F4, },
    headerText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD },
    headerValueText: { fontSize: 16, color: COLORS._FF2F6C,  fontFamily: FONTS.BOLD },

    purchaseDetailContainer: { width: '100%', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white', alignItems: 'center', borderBottomWidth: .7, borderColor: COLORS._F4F4F4 },
    purchaseDetailItemContainer: { width: '100%', marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    purchaseDetailItemText: { fontSize: 16, color: COLORS._A5A5A5, fontFamily: FONTS.REGULAR },
    purchaseDetailItemTotalText: { fontSize: 16, color: COLORS._657272, fontFamily: FONTS.REGULAR },
    purchaseDetailItemTotalValueText: { fontSize: 16, color: COLORS._FF2F6C, fontWeight: 'bold' },
    paymentMethodContainer: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: .5, borderColor: COLORS._9EA6A6, },
    paymentMethodText: { fontSize: 14, color: COLORS._9EA6A6, fontFamily: FONTS.REGULAR },

    productsContainer: { width: '100%', height: height * .20, overflow: 'hidden', },
    productItemContainer: { width: '100%', padding: 15, },

    buttonsContainer: { width: '100%', padding: 15, alignItems: 'center', },
    purchaseAgainButton: { width: '60%', backgroundColor: COLORS.NO_COLOR, borderWidth: 1.5, borderColor: COLORS._FF2F6C, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 25, alignItems: 'center', marginBottom: 10, },
    purchaseAgainButtonText: { fontSize: 16, color: COLORS._FF2F6C, fontFamily: FONTS.REGULAR },
    negativeButton: { width: '60%', backgroundColor: COLORS.NO_COLOR, alignItems: 'center', },
    negativeButtonText: { fontSize: 16, color: "white", fontFamily: FONTS.BOLD ,backgroundColor: COLORS._1B42CB, paddingVertical:10, paddingHorizontal:25, borderRadius:5 },

})


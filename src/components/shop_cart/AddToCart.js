import React, {useState} from 'react';
import { View, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
import { COLORS, FONTS } from '../../utils/constants';
import { ToCurrencyFormat, CapitalizeWord } from '../../utils/helper';

export const AddToCart = (props) =>
{
    const {
        name, 
        image, 
        price = 0,
        onCloseModal = () => {},
        onPressAddToCart = () => {},
    } = props;


    const [quantity, setQuantity] = useState(1);

    const onAddToCart = (cartQty) =>
    {
        onPressAddToCart(cartQty);
    }

    const increaseQuantity = () =>
    {
        if(quantity < 99)
        {
            setQuantity(quantity + 1);
        }
    }

    const decreaseQuantity = () =>
    {
        if(quantity > 1)
        {
            setQuantity(quantity - 1)
        }
    }

    return(

        <View style={styles.wrapper}>

            <TouchableWithoutFeedback onPress={onCloseModal}>
                <View style={styles.outsideTapView} />
            </TouchableWithoutFeedback>

            <View style={styles.addToCartWrapper}>

                <View style={styles.addToCartContainer}>
                        
                    <View style={styles.addToCartProductContainer}>

                        <View style={styles.addToCartProductImageContainer}>
                            <Image source={image} resizeMode='contain' style={styles.addToCartProductImage} />
                        </View>

                        <View style={styles.addToCartProductDetailsContainer}>
                            <Text style={styles.addToCartProductNameText}>{CapitalizeWord(name)}</Text>
                            <Text style={styles.addToCartProductPriceText}>{ToCurrencyFormat(price)}</Text>
                        </View>

                    </View>
                    
                    <View style={styles.addToCartQuantityContainer}>

                        <Text style={styles.addToCartQuantityTitleText}>Cantidad</Text>

                        <View style={styles.addToCartQuantityModifierWrapper}>
                            <View style={styles.addToCartQuantityModifierContainer}>
                                <TouchableOpacity style={[styles.addToCartQuantityModifierButton, {borderColor: quantity > 1 ? styles.addToCartQuantityModifierButton.borderColor : COLORS._FF2F6C}]} 
                                disabled={(quantity <= 1)}
                                onPress={decreaseQuantity.bind(this)}>
                                    <Text style={[styles.addToCartQuantityModifierButtonText, {color: quantity > 1 ? styles.addToCartQuantityModifierButtonText.color : COLORS._FF2F6C}]}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.addToCartQuantityText}>{quantity}</Text>

                                <TouchableOpacity style={[styles.addToCartQuantityModifierButton, {borderColor: quantity < 99 ? styles.addToCartQuantityModifierButton.borderColor : COLORS._F4F4F4}]} 
                                disabled={(quantity >= 99)}
                                onPress={increaseQuantity.bind(this)}>
                                    <Text style={[styles.addToCartQuantityModifierButtonText, {color: quantity < 99 ? styles.addToCartQuantityModifierButtonText.color : COLORS._F4F4F4}]}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>

                    <View style={styles.addToCartButtonContainer}>
                        <TouchableOpacity style={styles.addToCartButton} 
                        onPress={onAddToCart.bind(this, quantity)}>
                            <Text style={styles.addToCartButtonText}>Agregar al carrito</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                

            </View>

        </View>

    )
    
}

const styles = StyleSheet.create({
    wrapper: {width: '100%', height: '100%'},

    addToCartWrapper: { position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end' },
    addToCartContainer: {width: '100%', backgroundColor: COLORS._FFFFFF, padding: 15, borderTopRightRadius: 10, borderTopLeftRadius: 10, elevation: 5, shadowRadius: 4, shadowOpacity: .2, shadowOffset: {width: 0, height: 3}, shadowColor: COLORS._657272,},

    addToCartProductContainer: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center', paddingHorizontal: 15,},
    addToCartProductImageContainer: {overflow: 'hidden', height: 90, width: 90, borderRadius: 10, marginVertical: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.NO_COLOR, borderWidth: 1, borderColor: COLORS._A5A5A5},
    addToCartProductImage: {height: 120, width: 120},
    addToCartProductDetailsContainer: {alignItems: 'flex-end', width: '50%'},
    addToCartProductNameText: {fontSize: 16, color: COLORS._707070, textAlign: 'right', fontFamily: FONTS.REGULAR},
    addToCartProductPriceText: {fontSize: 25, color: COLORS._657272, textAlign: 'right', fontFamily: FONTS.BOLD, marginVertical: 5},
    
    addToCartQuantityContainer: {width: '100%', alignItems: 'center', marginVertical: 10},
    addToCartQuantityTitleText: {fontSize: 14, color: COLORS._707070, fontFamily: FONTS.BOLD},
    addToCartQuantityModifierWrapper: {width: '100%', alignItems: 'center'},
    addToCartQuantityModifierContainer: {width: '35%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    addToCartQuantityModifierButton: {width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.NO_COLOR, borderWidth: .7, borderColor: COLORS._1B42CB, alignItems: 'center', justifyContent: 'center'},
    addToCartQuantityModifierButtonText: {fontSize: 14, color: COLORS._1B42CB, textAlignVertical: 'center', textAlign: 'center', fontFamily: FONTS.REGULAR},
    addToCartQuantityText: {fontSize: 30, color: COLORS._657272, fontFamily: FONTS.BOLD},

    addToCartButtonContainer: {width: '100%', alignItems: 'center', paddingBottom: 15},
    addToCartButton: {backgroundColor: COLORS._1B42CB, width: '90%', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center'},
    addToCartButtonText: {fontSize: 18, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR},

    outsideTapView: {height: '100%', width: '100%', backgroundColor: COLORS.WHITE_80},
})
import React, {useState} from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import { Truncate, CapitalizeWord } from "../../utils/helper";

const {width} = Dimensions.get('screen')
export const SimpleBrandProductCard = props =>
{
    const {image, name = '', onTap = () => {}} = props

    const [emptyImage, setEmptyImage] = useState('')

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onTap}>
            <View style={styles.cardWrapper}>
                <View style={styles.mainImageContainer}>
                    <Image source={emptyImage != '' ? emptyImage : image} style={styles.mainImage} resizeMode='contain' onError={(error) => {setEmptyImage(require('../../../assets/icons/product/noimage.png'))
                    }} />
                </View>

                <Text style={styles.productDetailsNameText}>{Truncate(CapitalizeWord(name), 40)}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {width: (width * .44), height: 200, backgroundColor: COLORS._FFFFFF, borderRadius: 10, shadowRadius: 4, shadowOpacity: .2, shadowOffset: {width: 0, height: 3}, shadowColor: COLORS._657272, elevation: 4},

    cardWrapper: {width: '100%', padding: 10},

    mainImageContainer: {width: '100%', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', paddingTop: 10},
    mainImage: {width: '100%', height: 100},

    productDetailsNameText: {fontSize: 15, color: COLORS._657272, marginVertical: 5, fontFamily: FONTS.REGULAR},

})
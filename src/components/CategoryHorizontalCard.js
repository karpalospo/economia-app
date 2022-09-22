import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

export const CategoryHorizontalCard = props =>
{
    const {
        title, 
        image = require('../../assets/icons/category/placeholder.png'),  
        onPress
    } = props

    const [placeholderImg, setPlaceholderImg] = React.useState(null)
    const [cardHeight, setCardHeight] = React.useState(0)

    const onImageError = (error) =>
    {
        setPlaceholderImg(require('../../assets/icons/category/placeholder.png'))
    }

    const onLayout = (layout) =>
    {
        if(cardHeight === 0)
        {
            setCardHeight(layout.nativeEvent.layout.width * .3)
        }
    }


    return (
        <TouchableOpacity style={[styles.container, {height: cardHeight}]} onPress={onPress} onLayout={onLayout.bind(this)}>
            
            <View style={styles.imageContainer}>
                <Image style={styles.image} resizeMode='contain' source={placeholderImg ? placeholderImg : image} onError={onImageError.bind(this)} />
            </View>
            
            <View style={styles.titleWrapper}>
                <Image style={styles.image} resizeMode='contain' source={require('../../assets/icons/category/gradient.png')} />

                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    container: {backgroundColor: "#F2F2F2", borderRadius: 15, width: '100%', marginVertical: 10, shadowRadius: 7.5, shadowOpacity: 0.27, shadowOffset: {width: 0, height: 6}, shadowColor: "#657272", elevation: 12},

    imageContainer: {width: '100%', height: '100%', borderRadius: 15, overflow: 'hidden',},
    image: {width: '100%', height: '100%',},

    titleWrapper: {position: 'absolute', width: '100%', height: '100%', borderRadius: 15, overflow: 'hidden'},
    titleContainer: {width: '50%', height: '100%', justifyContent: 'center', position: 'absolute'},
    titleText: { fontSize: 20, fontFamily: "RobotoB", color: "white", marginLeft: 20 },


})
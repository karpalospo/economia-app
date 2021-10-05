import React from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Text, FlatList, StatusBar } from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../utils/constants";
import { CalculateMarginTopForAndroid } from "../../utils/ui_helper";

const {width, height} = Dimensions.get('screen')

export const ZoomImage = props => 
{
    const {images = [], selected = 0, onClose} = props

    return(
        <View style={styles.container}>
            <FlatList 
                initialScrollIndex={selected}
                getItemLayout={(data, index) => (
                    {length: width, offset: width * index, index}
                )}
                keyExtractor={(item, index) => `zoom_mage_${index}`}
                pagingEnabled
                data={images}
                extraData={props}
                horizontal
                renderItem={({ item, index }) => {
                    return (
                        <ImageZoom 
                            cropWidth={width}
                            cropHeight={height}
                            imageWidth={width}
                            imageHeight={height * .5}
                        >
                            <Image style={styles.image} source={item.source} resizeMode='contain'/>
                        </ImageZoom>
                    )
                }}
            />
            

            <View style={[styles.closeButtonContainer, {...CalculateMarginTopForAndroid()}]}>
                <TouchableOpacity style={styles.closeButton} onPress = {onClose}>
                    <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { backgroundColor: COLORS.BLACK_80, height: '100%', width: '100%', justifyContent: 'center' },
    image: {height: '100%', width: '100%'},

    closeButtonContainer: {position: 'absolute', top: Platform.OS == "ios" ? StatusBar.currentHeight + 40  : 0, right: 0, backgroundColor: COLORS.NO_COLOR, padding: 15, alignItems: 'center', justifyContent: 'center'},
    closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS._FFFFFF },
    closeButtonText: { fontSize: 22, color: COLORS._657272, fontWeight: 'bold', },

})
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS, FONTS } from "../../utils/constants";
import { useAnimate } from "../animation/useAnimate";

export const RecentOrderToast = props => {

    const {onPressDetails = () => {}, onClose = () => {}} = props

    const [isOpen, setIsOpen] = React.useState(false) 

    const interpolation = useAnimate(isOpen, [isOpen])

    React.useEffect(() => {
        setIsOpen(true)
    }, [])

    const onCloseToast = () =>
    {
        setIsOpen(!isOpen)
        setTimeout(() => {
            onClose()
        }, 2000);
    }

    return (
        <Animated.View style={[styles.wrapper, {height: interpolation([0, 60])}]}>

            <View style={styles.container}>
                <Text style={styles.titleText}>
                    Tienes un pedido en curso. <Text style={styles.titleLinkText} onPress={() => onPressDetails()}>Ver detalle</Text>
                </Text>

                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onCloseToast.bind(this)}>
                        <Ionicons name='md-close' color={COLORS._FFFFFF} size={25} />
                    </TouchableOpacity>
                </View>
            </View>

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    wrapper: {width: '100%', height: 0, },
    container: { width: '100%', height: '100%', padding: 15, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: COLORS._FF2F6C },

    titleText: {fontSize: 16, color: COLORS._FFFFFF, fontFamily: FONTS.REGULAR},
    titleLinkText: {textDecorationLine: 'underline'},

    closeButtonContainer: {position: 'absolute', right: 0},
    closeButton: {width: 30, height: 30, alignItems: 'center', justifyContent: 'center'},
})
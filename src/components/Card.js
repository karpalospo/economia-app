import React from "react";
import { View, Text} from "react-native";
import { COLORS, FONTS } from "../utils/constants";


const Card = (props) => {

    const {title, children} = props
    return (
        <View style={styles.accountContainer}>

            <View style={styles.accountInfoContainer}>
                <Text style={styles.accountInfoTitleText}>{title}</Text>
            </View>

            <View style={{height:20}} />
            <View style={styles.optionsContainer}>

                {children}
                <View style={{height:5}} />

            </View>


        </View>
    )
}

export default Card

const styles = {

    accountContainer: {backgroundColor:"white", marginHorizontal:10, borderRadius:8, elevation:3},
    accountInfoContainer: {borderBottomColor: "#d6d6d6", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5},
    accountInfoTitleText: {fontSize: 13, color: "#444", fontFamily: FONTS.BOLD},
    accountItemContainer: {width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10},
    accountItemTitleText: {fontSize: 16, color: "#888", fontFamily: FONTS.REGULAR},
    accountItemValueText: {fontSize: 16, color: COLORS._657272, fontFamily: FONTS.BOLD, paddingLeft: 10},

    optionsContainer: {alignItems: 'center', paddingHorizontal: 15,},
    optionButton: {width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: "#eee", paddingVertical: 15, paddingHorizontal: 10, alignItems: 'center'},
    optionButtonIcon: {width: 10, height: 10},

    eticosSerranoContainer: { alignItems: 'flex-end', marginTop: 12, marginRight:18},
    eticosSerranoText: {fontSize: 13, color: "#999", fontFamily: FONTS.REGULAR},
}
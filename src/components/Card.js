import React from "react";
import { View, Text} from "react-native";

const Card = (props) => {

    const {title, children} = props
    return (
        <View style={styles.container}>

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

    container: {backgroundColor:"white", marginHorizontal:10, borderRadius:8, elevation:3},
    accountInfoContainer: {borderBottomColor: "#d6d6d6", paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 0.5},
    accountInfoTitleText: {fontSize: 13, color: "#444", fontFamily: "RobotoB"},
    accountItemContainer: {width: '100%', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10},
    accountItemTitleText: {fontSize: 16, color: "#888", fontFamily: "Roboto"},
    accountItemValueText: {fontSize: 16, color: "#657272", fontFamily: "RobotoB", paddingLeft: 10},

    optionsContainer: {alignItems: 'center', paddingHorizontal: 15,},


}
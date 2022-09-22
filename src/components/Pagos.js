import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image} from "react-native";


const Pagos = ({items, selected=-1, onChange = () => {}}) => {

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(item, index) => `method_${index}`}
                data={items}
                horizontal={true}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={[styles.item, {backgroundColor: (item.id == selected) ? "#dde" : styles.item.backgroundColor}]} onPress={() => onChange(item.id)} activeOpacity={0.7}>
                            <View style={{flexDirection: "row", justifyContent:"center"}} >
                                <Image source={item.icon} resizeMode='contain' style={styles.paymentIcon} />
                            </View>
                            <View style={styles.paymentNameContainer}>
                                <Text style={[styles.paymentMethodText, {color: (item.id == selected) ? "#1B42CB" : styles.paymentMethodText.color}]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        </View>
    )
}

export default Pagos

const styles = {
    container: { paddingVertical: 10, paddingHorizontal: 20},
    item: {
        marginHorizontal: 8,
        marginVertical: 5, 
        backgroundColor: "#f2f2f2",
        width: 100,
        justifyContent: "center",
        alignItems:"center",
        padding:5,
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1
    },

    paymentIcon: {width: 50, height: 50},
    paymentNameContainer: {alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10,},
    paymentMethodText: { fontSize: 14, paddingTop:6, color: "#657272", fontFamily: "Roboto" },
}
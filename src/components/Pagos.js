import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const Pagos = ({items, selected=-1, onChange = () => {}}) => {

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(item, index) => `method_${index}`}
                data={items}
                horizontal={true}
                renderItem={({ item, index }) => {
                    return (
                        <LinearGradient
                            colors={(item.id == selected) ? ['#f2f2f2', '#bbddff'] : ['#fff', '#eee']}
                            start={[1, 0]}
                            end={[1, 1]}
                            style={{borderRadius:10, marginHorizontal: 6,}}
                        >
                            <TouchableOpacity style={[styles.item,  (item.id == selected) ? {borderColor: "#999"} : {}]} onPress={() => onChange(item.id)} activeOpacity={0.7}>
                                <View style={{flexDirection: "row", justifyContent:"center"}} >
                                    <Image source={item.icon} resizeMode='contain' style={styles.icon} />
                                </View>
                                <View style={styles.itemCont}>
                                    <Text style={[styles.label, (item.id == selected) ? {fontFamily: "TommyR", color:"black"} : {}]}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
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
        width: 90,
        justifyContent: "center",
        alignItems:"center",
        padding:4,
        borderRadius: 10,
        borderColor: "#f2f2f2",
        borderWidth: 0.5
    },

    icon: {width: 45, height: 45},
    itemCont: {alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10,},
    label: { fontSize: 12, paddingTop:6, color: "#777", fontFamily: "TommyR" },
}
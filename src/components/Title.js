import React from "react";
import { View, Text, TouchableOpacity} from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 


const Title = ({title, onCancel, onBack}) => {

    return (
        <View style={styles.header}>
            {onBack &&
            <TouchableOpacity style={{paddingHorizontal: 5, paddingVertical:5}} onPress={onBack} >
                <FontAwesome5 name="arrow-circle-left" size={28} color="black" />
            </TouchableOpacity>
            }
            <Text style={styles.title}>{title}</Text>
            {onCancel &&
            <TouchableOpacity style={{paddingHorizontal: 5, paddingVertical:5}} onPress={onCancel} >
                <MaterialCommunityIcons name="close-circle" size={38} color="#222" />
            </TouchableOpacity>
            }
        </View> 
    )
}

export default Title

const styles = {
    header: {
        width:"100%",
        flexDirection:"row", 
        alignItems:"center", 
        justifyContent:"flex-start",

    },
    title: {
        paddingVertical: 10, 
        paddingLeft:20,
        fontSize: 22, 
        color: '#333',
        fontFamily: "Tommy",
        flex:1,
        textAlign: "left"
    },
}
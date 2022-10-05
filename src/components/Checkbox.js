import React from "react";
import { TouchableOpacity,  } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default class Checkbox extends React.PureComponent
{

    render()
    {
        const {checked = false, color = "#1B42CB", onPress = () => {}} = this.props;

        return(
            <TouchableOpacity style={{width: 28, height: 28, borderRadius: 3, borderWidth: 1, borderColor: color, backgroundColor: checked ? color : "transparent", alignItems: 'center', justifyContent: 'center'}}
                onPress={onPress}
            >
                {checked && <Ionicons name='md-checkmark' color='white' size={20} />}
            </TouchableOpacity>
        )
    }

}
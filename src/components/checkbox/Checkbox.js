import React from "react";
import { TouchableOpacity,  } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../utils/constants";

export default class Checkbox extends React.PureComponent
{

    render()
    {
        const {size = 20, checked = false, color = COLORS._1B42CB, onPress = () => {}} = this.props;

        return(
            <TouchableOpacity style={{width: size, height: size, borderRadius: Math.round(size * .1), borderWidth: 1, borderColor: color, backgroundColor: checked ? color : COLORS.NO_COLOR, alignItems: 'center', justifyContent: 'center'}}
                onPress={onPress}
            >
                <Ionicons name='md-checkmark' color='white' size={Math.round(size / 1.5)} />
            </TouchableOpacity>
        )
    }

}
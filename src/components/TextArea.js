import React from 'react';
import { View, TextInput} from 'react-native';
import { styles } from '../global/styles'

const TextArea = ({customStyle ={}, numLines=4, height=70, value, onChange = () => {}, placeholder="", type="default"}) => {

    return (
        <View style={[{marginTop:15}, customStyle]}>
            <View style={{height, padding:8, borderWidth:1, borderColor:"#eee", borderRadius:15}}>
                <TextInput
                    multiline={true}
                    numberOfLines={numLines}
                    placeholder={placeholder}
                    keyboardType={type}
                    style={[styles.textInputs, {height: "100%", textAlignVertical: 'top'}]}
                    onChangeText={text => onChange(text)}
                    value={value}
                />
            </View>
        </View>
    )

}

export default TextArea


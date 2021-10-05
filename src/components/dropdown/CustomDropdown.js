import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { COLORS } from '../../utils/constants';
import { CapitalizeWord } from '../../utils/helper';

const FORMATS = {
    NONE: "none",   
    CAPITALIZE: "capitalize",   
    UPPERCASE: "uppercase",   
    LOWERCASE: "lowercase",   
}
export default class CustomDropdown extends React.PureComponent
{
    state = {
        pressedIn: false,
    }


    formatText = (format, text) => 
    {
        let finalText = text;

        switch (format) {
            case FORMATS.CAPITALIZE:
                finalText = CapitalizeWord(text)
                break;
            case FORMATS.UPPERCASE:
                finalText = text.toUpperCase();
                break;
            case FORMATS.LOWERCASE:
                finalText = text.toLowerCase();
                break;
        }
        
        return finalText;
        
    }

    render()
    {
        const {title, selectedElement = 0, data = [], onSelectElement = () => {}, hideFirstElement = true, itemFormat = "none" | "capitalize" | "uppercase" | "lowercase" } = this.props;

        return(
            <SafeAreaView style={styles.container} >
    
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.headerBackButton} onPress={() => onSelectElement(selectedElement)}>
                        <Image source={require('../../../assets/icons/dropleft_arrow.png')} resizeMode='contain' style={styles.headerBackButtonImage} />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitleText}>{title}</Text>
                    </View>
                </View>

                <FlatList
                    keyExtractor={(item, index) => `element_${index}`}
                    data={data}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item, index }) => {
                        if(hideFirstElement && (index === 0))
                        {
                            return null
                        }

                        return (
                            <TouchableOpacity style={[styles.itemContainer, {backgroundColor: ((selectedElement === index) ? COLORS._1B42CB : styles.itemContainer.backgroundColor)}]} 
                            onPress={() => {
                                // TODO: Set background color on select element 
                                onSelectElement(index) 
                            } 
                            }
                            >
                                <Text style={
                                    {
                                        fontSize: 17, 
                                        fontWeight: ((selectedElement === index) ? 'bold' : 'normal'),
                                        color: ((selectedElement === index) ? COLORS._FFFFFF : COLORS._657272),
                                    }}
                                >
                                    {this.formatText(itemFormat, item.name)}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                /> 

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: 'white', marginTop: "6%", paddingHorizontal: 20, paddingTop:30},
    headerContainer: {paddingVertical: 10, backgroundColor: COLORS._FFFFFF, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'},
    headerBackButton: {width: '15%', paddingLeft: 15, alignItems: 'flex-start', height: 40, justifyContent: 'center'},
    headerBackButtonImage: {width: 15, height: 15},
    headerTitleContainer: {width: '85%', alignItems: 'flex-start', justifyContent: 'center'},
    headerTitleText: {fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: COLORS.BLACK_60},

    itemContainer: {width: '100%', paddingHorizontal: 30, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.NO_COLOR, borderBottomWidth:1, borderBottomColor: "#ccc"},
})

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../utils/constants';


export default class SectionContainer extends React.PureComponent
{

    render()
    {
        const {children, sectionTitle, mainTitle, showAllButton = false, onPressShowAll = () => {}} = this.props;

        return(
            <View style={styles.sectionContainer}>
                
                <View style={styles.titleContainer}>

                    <View>
                        {/* Section title */}
                        <Text style={styles.sectionTitleText}>{sectionTitle}</Text>

                        {/* Main title */}
                        <Text style={styles.mainTitleText}>{mainTitle}</Text>
                    </View>

                    {showAllButton &&
                    <TouchableOpacity style={styles.allButton} onPress = {onPressShowAll}>
                        <Text style={styles.allButtonText}>Ver todo</Text>
                    </TouchableOpacity>}

                </View>

                {children}

            </View>
        )
    }

}

const styles = StyleSheet.create({
    sectionContainer: {width: '100%', paddingBottom: 10, marginBottom: 2, backgroundColor: "#f2f2f2"},
    titleContainer: {marginBottom: 5, paddingHorizontal: 15, paddingTop: 15, paddingBottom: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    sectionTitleText: {fontSize: 15, color: COLORS._A5A5A5, fontFamily: FONTS.BOLD},
    mainTitleText: {fontSize: 17, color: COLORS._657272, fontFamily: FONTS.BOLD},
    allButton: {width: 80, paddingVertical: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 35, borderColor: COLORS._1B42CB, borderWidth: 1.2, backgroundColor: COLORS.NO_COLOR},
    allButtonText: { fontSize: 12, color: COLORS._1B42CB, fontFamily: FONTS.REGULAR},
})
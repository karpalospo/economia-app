import React from 'react';
import { Modal, View, TouchableWithoutFeedback, Text, TouchableOpacity, FlatList } from 'react-native';




export const CustomModalDropdown = ({
    items = [],
    keyExtractor = (item) => `item_${item.value}`,
    onValueChange = () => { },

    // modal props
    showsVerticalScrollIndicator = true,
    modalVisible = true,
    onCloseModal = () => { },
    onRequestClose = () => { }
}) => {


    return (
        <Modal
            animationType="fade"
            transparent={true}
            style={{ width: '100%', alignSelf: 'center', height: '100%', }}
            visible={modalVisible}
            onRequestClose={onRequestClose}
        >

            <TouchableWithoutFeedback onPress={onCloseModal}>
                <View style={{ flex: 1, backgroundColor: "rgba(10,10,40,0.8)", justifyContent: 'center', }} >
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={{ alignSelf: 'center', width: '85%', maxHeight: '80%', backgroundColor:"white", borderRadius:10, overflow: "hidden" }}>
                            <FlatList
                                data={items}
                                keyExtractor={keyExtractor}
                                showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity style={{ width: '100%', paddingVertical: 13, paddingHorizontal: 15, borderBottomWidth:1, borderBottomColor: "#ddd" }} onPress={() => onValueChange(item, index)}>
                                            <Text style={{ fontSize: 16, color: 'black' }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
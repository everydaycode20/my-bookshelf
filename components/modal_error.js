import React, {useEffect, useContext, useState} from 'react';
import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback } from 'react-native';

export default function ModalError({setShowModal}) {

    return (
        <Modal onRequestClose={() => setShowModal(false)} transparent={true} animationType="slide">
            <View style={styles.modal}>
                <View style={styles.modalView}>
                    <Text style={{color: "black", fontSize: 18, textAlignVertical: "center", textAlign: "center", padding: 10}}>Something went wrong. Book information is missing.</Text>
                    <TouchableWithoutFeedback hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }} onPress={() => setShowModal(false)}>
                        <Text style={{ fontSize: 16, backgroundColor: "#F54748", color: "white", paddingRight: 5, borderRadius: 5, paddingLeft: 5, paddingTop: 2, paddingBottom: 2}}>Ok</Text> 
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",

    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 5,
        alignItems: "center", 
        elevation: 5,
        height: 120,
        width: 250,
        justifyContent: "center",
    }
});
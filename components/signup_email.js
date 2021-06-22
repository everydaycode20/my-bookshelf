import React, {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Feather, Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

export default function SignupEmail() {
    
    const [showPassword, setShowPassword] = useState(true);

    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [isEmailValid, setIsEmailValid] = useState(true);

    const [emailInUse, setEmailInUse] = useState(false);

    const nav = useNavigation();
    
    function login() {

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                console.log(userCredential);

            })
            .catch(error => {
                setEmailInUse(false);

            if (error.code === 'auth/email-already-in-use') {
                setEmailInUse(true);
            }
            
            });
    }

    function showPass() {
        setShowPassword(false);

        if (!showPassword) {
            setShowPassword(true);
        }
    }

    function back() {
        nav.goBack();
    }

    function testEmail(text) {
        const reg = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/;

        if (reg.test(text.toLowerCase())) {
            
            setIsEmailValid(true);
            setEmail(text.toLowerCase());
        }
        else{
            
            setIsEmailValid(false);
        }
    }

    function testPassword(text) {
        setPassword(text);
    }

    return (
        <View style={{backgroundColor: "white", flex: 1, }}>
            <View style={{flexDirection: "row", alignItems: "center", marginLeft: 20, marginTop: 20}}>
                <Ionicons onPress={() => back()} name="arrow-back" size={35} color="black"/>
                <Text style={{fontSize: 24, color: "black"}}>Sign up</Text>
            </View>
            <View style={styles.container}>
                <View style={{justifyContent: "center", alignSelf: "center", marginTop: 40}}>
                    <Text style={{color: "black", fontSize: 18}}>Email</Text>
                    <TextInput style={styles.input} keyboardType={"email-address"} autoCapitalize="none" onChangeText={text => testEmail(text)} placeholder="example@example.com"/>
                    {!isEmailValid && <Text style={{fontSize: 16}}>Enter a valid email</Text>}
                    {emailInUse && <Text style={styles.errorMsg}>email address is already in use</Text>}
                </View>
                <View style={{justifyContent: "center", alignSelf: "center", marginTop: 20}}>
                    <Text style={{color: "black", fontSize: 18}}>Password</Text>
                    <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <TextInput style={styles.input} secureTextEntry={showPassword ? true : false} onChangeText={text => testPassword(text)}/>
                        <Feather onPress={() => showPass()} name={showPassword ? "eye" : "eye-off"} size={24} color="black" style={{position: "absolute", top: 0, left: "100%"}}/>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => login()}>
                    <Text style={styles.btn}>Sign up</Text>
                </TouchableWithoutFeedback>
                <Text style={{fontSize: 17, color: "black"}}>Already have an account? <Text onPress={() => nav.navigate("Signin-Email")} style={{fontWeight: "bold", fontSize: 20}}>Sign in</Text></Text>
            </View>
            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },
    input: {
        borderBottomWidth: 1,
        padding: 0,
        width: 200,
        fontSize: 16,
        
    },
    btn: {
        backgroundColor: "#F54748",
        fontSize: 18,
        color: "white",
        width: 100,
        padding: 5,
        borderRadius: 5,
        textAlign: "center",
        marginBottom: 15,
        elevation: 3,
        marginTop: 20,
    },
    errorMsg: {
        color: "#D83A56",
        fontSize: 16,
    }

});
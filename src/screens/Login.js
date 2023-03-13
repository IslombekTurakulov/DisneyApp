import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import { auth } from '../firebase/config';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/icon.png')} style={styles.logo} />
    </View>
  );
};

const InputField = ({placeholder, value, onChangeText, secureTextEntry}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const Button = ({text, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
      })
      .catch(error => alert(error.message));
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        navigation.navigate("Main")
      })
      .catch(error => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Logo />
      <View style={styles.form}>
        <InputField
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          secureTextEntry={false}
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        <Button text="Log in" onPress={handleLogin} />
        <Button
          text="Sign up"
          onPress={handleSignUp}
          style={styles.buttonOutline}
        />
      </View>

      <View style={styles.footer}>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  logo: {
    width: 100,
    height: 100
  },
  form: {
    width: '80%'
  },
  inputContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: '#333'
  },
  button: {
    backgroundColor: '#c7f1e0',
    width: '100%',
    padding:
      15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonOutline: {
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#d9d6d2',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center'
  },
  footer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: '#999'
  },
  footerLink: {
    fontSize: 16,
    color: '#c7f1e0',
    marginLeft: 5,
  }
});

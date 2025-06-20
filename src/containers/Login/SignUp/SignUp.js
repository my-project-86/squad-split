// src/screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Removed getAuth import as it's no longer needed

// Corrected import path for CustomTextInput
import CustomTextInput from '../../../components/react-hook-form/CustomTextInput'; 

// Corrected import path for Firebase config
import { auth, app, db } from '../../../fireBase/fireBaseConfig'; // Adjust the import based on your project structure
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Validation Schema for Signup
const signupSchema = yup.object().shape({
  // 'displayName' will be used as the 'username'
  displayName: yup
    .string()
    .min(2, 'Full Name must be at least 2 characters.')
    .max(50, 'Full Name cannot exceed 50 characters.')
    .required('Full Name is required.'),
  email: yup
    .string()
    .email('Enter a valid email address.')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Basic regex for email format
      'Email format must be like example@domain.com'
    )
    .required('Email is required.'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .matches(/\d/, 'Password must contain at least one number.')
    .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character (e.g., !@#$%^&*).')
    .required('Password is required.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match') // Ensures confirmPassword matches password
    .required('Confirm password is required.'),
});

export default function SignupScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(signupSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (data) => {
    Keyboard.dismiss(); // Dismiss keyboard when submitting
    setLoading(true);

    try {
      // Use the imported 'auth' instance directly
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: data.displayName });
      await sendEmailVerification(user);
      await setDoc(doc(db, 'users', data.email), {
        displayName: data.displayName,
        email: data.email,
        password: data.password, // Not recommended in production
        createdAt: new Date(),
      });
      Alert.alert(
        'Account Created!',
        'A verification email has been sent to your email address. Please verify your email before logging in. Check your spam folder if you don\'t see it.'
      );
      navigation.replace('Login');
    } catch (error) {
      console.error('Signup Error:', error);
      let errorMessage = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use by another account!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger one.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer} // Uncommented this line
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Sign Up</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Create your new SplitSmartPlus account
          </Text>

          <View style={styles.inputContainer}>
            <CustomTextInput
              control={control}
              name="displayName"
              label="Full Name / Username"
              icon="account"
              autoCapitalize="words" // Capitalize first letter of each word
              disabled={loading}
              error={errors.displayName}
              helperText={errors.displayName?.message}
            />
            <CustomTextInput
              control={control}
              name="email"
              label="Email"
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              disabled={loading}
              error={errors.email}
              helperText={errors.email?.message}
            />
            <CustomTextInput
              control={control}
              name="password"
              label="Password"
              icon="lock"
              secureTextEntry={!passwordVisible}
              isPasswordToggle={true}
              passwordVisible={passwordVisible}
              onPasswordToggle={() => setPasswordVisible(!passwordVisible)}
              disabled={loading}
              error={errors.password}
              helperText={errors.password?.message || "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character."}
            />
            <CustomTextInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              icon="lock"
              secureTextEntry={!confirmPasswordVisible}
              isPasswordToggle={true}
              passwordVisible={confirmPasswordVisible}
              onPasswordToggle={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              disabled={loading}
              error={errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(handleSignup)} // Use handleSubmit to trigger validation before calling handleSignup
            loading={loading}
            disabled={loading}
            style={[styles.signupButton, { backgroundColor: theme.colors.primary }]}
            labelStyle={styles.signupButtonLabel}
            icon="account-plus"
          >
            Sign Up
          </Button>

          <View style={styles.loginContainer}>
            <Text style={{ color: theme.colors.text }}>Already have an account? </Text>
            <Button
              mode="text"
              onPress={() => navigation.replace('Login')}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Log In
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  signupButton: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  signupButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    textAlign: "center",
  },
});

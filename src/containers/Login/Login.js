// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import CustomTextInput from "../../components/react-hook-form/CustomTextInput"; // Adjust path if needed
import { db, auth } from "../../fireBase/fireBaseConfig"; // Adjust the import based on your project structure

// Validation Schema for Login
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Email format must be like example@domain.com"
    ),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 6 characters long."),
});

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const theme = useTheme();
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // General loading state
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "637698498417-4fd7nmsumgsegdthkl06p9h9naco0eaa.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          Alert.alert("Login Successful", "You are now logged in with Google!");
          navigation.replace("MainTabs");
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          Alert.alert("Login Failed", error.message || "Google sign-in failed.");
        } finally {
          setLoading(false);
        }
      }
    };
    signInWithGoogle();
  }, [response]);

  // --- Email/Password Login Logic ---
  const handleEmailPasswordLogin = async (data) => {
    Keyboard.dismiss();
    setLoading(true);

    try {
      // 1. Connect to Firestore and check if user exists in 'userCollection'
      const userDocRef = doc(db, "users", data.email);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        throw new Error("User not found. Please check your email or sign up.");
      }
      const userData = userDocSnap.data();
      // 2. Compare password (plain text, for demo only!)
      if (userData.password !== data.password) {
        throw new Error("Invalid password.");
      }
      // Success: proceed to main app
      Alert.alert("Login Successful", "You are now logged in!");
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Custom Login Error:", error);
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Sign Up Button Handler ---
  const handleSignUp = () => {
    // TODO: Replace this with your own sign up logic (e.g., navigate to sign up screen or call your backend API)
    navigation.replace("SignUp");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* --- Logo/App Title Section --- */}
          <View style={styles.logoContainer}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              SplitSmartPlus
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>
              Log in to your account
            </Text>
          </View>

          {/* --- Input Fields Section --- */}
          <View style={styles.inputContainer}>
            <CustomTextInput
              control={control}
              name="email"
              label="Email"
              icon="email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              disabled={loading}
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
            />

            {/* --- Forgot Password Button --- */}
            <Button
              mode="text"
              onPress={() =>
                Alert.alert(
                  "Forgot Password",
                  "Implement password reset functionality here."
                )
              }
              style={styles.forgotPasswordButton}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Forgot password?
            </Button>
          </View>

          {/* --- Login Button (Email/Password) --- */}
          <Button
            mode="contained"
            onPress={handleSubmit(handleEmailPasswordLogin)}
            loading={loading}
            disabled={loading}
            style={[
              styles.loginButton,
              { backgroundColor: theme.colors.primary },
            ]}
            labelStyle={styles.loginButtonLabel}
            icon="login"
          >
            Login
          </Button>

          {/* --- Google Sign-In Button --- */}
          <Button
            mode="outlined"
            onPress={() => {
              setLoading(true);
              promptAsync();
            }}
            disabled={loading}
            style={{ marginBottom: 10 }}
            icon="google"
          >
            Sign in with Google
          </Button>

          {/* --- Sign Up Link --- */}
          <View style={styles.signUpContainer}>
            <Text style={{ color: theme.colors.text }}>
              Don't have an account?{" "}
            </Text>
            <Button
              mode="text"
              onPress={handleSignUp}
              labelStyle={{ color: theme.colors.primary }}
              disabled={loading}
            >
              Sign Up
            </Button>
          </View>

          {/* --- Optional Footer Text --- */}
          <Text
            style={[styles.footerText, { color: theme.colors.placeholder }]}
          >
            © 2025 SplitSmartPlus. All rights reserved.
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// --- Stylesheet ---
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#757575",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
  },
  loginButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
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

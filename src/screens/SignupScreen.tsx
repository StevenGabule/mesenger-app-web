import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { SIGNUP_MUTATION } from '../graphql';
import { useAuth } from '../context/AuthContext';
import { RegisterInput } from '../types';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterInput>({
    username: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupMutation, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: async (data) => {
      try {
        await login(data.signup.token, data.signup.user);
        Alert.alert('Success', 'Account created successfully!');
      } catch (error) {
        Alert.alert('Error', 'Failed to save login data');
      }
    },
    onError: (error) => {
      Alert.alert('Signup Failed', error.message);
    },
  });

  const handleSignup = () => {
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    signupMutation({
      variables: {
        input: formData,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <Input
            placeholder="Username"
            leftIcon={{ type: 'feather', name: 'user' }}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Email"
            leftIcon={{ type: 'feather', name: 'mail' }}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Password"
            leftIcon={{ type: 'feather', name: 'lock' }}
            rightIcon={{
              type: 'feather',
              name: showPassword ? 'eye-off' : 'eye',
              onPress: () => setShowPassword(!showPassword),
            }}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
            containerStyle={styles.inputContainer}
          />

          <Input
            placeholder="Confirm Password"
            leftIcon={{ type: 'feather', name: 'lock' }}
            rightIcon={{
              type: 'feather',
              name: showConfirmPassword ? 'eye-off' : 'eye',
              onPress: () => setShowConfirmPassword(!showConfirmPassword),
            }}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            containerStyle={styles.inputContainer}
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            buttonStyle={styles.signupButton}
            titleStyle={styles.signupButtonText}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 20,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
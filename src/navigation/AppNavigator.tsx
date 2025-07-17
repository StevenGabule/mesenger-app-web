import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ConversationsScreen } from '../screens/ConversationsScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { NewChatScreen } from '../screens/NewChatScreen';

// Main app stack
const MainStack = createStackNavigator();

const MainNavigator = () => {
  const { logout } = useAuth();
  
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="Conversations" 
        component={ConversationsScreen} 
        options={{
          title: 'Messages',
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
              <Icon name="log-out" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <MainStack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }: any) => ({
          title: route.params?.userName || 'Chat',
          headerBackTitle: 'Back',
        })}
      />
      <MainStack.Screen 
        name="NewChat" 
        component={NewChatScreen}
        options={{
          title: 'New Message',
          presentation: 'modal',
        }}
      />
    </MainStack.Navigator>
  );
};

// Auth Stack
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Root Navigator
export const AppNavigator: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
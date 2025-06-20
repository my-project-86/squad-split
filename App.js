// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform } from 'react-native'; // Import Platform

// Import your screens
import Login from './src/containers/Login/Login';
import Dashboard from './src/containers/Dashboard/Dashboard';
import Groups from './src/containers/Groups/Groups';
import AddExpenseScreen from './src/containers/Expense/AddExpenseScreen';
import ProfileScreen from './src/containers/Profile/ProfileScreen';
import GroupDetails from './src/containers/Groups/GroupDetail';
import Signup from './src/containers/Login/SignUp/SignUp';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define your original custom theme
const customTheme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5',      // Original: A modern, vibrant blue (Material Design 500)
    accent: '#FFC107',       // Original: A warm, contrasting amber (Material Design 500)
    background: '#F0F2F5',   // Original: A very light, subtle grey background for depth
    surface: '#FFFFFF',      // Original: Pure white for card-like elements and inputs
    text: '#212121',         // Original: Dark grey for primary text, ensuring readability
    placeholder: '#757575',  // Original: Medium grey for placeholder text
    disabled: '#BDBDBD',     // Original: Light grey for disabled elements
    error: '#D32F2F',        // Original: A clear, strong red for errors
    success: '#4CAF50',      // Original: A distinct green for success/positive balance (added previously)
    onSurface: '#000000',    // Original: Color for text/icons that appear on 'surface' backgrounds
    onBackground: '#000000', // Original: Color for text/icons that appear on 'background' backgrounds
  },
};
console.log("hit")

// --- Main Tab Navigator Component ---
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard" // Ensure this matches a Tab.Screen name
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name === 'Groups') {
            iconName = 'account-group';
          } else if (route.name === 'Activity') {
            iconName = 'cash-multiple'; // Assuming this tab is for adding/viewing expenses
          } else if (route.name === 'Profile') {
            iconName = 'account-circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: customTheme.colors.primary, // Active tab icon/label: original primary blue
        tabBarInactiveTintColor: customTheme.colors.placeholder, // Inactive tab icon/label: original placeholder grey
        tabBarStyle: {
          backgroundColor: customTheme.colors.surface, // Tab bar background: original white surface
          borderTopColor: customTheme.colors.disabled, // Subtle border at the top
          paddingBottom: Platform.OS === 'ios' ? 10 : 0,
          height: Platform.OS === 'ios' ? 70 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false, // Hide header inside tabs
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Groups"
        component={Groups}
        options={{ title: 'Groups' }}
      />
      <Tab.Screen
        name="Activity"
        component={AddExpenseScreen} // Using AddExpenseScreen as Activity for now
        options={{ title: 'Activity' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={customTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={Signup} options={{ headerShown: false }} />
          {/* Renamed to "GroupDetail" to match navigation calls from GroupScreen */}
          <Stack.Screen
            name="Group Details"
            component={GroupDetails}
            options={({ route }) => ({
              title: route.params?.groupName || 'Group Details', // Dynamic title
              presentation: 'modal', // Opens as a full-screen modal
              headerShown: false // Custom header is used in GroupDetailScreen
            })}
          />
          {/* Renamed to "MainTabs" to clearly indicate it's the tab navigator */}
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }} // Hide header for the tab navigator container
          />
          {/* AddExpenseScreen might be opened from GroupDetail, so it needs to be a stack screen */}
          <Stack.Screen
            name="AddExpense"
            component={AddExpenseScreen}
            options={{ title: 'Add Expense' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

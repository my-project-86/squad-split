import React from 'react';
import { View, Text, Button } from 'react-native';

export default function GroupScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Group Details</Text>
      <Button title="Add Expense" onPress={() => navigation.navigate('AddExpense')} />
    </View>
  );
}
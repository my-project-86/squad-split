import React from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function AddExpenseScreen() {
  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Expense Name" style={{ marginBottom: 10 }} />
      <TextInput label="Amount" keyboardType="numeric" style={{ marginBottom: 10 }} />
      <Button mode="contained">Add</Button>
    </View>
  );
}
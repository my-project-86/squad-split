// src/screens/Groups.js
import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native'; // Import Platform for conditional styling
import { Text, useTheme, List, Divider, Button, FAB, IconButton, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GroupDetails() {
  const theme = useTheme();
  const route = useRoute();
  // Safely get groupId and groupName from route.params.
  // These are expected to be passed when navigating from GroupScreen.
  const groupId = route.params?.groupId || null;
  const groupName = route.params?.groupName || 'Group Details';
  const navigation = useNavigation();

  // Dummy data for a specific group's details
  // In a real app, you would fetch this data based on groupId
  const groupMembers = [
    { id: 'm1', name: 'You', balance: 0 }, // Your balance within the group
    { id: 'm2', name: 'Alice', balance: -20.00 }, // Alice owes the group
    { id: 'm3', name: 'Bob', balance: 15.00 }, // The group owes Bob
    { id: 'm4', name: 'Charlie', balance: 5.00 }, // The group owes Charlie
  ];

  const groupExpenses = [
    { id: 'e1', description: 'Groceries', amount: 80.00, paidBy: 'You', date: 'June 10', split: 'Evenly' },
    { id: 'e2', description: 'Dinner', amount: 120.00, paidBy: 'Alice', date: 'June 9', split: 'Unevenly' },
    { id: 'e3', description: 'Movie Tickets', amount: 45.00, paidBy: 'Bob', date: 'June 8', split: 'Evenly' },
  ];

  const groupOverallBalance = -5.00; // Example: The group owes you 5.00 in total, or you owe the group 5.00

  // Function to determine balance text color and icon for individual members/group
  const getMemberBalanceDisplay = (balance) => {
    if (balance > 0) {
      return {
        text: `Owes you: ₹${balance.toFixed(2)}`,
        color: '#4CAF50', // Green for positive (they owe you)
        icon: 'arrow-down-circle-outline',
      };
    } else if (balance < 0) {
      return {
        text: `You owe: ₹${Math.abs(balance).toFixed(2)}`,
        color: theme.colors.error, // Red for negative (you owe them)
        icon: 'arrow-up-circle-outline',
      };
    } else {
      return {
        text: 'Settled up',
        color: theme.colors.placeholder,
        icon: 'check-circle-outline',
      };
    }
  };

  const getGroupOverallBalanceDisplay = (balance) => {
    if (balance > 0) { // If total balance is positive, it means the group collectively owes you
      return {
        text: `Group owes you: ₹${balance.toFixed(2)}`,
        color: '#4CAF50',
        icon: 'arrow-down-circle-outline',
      };
    } else if (balance < 0) { // If total balance is negative, it means you collectively owe the group
      return {
        text: `You owe group: ₹${Math.abs(balance).toFixed(2)}`,
        color: theme.colors.error,
        icon: 'arrow-up-circle-outline',
      };
    } else {
      return {
        text: 'Group settled up',
        color: theme.colors.placeholder,
        icon: 'check-circle-outline',
      };
    }
  };

  const overallBalanceDisplay = getGroupOverallBalanceDisplay(groupOverallBalance);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          {/* Back button: onPress={() => navigation.goBack()} will correctly navigate back
              to the previous screen in the stack, which is the Groups tab/page. */}
          <IconButton
            icon="arrow-left"
            color={theme.colors.text}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={[styles.groupNameTitle, { color: theme.colors.primary }]}>{groupName}</Text>
          <IconButton
            icon="cog-outline"
            color={theme.colors.text}
            size={24}
            onPress={() => Alert.alert('Group Settings', `Go to settings for ${groupName}`)}
            style={styles.settingsButton}
          />
        </View>

        {/* Overall Group Balance Summary */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.summaryCardContent}>
            <MaterialCommunityIcons
              name={overallBalanceDisplay.icon}
              size={30}
              color={overallBalanceDisplay.color}
              style={styles.summaryIcon}
            />
            <View style={styles.summaryTextContainer}>
              <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>Group Balance</Text>
              <Text style={[styles.summaryAmount, { color: overallBalanceDisplay.color }]}>
                {overallBalanceDisplay.text}
              </Text>
            </View>
          </Card.Content>
          <Card.Actions style={styles.summaryActions}>
            <Button
              mode="text"
              onPress={() => Alert.alert('Settle Up', `Initiate settlement for ${groupName}`)}
              labelStyle={{ color: theme.colors.primary }}
            >
              Settle Up
            </Button>
            <Button
              mode="text"
              onPress={() => Alert.alert('Simplify Debts', `View simplified debts for ${groupName}`)}
              labelStyle={{ color: theme.colors.primary }}
            >
              Simplify Debts
            </Button>
          </Card.Actions>
        </Card>

        {/* Group Members Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Title
            title="Members"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => <MaterialCommunityIcons name="account-group-outline" size={24} color={theme.colors.primary} />}
          />
          <Divider />
          <List.Section>
            {groupMembers.map(member => {
              const display = getMemberBalanceDisplay(member.balance);
              return (
                <List.Item
                  key={member.id}
                  title={member.name}
                  description={member.name === 'You' ? '' : display.text}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: display.color }}
                  left={props => <MaterialCommunityIcons name="account-circle-outline" size={20} color={theme.colors.placeholder} />}
                  right={member.name === 'You' ? null : props => (
                    <MaterialCommunityIcons
                      name={display.icon}
                      size={20}
                      color={display.color}
                    />
                  )}
                  style={styles.listItem}
                />
              );
            })}
          </List.Section>
          <Card.Actions style={styles.sectionActions}>
            <Button
              mode="text"
              onPress={() => Alert.alert('Add Member', `Add a new member to ${groupName}`)}
              labelStyle={{ color: theme.colors.primary }}
            >
              Add Member
            </Button>
          </Card.Actions>
        </Card>

        {/* Group Expenses Section */}
        <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Title
            title="Expenses"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => <MaterialCommunityIcons name="cash-multiple" size={24} color={theme.colors.primary} />}
          />
          <Divider />
          <List.Section>
            {groupExpenses.map(expense => (
              <List.Item
                key={expense.id}
                title={expense.description}
                description={`₹${expense.amount.toFixed(2)} paid by ${expense.paidBy} • ${expense.date}`}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.placeholder }}
                left={props => <MaterialCommunityIcons name="currency-inr" size={20} color={theme.colors.secondary} />}
                style={styles.listItem}
              />
            ))}
          </List.Section>
          <Card.Actions style={styles.sectionActions}>
            <Button
              mode="text"
              onPress={() => navigation.navigate('AddExpense')} // Assuming 'AddExpense' is the route name
              labelStyle={{ color: theme.colors.primary }}
            >
              Add Expense
            </Button>
            <Button
              mode="text"
              onPress={() => Alert.alert('View All Expenses', `View all expenses for ${groupName}`)}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>

      {/* FAB for adding new expense to this group */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Add Expense"
        onPress={() => navigation.navigate('AddExpense', { groupId: groupId, groupName: groupName })} // Pass group info to AddExpense screen
        small={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // Conditional padding for iOS if not already handled by SafeAreaView default
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // No need for iOS if SafeAreaView is working
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Add padding for FAB
    // paddingTop: 0 is correct here, as SafeAreaView handles top system insets
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
  },
  backButton: {
    marginRight: 10,
  },
  groupNameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    marginLeft: 10,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 20,
  },
  summaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  summaryIcon: {
    marginRight: 15,
  },
  summaryTextContainer: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  summaryActions: {
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  sectionCard: {
    width: '100%',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listItem: {
    paddingVertical: 0, // Reduce vertical padding
    paddingLeft: 0,     // Adjust left padding if needed
  },
  sectionActions: {
    justifyContent: 'flex-end', // Align buttons to the right
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

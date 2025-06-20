// src/screens/GroupScreen.js
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, useTheme, FAB, Card, List, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './Groups.config';

export default function Groups() {
  const theme = useTheme();
  const navigation = useNavigation();

  // Dummy group data (replace with real data from Firestore later)
  const groups = [
    {
      id: 'grp1',
      name: 'Apartment Buddies',
      members: 4,
      netBalance: -75.00, // You owe this group
      lastActivity: 'Electricity bill added (Yesterday)',
    },
    {
      id: 'grp2',
      name: 'Vacation 2025',
      members: 6,
      netBalance: 110.50, // This group owes you
      lastActivity: 'Flight expense split (2 days ago)',
    },
    {
      id: 'grp3',
      name: 'Dinner Club',
      members: 3,
      netBalance: 0.00, // Settled up
      lastActivity: 'Dinner settled (Last week)',
    },
    {
      id: 'grp4',
      name: 'Weekend Getaway',
      members: 5,
      netBalance: 25.00, // This group owes you
      lastActivity: 'Gas shared (Today)',
    },
  ];

  // Function to determine balance text color and icon
  const getBalanceDisplay = (balance) => {
    if (balance > 0) {
      return {
        text: `You are owed: ₹${balance.toFixed(2)}`,
        color: '#4CAF50', // Green
        icon: 'arrow-down-circle-outline', // Money coming to you
      };
    } else if (balance < 0) {
      return {
        text: `You owe: ₹${Math.abs(balance).toFixed(2)}`,
        color: theme.colors.error, // Red
        icon: 'arrow-up-circle-outline', // Money going from you
      };
    } else {
      return {
        text: 'Settled up',
        color: theme.colors.placeholder,
        icon: 'check-circle-outline',
      };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Your Groups</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Manage your shared expense groups here.
      </Text>

      {groups.length === 0 ? (
        // Empty state message
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={80}
            color={theme.colors.placeholder}
            style={styles.emptyStateIcon}
          />
          <Text style={[styles.emptyStateText, { color: theme.colors.placeholder }]}>
            No groups yet! Tap the '+' button to create your first group.
          </Text>
        </View>
      ) : (
        // List of groups
        <ScrollView style={styles.groupList}>
          {groups.map((group) => {
            const balanceDisplay = getBalanceDisplay(group.netBalance);
            return (
              <Card
                key={group.id}
                style={[styles.groupCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('GroupDetail', { groupId: group.id, groupName: group.name })}
              >
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.groupName, { color: theme.colors.text }]}>
                      {group.name}
                    </Text>
                    <Text style={[styles.groupMembers, { color: theme.colors.placeholder }]}>
                      {group.members} members
                    </Text>
                  </View>
                  <View style={styles.balanceRow}>
                    <MaterialCommunityIcons
                      name={balanceDisplay.icon}
                      size={20}
                      color={balanceDisplay.color}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.groupBalance, { color: balanceDisplay.color }]}>
                      {balanceDisplay.text}
                    </Text>
                  </View>
                  {group.lastActivity && (
                    <Text style={[styles.lastActivity, { color: theme.colors.placeholder }]}>
                      Last activity: {group.lastActivity}
                    </Text>
                  )}
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="text"
                    // onPress={() => navigation.navigate('GroupDetail', { groupId: group.id, groupName: group.name })}
                    onPress={()=>{
                      navigation.replace('Group Details');
                    }}
                    labelStyle={{ color: theme.colors.primary }}
                  >
                    View Group
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
        </ScrollView>
      )}

      {/* FAB for adding new group */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="New Group"
        onPress={() => Alert.alert('Add Group', 'Navigate to add new group screen')}
      />
    </View>
  );
}



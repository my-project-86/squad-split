// Dashboard.js (Now functions as Dashboard)
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  Text,
  useTheme,
  FAB,
  Card,
  List,
  Divider,
  ProgressBar,
  IconButton,
  Button,
  Modal,
  Portal,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";

export default function Dashboard() {
  const theme = useTheme();
  const navigation = useNavigation();

  // State for modal visibility
  const [showOweDetailsModal, setShowOweDetailsModal] = useState(false);
  const [showOwedDetailsModal, setShowOwedDetailsModal] = useState(false);
  const [showBalanceDetailsModal, setShowBalanceDetailsModal] = useState(false); // New state for Balance modal

  // State for active tab in modals
  const [oweTabIndex, setOweTabIndex] = useState(0);
  const [owedTabIndex, setOwedTabIndex] = useState(0);
  const [balanceTabIndex, setBalanceTabIndex] = useState(0); // New state for Balance modal tabs

  // Dummy data for demonstration
  const youOwe = 150.75;
  const youAreOwed = 230.5;
  const balance = youAreOwed - youOwe; // Calculate balance

  // Dummy data for new sections
  const recentActivities = [
    {
      id: "1",
      description: "Paid for groceries",
      amount: 50.0,
      type: "expense",
      date: "Today",
    },
    {
      id: "2",
      description: "Received from John (Dinner)",
      amount: 25.0,
      type: "payment-in",
      date: "Yesterday",
    },
    {
      id: "3",
      description: "Split electricity bill",
      amount: 35.2,
      type: "expense",
      date: "Mon",
    },
    {
      id: "4",
      description: "You paid for movie tickets (Group A)",
      amount: 18.0,
      type: "expense",
      date: "Sun",
    },
  ];

  const upcomingPayments = [
    {
      id: "1",
      description: "Rent due (Group B)",
      amount: 400.0,
      date: "June 25",
    },
    {
      id: "2",
      description: "Return to Sarah (Lunch)",
      amount: 12.5,
      date: "June 18",
    },
  ];

  const topGroups = [
    { id: "1", name: "Apartment Buddies", youOwe: 75.0, status: "owe" },
    { id: "2", name: "Vacation 2025", youAreOwed: 50.0, status: "owed" },
  ];

  const spendingCategories = [
    { name: "Food", spent: 320, total: 500, icon: "food-fork-drink" },
    { name: "Transport", spent: 180, total: 250, icon: "car-side" },
    { name: "Utilities", spent: 100, total: 150, icon: "lightbulb" },
  ];

  const notifications = [
    {
      id: "1",
      message: "New expense added in Apartment Buddies.",
      icon: "bell-outline",
    },
    {
      id: "2",
      message: "John marked dinner as paid.",
      icon: "check-circle-outline",
    },
  ];

  // Dummy data for Owe/Owed Details Modals
  // Enhanced data to clearly support grouping by both group and member
  const youOweDetails = [
    {
      id: "ow1",
      group: "Apartment Buddies",
      member: "Alice",
      description: "Your share of rent",
      amount: 50.0,
      date: "Jun 1",
    },
    {
      id: "ow2",
      group: "Apartment Buddies",
      member: "Bob",
      description: "Electricity bill contribution",
      amount: 25.0,
      date: "May 30",
    },
    {
      id: "ow3",
      group: "Dinner Club",
      member: "Charlie",
      description: "Share of last dinner",
      amount: 30.0,
      date: "Jun 5",
    },
    {
      id: "ow4",
      group: "Dinner Club",
      member: "David",
      description: "Coffee shop payment",
      amount: 12.5,
      date: "Jun 6",
    },
    {
      id: "ow5",
      group: "Apartment Buddies",
      member: "Frank",
      description: "Internet bill",
      amount: 20.0,
      date: "Jun 7",
    },
    {
      id: "ow6",
      group: "Dinner Club",
      member: "Alice",
      description: "Drinks",
      amount: 8.0,
      date: "Jun 8",
    },
  ];

  const youAreOwedDetails = [
    {
      id: "od1",
      group: "Vacation 2025",
      member: "Emily",
      description: "Your share of flight",
      amount: 100.0,
      date: "Jun 10",
    },
    {
      id: "od2",
      group: "Vacation 2025",
      member: "Frank",
      description: "Hotel deposit share",
      amount: 80.0,
      date: "Jun 10",
    },
    {
      id: "od3",
      group: "Apartment Buddies",
      member: "Grace",
      description: "Groceries (your share)",
      amount: 20.5,
      date: "Jun 8",
    },
    {
      id: "od4",
      group: "Work Lunch",
      member: "Henry",
      description: "Lunch reimbursement",
      amount: 15.0,
      date: "Jun 7",
    },
    {
      id: "od5",
      group: "Vacation 2025",
      member: "Henry",
      description: "Car rental",
      amount: 30.0,
      date: "Jun 9",
    },
    {
      id: "od6",
      group: "Work Lunch",
      member: "Emily",
      description: "Coffee",
      amount: 5.0,
      date: "Jun 11",
    },
  ];

  // Function to group details by group name
  const groupDetailsByGroup = (details) => {
    const grouped = {};
    details.forEach((item) => {
      if (!grouped[item.group]) {
        grouped[item.group] = [];
      }
      grouped[item.group].push(item);
    });
    return grouped;
  };

  // Function to group details by member name
  const groupDetailsByMember = (details) => {
    const grouped = {};
    details.forEach((item) => {
      if (!grouped[item.member]) {
        grouped[item.member] = [];
      }
      grouped[item.member].push(item);
    });
    return grouped;
  };

  const groupedOweDetailsByGroup = groupDetailsByGroup(youOweDetails);
  const groupedOweDetailsByMember = groupDetailsByMember(youOweDetails);
  const groupedOwedDetailsByGroup = groupDetailsByGroup(youAreOwedDetails);
  const groupedOwedDetailsByMember = groupDetailsByMember(youAreOwedDetails);

  // New functions to calculate net balance by member and group
  const calculateNetBalanceByMember = () => {
    const netBalances = {}; // { memberName: netAmount }

    // Deduct amounts you owe to members
    youOweDetails.forEach(item => {
      netBalances[item.member] = (netBalances[item.member] || 0) - item.amount;
    });

    // Add amounts you are owed from members
    youAreOwedDetails.forEach(item => {
      netBalances[item.member] = (netBalances[item.member] || 0) + item.amount;
    });

    // Convert to array of objects and filter out zero balances
    return Object.keys(netBalances)
      .filter(member => netBalances[member] !== 0) // Filter out zero balances
      .map(member => ({
        name: member,
        netAmount: netBalances[member],
      }));
  };

  const calculateNetBalanceByGroup = () => {
    const netBalances = {}; // { groupName: netAmount }

    // Deduct amounts you owe within groups
    youOweDetails.forEach(item => {
      netBalances[item.group] = (netBalances[item.group] || 0) - item.amount;
    });

    // Add amounts you are owed within groups
    youAreOwedDetails.forEach(item => {
      netBalances[item.group] = (netBalances[item.group] || 0) + item.amount;
    });

    // Convert to array of objects and filter out zero balances
    return Object.keys(netBalances)
      .filter(group => netBalances[group] !== 0) // Filter out zero balances
      .map(group => ({
        name: group,
        netAmount: netBalances[group],
      }));
  };

  const netBalanceByMember = calculateNetBalanceByMember();
  const netBalanceByGroup = calculateNetBalanceByGroup();


  // Determine balance text color
  const getBalanceColor = () => {
    if (balance > 0) return "#4CAF50"; // Green for positive balance
    if (balance < 0) return theme.colors.error; // Red for negative balance
    return theme.colors.primary; // Default for zero balance
  };

  // Define specific colors for the cards for clear visual distinction
  const youOweAccentColor = theme.colors.error; // Red for 'You Owe'
  const youAreOwedAccentColor = "#4CAF50"; // A distinct green for 'You Are Owed'

  // Tab routes for the modals
  const oweRoutes = [
    { key: "byGroups", title: "By Groups" },
    { key: "byMembers", title: "By Members" },
  ];

  const owedRoutes = [
    { key: "byGroups", title: "By Groups" },
    { key: "byMembers", title: "By Members" },
  ];

  const balanceRoutes = [ // New routes for Balance modal
    { key: "byMembers", title: "By Members" },
    { key: "byGroups", title: "By Groups" },
  ];

  // Render scenes for "You Owe" modal tabs
  const renderOweScene = SceneMap({
    byGroups: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {Object.keys(groupedOweDetailsByGroup).length > 0 ? (
          Object.keys(groupedOweDetailsByGroup).map((groupName, index) => (
            <List.Accordion
              key={index}
              title={groupName}
              left={(props) => (
                <MaterialCommunityIcons
                  name="folder-multiple-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={{verticalAlign:"middle"}}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
              style={styles.accordionHeader}
            >
              {groupedOweDetailsByGroup[groupName].map((item) => (
                <List.Item
                  key={item.id}
                  title={`${item.member}: ${item.description}`}
                  description={`₹${item.amount.toFixed(2)} • ${item.date}`}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.placeholder }}
                  left={(props) => (
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={20}
                      color={theme.colors.error}
                      style={{verticalAlign:"middle"}}
                    />
                  )}
                  style={styles.accordionItem}
                />
              ))}
            </List.Accordion>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: theme.colors.placeholder }]}
          >
            No outstanding debts by group.
          </Text>
        )}
      </ScrollView>
    ),
    byMembers: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {Object.keys(groupedOweDetailsByMember).length > 0 ? (
          Object.keys(groupedOweDetailsByMember).map((memberName, index) => (
            <List.Accordion
              key={index}
              title={memberName}
              left={(props) => (
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                  style={{verticalAlign:"middle"}}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
              style={styles.accordionHeader}
              descriptionStyle={{ color: theme.colors.placeholder }}
            >
              {groupedOweDetailsByMember[memberName].map((item) => (
                <List.Item
                  key={item.id}
                  title={`${item.description} in ${item.group}`}
                  description={`₹${item.amount.toFixed(2)} • ${item.date}`}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.placeholder }}
                  left={(props) => (
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={20}
                      color={theme.colors.error}
                      style={{verticalAlign:"middle"}}
                    />
                  )}
                  style={styles.accordionItem}
                />
              ))}
            </List.Accordion>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: theme.colors.placeholder }]}
          >
            No outstanding debts by member.
          </Text>
        )}
      </ScrollView>
    ),
  });

  // Render scenes for "You Are Owed" modal tabs
  const renderOwedScene = SceneMap({
    byGroups: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {Object.keys(groupedOwedDetailsByGroup).length > 0 ? (
          Object.keys(groupedOwedDetailsByGroup).map((groupName, index) => (
            <List.Accordion
              key={index}
              title={groupName}
              left={(props) => (
                <MaterialCommunityIcons
                  name="folder-multiple-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
              style={styles.accordionHeader}
            >
              {groupedOwedDetailsByGroup[groupName].map((item) => (
                <List.Item
                  key={item.id}
                  title={`${item.member}: ${item.description}`}
                  description={`₹${item.amount.toFixed(2)} • ${item.date}`}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.placeholder }}
                  left={(props) => (
                    <MaterialCommunityIcons
                      name="currency-inr"
                      size={20}
                      color={youAreOwedAccentColor}
                    />
                  )}
                  style={styles.accordionItem}
                />
              ))}
            </List.Accordion>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: theme.colors.placeholder }]}
          >
            No money owed to you by group.
          </Text>
        )}
      </ScrollView>
    ),
    byMembers: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {Object.keys(groupedOwedDetailsByMember).length > 0 ? (
          Object.keys(groupedOwedDetailsByMember).map((memberName, index) => (
            <List.Accordion
              key={index}
              title={memberName}
              left={(props) => (
                <MaterialCommunityIcons
                  name="account-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              )}
              titleStyle={{ color: theme.colors.text }}
              style={styles.accordionHeader}
            >
              {groupedOwedDetailsByMember[memberName].map((item) => (
                <List.Item
                  key={item.id}
                  title={`${item.description} in ${item.group}`}
                  description={`₹${item.amount.toFixed(2)} • ${item.date}`}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.placeholder }}
                  left={props => <MaterialCommunityIcons name="currency-inr" size={20} color={youAreOwedAccentColor} />}
                  style={styles.accordionItem}
                />
              ))}
            </List.Accordion>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: theme.colors.placeholder }]}
          >
            No money owed to you by member.
          </Text>
        )}
      </ScrollView>
    ),
  });

  // Render scenes for "Balance Details" modal tabs
  const renderBalanceScene = SceneMap({
    byMembers: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {netBalanceByMember.length > 0 ? (
          netBalanceByMember.map((item, index) => (
            <List.Item
              key={index}
              title={`${item.name}`}
              description={
                item.netAmount > 0
                  ? `Owes you: ₹${item.netAmount.toFixed(2)}`
                  : `You owe them: ₹${Math.abs(item.netAmount).toFixed(2)}`
              }
              titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
              descriptionStyle={{
                color: item.netAmount > 0 ? '#4CAF50' : theme.colors.error, // Green for positive, red for negative
              }}
              left={props => (
                <MaterialCommunityIcons
                  name={item.netAmount > 0 ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} // Down for owed to you, up for you owe
                  size={24}
                  color={item.netAmount > 0 ? '#4CAF50' : theme.colors.error}
                  style={{verticalAlign:"middle"}}
                />
              )}
              style={styles.listItem}
            />
          ))
        ) : (
          <Text style={[styles.noDataText, { color: theme.colors.placeholder }]}>
            No net balances with members.
          </Text>
        )}
      </ScrollView>
    ),
    byGroups: () => (
      <ScrollView contentContainerStyle={styles.modalScrollContent}>
        {netBalanceByGroup.length > 0 ? (
          netBalanceByGroup.map((item, index) => (
            <List.Item
              key={index}
              title={`${item.name}`}
              description={
                item.netAmount > 0
                  ? `You are owed: ₹${item.netAmount.toFixed(2)}`
                  : `You owe: ₹${Math.abs(item.netAmount).toFixed(2)}`
              }
              titleStyle={{ color: theme.colors.text, fontWeight: 'bold' }}
              descriptionStyle={{
                color: item.netAmount > 0 ? '#4CAF50' : theme.colors.error, // Green for positive, red for negative
              }}
              left={props => (
                <MaterialCommunityIcons
                  name={item.netAmount > 0 ? "arrow-down-circle-outline" : "arrow-up-circle-outline"} // Down for owed to you, up for you owe
                  size={24}
                  color={item.netAmount > 0 ? '#4CAF50' : theme.colors.error}
                  style={{verticalAlign:"middle"}}
                />
              )}
              style={styles.listItem}
            />
          ))
        ) : (
          <Text style={[styles.noDataText, { color: theme.colors.placeholder }]}>
            No net balances with groups.
          </Text>
        )}
      </ScrollView>
    ),
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* App Title / Welcome Message for Dashboard */}
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Dashboard
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>
        Quick overview of your expenses and groups.
      </Text>

      {/* --- Scrollable Content Area --- */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- Owe/Owed Cards Section --- */}
        <View style={styles.summaryCardsContainer}>
          {/* You Owe Card */}
          <Card
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.surface },
            ]}
            // onPress removed from Card, now only the button opens the modal
            rippleColor={theme.colors.primary + "33"} // Subtle ripple effect
          >
            {/* Accent stripe on the left side of the card */}
            <View
              style={[
                styles.cardAccentStripe,
                { backgroundColor: youOweAccentColor },
              ]}
            />
            <Card.Content style={styles.cardContent}>
              <View style={styles.textAndAmountContainer}>
                {/* Title and arrow on the same line, split left/right */}
                <View style={styles.titleAndArrowRow}>
                  <Text
                    style={[styles.cardTitle, { color: theme.colors.text }]}
                  >
                    You Owe
                  </Text>
                  <MaterialCommunityIcons
                    name="arrow-top-right"
                    size={20}
                    color={youOweAccentColor}
                  />
                </View>
                {/* Amount below the title/arrow row */}
                <Text style={[styles.cardAmount, { color: youOweAccentColor }]}>
                  ₹{youOwe.toFixed(2)}
                </Text>
              </View>
              {/* Added View button for opening modal */}
            </Card.Content>
            <View style={{ alignItems: "flex-end", marginTop: "-10px" }}>
              <Button
                mode="text"
                onPress={() => setShowOweDetailsModal(true)}
                labelStyle={{ color: theme.colors.primary }}
                style={{ width: 80, marginRight: 10 }} // Adjusted style for button
              >
                View
              </Button>
            </View>
          </Card>

          {/* You Are Owed Card */}
          <Card
            style={[
              styles.summaryCard,
              { backgroundColor: theme.colors.surface },
            ]}
            // onPress removed from Card, now only the button opens the modal
            rippleColor={theme.colors.primary + "33"} // Subtle ripple effect
          >
            {/* Accent stripe on the left side of the card */}
            <View
              style={[
                styles.cardAccentStripe,
                { backgroundColor: youAreOwedAccentColor },
              ]}
            />

            <Card.Content style={styles.cardContent}>
              {/* Main money icon on the left */}
              {/* Container for the text and arrow on the right */}
              <View style={styles.textAndAmountContainer}>
                {/* Title and arrow on the same line, split left/right */}
                <View style={styles.titleAndArrowRow}>
                  <Text
                    style={[styles.cardTitle, { color: theme.colors.text }]}
                  >
                    You Are Owed
                  </Text>
                  {/* Keeping arrow-up-bold as per user's last provided immersive */}
                  <MaterialCommunityIcons
                    name="arrow-bottom-left"
                    size={20}
                    color={youAreOwedAccentColor}
                  />
                </View>
                {/* Amount below the title/arrow row */}
                <Text
                  style={[styles.cardAmount, { color: youAreOwedAccentColor }]}
                >
                  ₹{youAreOwed.toFixed(2)}
                </Text>
              </View>
              {/* Added View button for opening modal */}
            </Card.Content>
            <View style={{ alignItems: "flex-end", marginTop: "-10px" }}>
              <Button
                mode="text"
                onPress={() => setShowOwedDetailsModal(true)}
                labelStyle={{ color: theme.colors.primary }}
                style={{ width: 80, marginRight: 10 }} // Adjusted style for button
              >
                View
              </Button>
            </View>
          </Card>
        </View>

        {/* --- Balance Card --- */}
        <Card
          style={[
            styles.balanceCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View
            style={[
              styles.cardAccentStripe,
              { backgroundColor: getBalanceColor() },
            ]}
          />
          <Card.Content style={styles.cardContent}>
            {/* Main balance icon on the left */}
            <MaterialCommunityIcons
              name="scale-balance"
              size={32}
              color={getBalanceColor()}
              style={styles.mainCardIcon}
            />
            {/* Container for the text and amount on the right */}
            <View style={styles.textAndAmountContainer}>
              {/* Title on one line */}
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.colors.text, textAlign: "right" },
                ]}
              >
                Balance
              </Text>
              {/* Amount below the title */}
              <Text style={[styles.cardAmount, { color: getBalanceColor() }]}>
                ₹{balance.toFixed(2)}
              </Text>
            </View>
          </Card.Content>
          <View style={{ alignItems: "flex-end", marginTop: "-10px", marginBottom: 10 }}> {/* Added margin to separate from bottom */}
            <Button
              mode="text"
              onPress={() => setShowBalanceDetailsModal(true)} // Open Balance modal
              labelStyle={{ color: theme.colors.primary }}
              style={{ width: 80, marginRight: 10 }}
            >
              View
            </Button>
          </View>
        </Card>

        {/* --- Notifications/Alerts Section --- */}
        {notifications.length > 0 && (
          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title
              title="Notifications"
              titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
              left={(props) => <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.primary} />}
            />
            <Divider />
            <Card.Content>
              {notifications.map(notification => (
                <List.Item
                  key={notification.id}
                  title={notification.message}
                  titleStyle={{ color: theme.colors.text }}
                  left={(props) => <MaterialCommunityIcons name={notification.icon} size={20} color={theme.colors.placeholder} />}
                  style={styles.listItem}
                />
              ))}
            </Card.Content>
          </Card>
        )}

        {/* --- Quick Actions Section --- */}
        <Card
          style={[
            styles.sectionCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Title
            title="Quick Actions"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => (
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Card.Content style={styles.quickActionsContent}>
            <View style={styles.quickActionButtonContainer}>
              <IconButton
                icon="cash-minus"
                size={30}
                color={theme.colors.primary}
                onPress={() => Alert.alert("Action", "Request Money clicked!")}
                style={styles.iconButton}
              />
              <Text
                style={[styles.quickActionText, { color: theme.colors.text }]}
              >
                Request Money
              </Text>
            </View>
            <View style={styles.quickActionButtonContainer}>
              <IconButton
                icon="email-send-outline"
                size={30}
                color={theme.colors.primary}
                onPress={() => Alert.alert("Action", "Send Reminder clicked!")}
                style={styles.iconButton}
              />
              <Text
                style={[styles.quickActionText, { color: theme.colors.text }]}
              >
                Send Reminder
              </Text>
            </View>
            <View style={styles.quickActionButtonContainer}>
              <IconButton
                icon="handshake-outline"
                size={30}
                color={theme.colors.primary}
                onPress={() => Alert.alert("Action", "Settle Up clicked!")}
                style={styles.iconButton}
              />
              <Text
                style={[styles.quickActionText, { color: theme.colors.text }]}
              >
                Settle Up
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* --- Recent Activity Section --- */}
        <Card
          style={[
            styles.sectionCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Title
            title="Recent Activity"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => (
              <MaterialCommunityIcons
                name="history"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <Card.Content>
            {recentActivities.map((activity) => (
              <List.Item
                key={activity.id}
                title={`${activity.description}`}
                description={`₹${activity.amount.toFixed(2)} • ${
                  activity.date
                }`}
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{ color: theme.colors.placeholder }}
                left={(props) => (
                  <MaterialCommunityIcons
                    name={
                      activity.type === "expense"
                        ? "arrow-up-circle-outline"
                        : "arrow-down-circle-outline"
                    }
                    size={20}
                    color={
                      activity.type === "expense"
                        ? theme.colors.error
                        : "#4CAF50"
                    }
                  />
                )}
                style={styles.listItem}
              />
            ))}
            <Button
              mode="text"
              onPress={() => navigation.navigate("Activity")}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All Activity
            </Button>
          </Card.Content>
        </Card>

        {/* --- Upcoming Payments Section --- */}
        {upcomingPayments.length > 0 && (
          <Card style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title
              title="Upcoming Payments"
              titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
              left={(props) => <MaterialCommunityIcons name="calendar-alert" size={24} color={theme.colors.primary} />}
            />
            <Divider />
            <Card.Content>
              {upcomingPayments.map(payment => (
                <List.Item
                  key={payment.id}
                  title={`${payment.description}`}
                  description={`₹${payment.amount.toFixed(2)} due by ${payment.date}`}
                  titleStyle={{ color: theme.colors.text }}
                  descriptionStyle={{ color: theme.colors.error }}
                  left={(props) => <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />}
                  style={styles.listItem}
                />
              ))}
              <Button mode="text" onPress={() => Alert.alert('Upcoming Payments', 'Navigate to payments list.')} labelStyle={{ color: theme.colors.primary }}>
                View All Payments
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* --- Group Highlights Section --- */}
        <Card
          style={[
            styles.sectionCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Title
            title="Your Groups"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => (
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <Card.Content>
            {topGroups.map((group) => (
              <List.Item
                key={group.id}
                title={group.name}
                description={
                  group.status === "owe"
                    ? `You owe ₹${group.youOwe.toFixed(2)}`
                    : `You are owed ₹${group.youAreOwed.toFixed(2)}`
                }
                titleStyle={{ color: theme.colors.text }}
                descriptionStyle={{
                  color:
                    group.status === "owe" ? theme.colors.error : "#4CAF50",
                }}
                left={(props) => (
                  <MaterialCommunityIcons
                    name="folder-multiple-outline"
                    size={20}
                    color={theme.colors.placeholder}
                  />
                )}
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate("Groups", {
                    screen: "GroupDetail",
                    params: { groupId: group.id },
                  })
                } // Example navigation to group detail
              />
            ))}
            <Button
              mode="text"
              onPress={() => navigation.navigate("Groups")}
              labelStyle={{ color: theme.colors.primary }}
            >
              View All Groups
            </Button>
          </Card.Content>
        </Card>

        {/* --- Spending Breakdown Section --- */}
        <Card
          style={[
            styles.sectionCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Title
            title="Spending by Category (This Month)"
            titleStyle={[styles.sectionTitle, { color: theme.colors.text }]}
            left={(props) => (
              <MaterialCommunityIcons
                name="chart-pie"
                size={24}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <Card.Content>
            {spendingCategories.map((category) => (
              <View key={category.name} style={styles.categoryItem}>
                <View style={styles.categoryTextRow}>
                  <MaterialCommunityIcons
                    name={category.icon}
                    size={20}
                    color={theme.colors.placeholder}
                  />
                  <Text
                    style={[styles.categoryName, { color: theme.colors.text }]}
                  >
                    {category.name}
                  </Text>
                  <Text
                    style={[
                      styles.categoryAmount,
                      { color: theme.colors.text },
                    ]}
                  >
                    ₹{category.spent.toFixed(2)}
                  </Text>
                </View>
                <ProgressBar
                  progress={category.spent / category.total}
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
              </View>
            ))}
            <Button
              mode="text"
              onPress={() =>
                Alert.alert(
                  "Spending Report",
                  "Navigate to detailed spending report."
                )
              }
              labelStyle={{ color: theme.colors.primary }}
            >
              View Full Report
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button for Add Expense */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        label="Add Expense"
        onPress={() => navigation.navigate("Activity")}
        small={false}
      />

      {/* --- You Owe Details Modal --- */}
      <Portal>
        <Modal
          visible={showOweDetailsModal}
          onDismiss={() => setShowOweDetailsModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          {/* SafeAreaView ensures content respects notch/status bar area */}
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.surface }}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: theme.colors.surface }]}
              >
                You Owe Details
              </Text>
              {/* Close button removed; onDismiss handles back navigation */}
            </View>

            {/* TabView for 'By Groups' and 'By Members' */}
            <TabView
              navigationState={{ index: oweTabIndex, routes: oweRoutes }}
              renderScene={renderOweScene}
              onIndexChange={setOweTabIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: theme.colors.accent }}
                  style={{ backgroundColor: theme.colors.primary }}
                  labelStyle={{ fontWeight: "bold" }}
                  activeColor={theme.colors.accent}
                  inactiveColor={theme.colors.surface}
                />
              )}
            />
          </SafeAreaView>
        </Modal>
      </Portal>

      {/* --- You Are Owed Details Modal --- */}
      <Portal>
        <Modal
          visible={showOwedDetailsModal}
          onDismiss={() => setShowOwedDetailsModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          {/* SafeAreaView ensures content respects notch/status bar area */}
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.surface }}
          >
            {/* Modal Header */}
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: theme.colors.surface }]}
              >
                You Are Owed Details
              </Text>
              {/* Close button removed; onDismiss handles back navigation */}
            </View>

            {/* TabView for 'By Groups' and 'By Members' */}
            <TabView
              navigationState={{ index: owedTabIndex, routes: owedRoutes }}
              renderScene={renderOwedScene}
              onIndexChange={setOwedTabIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: theme.colors.accent }}
                  style={{ backgroundColor: theme.colors.primary }}
                  labelStyle={{ fontWeight: "bold" }}
                  activeColor={theme.colors.accent}
                  inactiveColor={theme.colors.surface}
                />
              )}
            />
          </SafeAreaView>
        </Modal>
      </Portal>

      {/* --- Balance Details Modal --- */}
      <Portal>
        <Modal
          visible={showBalanceDetailsModal}
          onDismiss={() => setShowBalanceDetailsModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.surface }}
          >
            <View
              style={[
                styles.modalHeader,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[styles.modalTitle, { color: theme.colors.surface }]}
              >
                Overall Balance Details
              </Text>
            </View>
            <TabView
              navigationState={{ index: balanceTabIndex, routes: balanceRoutes }}
              renderScene={renderBalanceScene}
              onIndexChange={setBalanceTabIndex}
              initialLayout={{ width: Dimensions.get("window").width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: theme.colors.accent }}
                  style={{ backgroundColor: theme.colors.primary }}
                  labelStyle={{ fontWeight: "bold" }}
                  activeColor={theme.colors.accent}
                  inactiveColor={theme.colors.surface}
                />
              )}
            />
          </SafeAreaView>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 24,
  },
  summaryCardsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  summaryCard: {
    width: "47%",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 15,
    overflow: "hidden",
  },
  balanceCard: {
    width: "100%",
    borderRadius: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 30,
    overflow: "hidden",
  },
  cardAccentStripe: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 8,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingLeft: 18,
  },
  mainCardIcon: {
    marginRight: 15,
  },
  textAndAmountContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 1,
  },
  titleAndArrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardAmount: {
    fontSize: 26,
    fontWeight: "bold",
  },
  sectionCard: {
    width: "100%",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  listItem: {
    paddingVertical: 0,
    paddingLeft: 0,
  },
  quickActionsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  quickActionButtonContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    minWidth: 80,
  },
  iconButton: {
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginLeft: 8,
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // Modal specific styles
  modalContent: {
    flex: 1,
    backgroundColor: "white", // Explicitly set to white as requested
    margin: 0,
    justifyContent: "flex-start",
    alignItems: "center",
    // Removed paddingTop here, SafeAreaView handles it inside
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center", // Centered title when no close button
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    width: "100%",
  },
  modalScrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  accordionHeader: {
    backgroundColor: "white",
    paddingLeft: 0,
  },
  accordionItem: {
    paddingLeft: 30,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  balanceSummaryText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  balanceSummarySubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 3,
  },
});

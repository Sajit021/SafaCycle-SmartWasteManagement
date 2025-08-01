import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { validateEmail, getRoleColor, formatDate } from "../utils/helpers";

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Driver",
      email: "john@example.com",
      role: "driver",
      status: "active",
      joinDate: "2025-01-15",
      lastActive: "2025-07-31",
    },
    {
      id: 2,
      name: "Sarah Customer",
      email: "sarah@example.com",
      role: "customer",
      status: "active",
      joinDate: "2025-02-20",
      lastActive: "2025-07-30",
    },
    {
      id: 3,
      name: "Mike Admin",
      email: "mike@example.com",
      role: "admin",
      status: "active",
      joinDate: "2025-01-01",
      lastActive: "2025-07-31",
    },
    {
      id: 4,
      name: "Lisa Driver",
      email: "lisa@example.com",
      role: "driver",
      status: "inactive",
      joinDate: "2025-03-10",
      lastActive: "2025-07-25",
    },
    {
      id: 5,
      name: "Tom Customer",
      email: "tom@example.com",
      role: "customer",
      status: "active",
      joinDate: "2025-04-05",
      lastActive: "2025-07-31",
    },
    {
      id: 6,
      name: "Anna Customer",
      email: "anna@example.com",
      role: "customer",
      status: "suspended",
      joinDate: "2025-05-12",
      lastActive: "2025-07-20",
    },
    {
      id: 7,
      name: "Bob Driver",
      email: "bob@example.com",
      role: "driver",
      status: "active",
      joinDate: "2025-06-01",
      lastActive: "2025-07-31",
    },
    {
      id: 8,
      name: "Emma Customer",
      email: "emma@example.com",
      role: "customer",
      status: "active",
      joinDate: "2025-06-15",
      lastActive: "2025-07-29",
    },
  ]);

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "customer",
    status: "active",
  });

  const [editUser, setEditUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "customer",
    status: "active",
  });

  const roles = ["all", "admin", "driver", "customer"];
  const statuses = ["all", "active", "inactive", "suspended"];

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query, selectedRole, selectedStatus);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    filterUsers(searchQuery, role, selectedStatus);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterUsers(searchQuery, selectedRole, status);
  };

  const filterUsers = (query, role, status) => {
    let filtered = users;

    if (query) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (role !== "all") {
      filtered = filtered.filter((user) => user.role === role);
    }

    if (status !== "all") {
      filtered = filtered.filter((user) => user.status === status);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(newUser.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (emailExists) {
      Alert.alert("Error", "A user with this email already exists");
      return;
    }

    const newUserData = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      ...newUser,
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: new Date().toISOString().split("T")[0],
    };

    setUsers([...users, newUserData]);
    setFilteredUsers([...users, newUserData]);
    setNewUser({ name: "", email: "", role: "customer", status: "active" });
    setShowAddUserModal(false);
    Alert.alert("Success", "User added successfully");
  };

  const handleEditUser = () => {
    if (!editUser.name.trim() || !editUser.email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(editUser.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === editUser.email.toLowerCase() && user.id !== editUser.id
    );
    if (emailExists) {
      Alert.alert("Error", "A user with this email already exists");
      return;
    }

    updateUser(editUser);
    setEditUser({ id: null, name: "", email: "", role: "customer", status: "active" });
    setShowEditUserModal(false);
    Alert.alert("Success", "User updated successfully");
  };

  const handleUserAction = (user, action) => {
    switch (action) {
      case "view":
        setSelectedUser(user);
        setShowUserDetailsModal(true);
        break;
      case "edit":
        setEditUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        });
        setShowEditUserModal(true);
        break;
      case "activate":
        updateUserStatus(user.id, "active");
        break;
      case "deactivate":
        updateUserStatus(user.id, "inactive");
        break;
      case "suspend":
        Alert.alert(
          "Suspend User",
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Suspend",
              style: "destructive",
              onPress: () => updateUserStatus(user.id, "suspended"),
            },
          ]
        );
        break;
      case "delete":
        Alert.alert(
          "Delete User",
          `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteUser(user.id),
            },
          ]
        );
        break;
    }
  };

  const updateUserStatus = (userId, newStatus) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(
      updatedUsers.filter((user) => {
        let matches = true;
        if (searchQuery) {
          matches =
            matches &&
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedRole !== "all")
          matches = matches && user.role === selectedRole;
        if (selectedStatus !== "all")
          matches = matches && user.status === selectedStatus;
        return matches;
      })
    );
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const updateUser = (userData) => {
    const updatedUsers = users.map((user) =>
      user.id === userData.id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(
      updatedUsers.filter((user) => {
        let matches = true;
        if (searchQuery) {
          matches =
            matches &&
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedRole !== "all")
          matches = matches && user.role === selectedRole;
        if (selectedStatus !== "all")
          matches = matches && user.status === selectedStatus;
        return matches;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "inactive":
        return COLORS.warning;
      case "suspended":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "✅";
      case "inactive":
        return "⏸️";
      case "suspended":
        return "🚫";
      default:
        return "❓";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "👑";
      case "driver":
        return "🚛";
      case "customer":
        return "🏠";
      default:
        return "👤";
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admins: users.filter((u) => u.role === "admin").length,
    drivers: users.filter((u) => u.role === "driver").length,
    customers: users.filter((u) => u.role === "customer").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.primary + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{userStats.total}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{userStats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.admin + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{userStats.admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: COLORS.driver + "20" },
              ]}
            >
              <Text style={styles.statNumber}>{userStats.drivers}</Text>
              <Text style={styles.statLabel}>Drivers</Text>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name or email..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Role:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {roles.map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterChip,
                    selectedRole === role && styles.filterChipSelected,
                  ]}
                  onPress={() => handleRoleFilter(role)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedRole === role && styles.filterChipTextSelected,
                    ]}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    selectedStatus === status && styles.filterChipSelected,
                  ]}
                  onPress={() => handleStatusFilter(status)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedStatus === status &&
                        styles.filterChipTextSelected,
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Add User Button */}
        <CustomButton
          title="Add New User"
          onPress={() => setShowAddUserModal(true)}
          style={styles.addButton}
        />

        {/* Users List */}
        <View style={styles.usersContainer}>
          <Text style={styles.sectionTitle}>
            Users ({filteredUsers.length})
          </Text>
          {filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userLeft}>
                  <View
                    style={[
                      styles.roleIcon,
                      { backgroundColor: getRoleColor(user.role) + "20" },
                    ]}
                  >
                    <Text style={styles.roleIconText}>
                      {getRoleIcon(user.role)}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userMeta}>
                      Joined: {formatDate(user.joinDate)} • Last active:{" "}
                      {formatDate(user.lastActive)}
                    </Text>
                  </View>
                </View>
                <View style={styles.userRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(user.status) + "20" },
                    ]}
                  >
                    <Text style={styles.statusIcon}>
                      {getStatusIcon(user.status)}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(user.status) },
                      ]}
                    >
                      {user.status.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: getRoleColor(user.role) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        { color: getRoleColor(user.role) },
                      ]}
                    >
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.userActions}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.info },
                  ]}
                  onPress={() => handleUserAction(user, "view")}
                >
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.warning },
                  ]}
                  onPress={() => handleUserAction(user, "edit")}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                {user.status === "active" ? (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.error },
                    ]}
                    onPress={() => handleUserAction(user, "suspend")}
                  >
                    <Text style={styles.actionButtonText}>Suspend</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: COLORS.success },
                    ]}
                    onPress={() => handleUserAction(user, "activate")}
                  >
                    <Text style={styles.actionButtonText}>Activate</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: COLORS.error },
                  ]}
                  onPress={() => handleUserAction(user, "delete")}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add User Modal */}
        <Modal
          visible={showAddUserModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowAddUserModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New User</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
                placeholderTextColor={COLORS.textLight}
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.textLight}
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.roleSelection}>
                <Text style={styles.modalLabel}>Role:</Text>
                <View style={styles.roleOptions}>
                  {["admin", "driver", "customer"].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        newUser.role === role && styles.roleOptionSelected,
                      ]}
                      onPress={() => setNewUser({ ...newUser, role })}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          newUser.role === role &&
                            styles.roleOptionTextSelected,
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowAddUserModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddUser}
                >
                  <Text style={styles.confirmButtonText}>Add User</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          visible={showEditUserModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEditUserModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit User</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Full Name"
                placeholderTextColor={COLORS.textLight}
                value={editUser.name}
                onChangeText={(text) => setEditUser({ ...editUser, name: text })}
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.textLight}
                value={editUser.email}
                onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.roleSelection}>
                <Text style={styles.modalLabel}>Role:</Text>
                <View style={styles.roleOptions}>
                  {["admin", "driver", "customer"].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.roleOption,
                        editUser.role === role && styles.roleOptionSelected,
                      ]}
                      onPress={() => setEditUser({ ...editUser, role })}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          editUser.role === role &&
                            styles.roleOptionTextSelected,
                        ]}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.roleSelection}>
                <Text style={styles.modalLabel}>Status:</Text>
                <View style={styles.roleOptions}>
                  {["active", "inactive", "suspended"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.roleOption,
                        editUser.status === status && styles.roleOptionSelected,
                      ]}
                      onPress={() => setEditUser({ ...editUser, status })}
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          editUser.status === status &&
                            styles.roleOptionTextSelected,
                        ]}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowEditUserModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleEditUser}
                >
                  <Text style={styles.confirmButtonText}>Update User</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* User Details Modal */}
        <Modal
          visible={showUserDetailsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUserDetailsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedUser && (
                <>
                  <Text style={styles.modalTitle}>User Details</Text>
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Name:</Text>
                      <Text style={styles.detailValue}>
                        {selectedUser.name}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>
                        {selectedUser.email}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Role:</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: getRoleColor(selectedUser.role) },
                        ]}
                      >
                        {selectedUser.role.charAt(0).toUpperCase() +
                          selectedUser.role.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: getStatusColor(selectedUser.status) },
                        ]}
                      >
                        {selectedUser.status.charAt(0).toUpperCase() +
                          selectedUser.status.slice(1)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Join Date:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedUser.joinDate)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Active:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(selectedUser.lastActive)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => setShowUserDetailsModal(false)}
                  >
                    <Text style={styles.confirmButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  statsContainer: {
    marginBottom: SIZES.large,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginHorizontal: SIZES.small / 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: SIZES.medium,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  filtersContainer: {
    marginBottom: SIZES.large,
  },
  filterSection: {
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusLarge,
    marginRight: SIZES.small,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: COLORS.surface,
  },
  addButton: {
    marginBottom: SIZES.large,
  },
  usersContainer: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  userCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  userLeft: {
    flexDirection: "row",
    flex: 1,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  roleIconText: {
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  userRight: {
    alignItems: "flex-end",
    gap: SIZES.small,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  roleBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },
  roleText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  userActions: {
    flexDirection: "row",
    gap: SIZES.small,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
    alignItems: "center",
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.large,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  modalLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  roleSelection: {
    marginBottom: SIZES.large,
  },
  roleOptions: {
    flexDirection: "row",
    gap: SIZES.small,
  },
  roleOption: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  roleOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleOptionText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "500",
  },
  roleOptionTextSelected: {
    color: COLORS.surface,
  },
  modalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  detailsContainer: {
    marginBottom: SIZES.large,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  detailLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
});

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (city: string) => void;
  loading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  loading,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => onSearch(searchQuery)}
          placeholderTextColor="#999"
          editable={!loading}
        />
        {searchQuery.length > 0 && !loading && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={() => onSearch(searchQuery)}
        disabled={loading}
      >
        <Text style={styles.searchButtonText}>
          {loading ? "..." : "Search"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  searchButtonDisabled: {
    backgroundColor: "#A0CFFF",
  },
  searchButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

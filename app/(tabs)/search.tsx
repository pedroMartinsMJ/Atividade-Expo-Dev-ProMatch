import { ProfessionalCard } from '@/components/professional-card';
import { Colors } from '@/constants/theme';
import { professionals } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const categories = [
  { id: "design", name: "Design", icon: "palette-outline" },
  { id: "photo", name: "Photography", icon: "camera-outline" },
  { id: "code", name: "Development", icon: "code-slash-outline" },
  { id: "writing", name: "Writing", icon: "pencil-outline" },
];

const urgencyLevels = [
  { id: "anytime", label: "Anytime" },
  { id: "week", label: "This Week" },
  { id: "urgent", label: "Urgent" },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [mode, setMode] = useState<"hire" | "work">("hire");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("anytime");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Smart Search</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Find exactly what you need</Text>
        </View>

        {/* Mode Toggle */}
        <View style={[styles.toggleContainer, { backgroundColor: colors.secondary }]}>
          <TouchableOpacity
            onPress={() => setMode("hire")}
            style={[
              styles.toggleButton,
              mode === "hire" && styles.toggleButtonActive
            ]}
          >
            <Ionicons name="briefcase" size={18} color={mode === "hire" ? "white" : colors.icon} />
            <Text style={[styles.toggleText, mode === "hire" ? styles.toggleTextActive : { color: colors.icon }]}>
              I want to Hire
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode("work")}
            style={[
              styles.toggleButton,
              mode === "work" && styles.toggleButtonActive
            ]}
          >
            <Ionicons name="person" size={18} color={mode === "work" ? "white" : colors.icon} />
            <Text style={[styles.toggleText, mode === "work" ? styles.toggleTextActive : { color: colors.icon }]}>
              I want to Work
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.icon} />
          <TextInput
            placeholder={mode === "hire" ? "Search for professionals..." : "Search for jobs..."}
            placeholderTextColor={colors.icon}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.icon }]}>CATEGORIES</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
                style={[
                  styles.categoryCard,
                  { backgroundColor: colors.secondary, borderColor: colors.border },
                  selectedCategory === category.id && { borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' }
                ]}
              >
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? '#06b6d4' : colors.icon} 
                />
                <Text style={[
                  styles.categoryName, 
                  { color: selectedCategory === category.id ? '#06b6d4' : colors.text }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Urgency Filter */}
        {mode === "hire" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="flash" size={16} color="#06b6d4" />
              <Text style={[styles.sectionTitle, { color: colors.icon, marginLeft: 4, marginBottom: 0 }]}>URGENCY LEVEL</Text>
            </View>
            <View style={styles.urgencyContainer}>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setSelectedUrgency(level.id)}
                  style={[
                    styles.urgencyButton,
                    { backgroundColor: colors.secondary, borderColor: colors.border },
                    selectedUrgency === level.id && styles.urgencyButtonActive
                  ]}
                >
                  <Text style={[
                    styles.urgencyText,
                    selectedUrgency === level.id ? styles.urgencyTextActive : { color: colors.icon }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: colors.icon }]}>
            {professionals.length} {mode === "hire" ? "professionals" : "opportunities"} found
          </Text>
          {selectedCategory && (
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearFilters}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.resultsList}>
          {professionals.map((pro) => (
            <ProfessionalCard key={pro.id} professional={pro} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#06b6d4',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  urgencyButtonActive: {
    backgroundColor: '#06b6d4',
    borderColor: '#06b6d4',
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  urgencyTextActive: {
    color: 'white',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 13,
  },
  clearFilters: {
    fontSize: 13,
    color: '#06b6d4',
    fontWeight: '500',
  },
  resultsList: {
    gap: 12,
  },
});

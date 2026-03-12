import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MatchItem } from '@/components/match-item';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Match, Professional } from '@/data/mock-data';

export default function MatchesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState<"new" | "ongoing" | "completed">("new");
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadMatches();
  }, [activeTab]);

  const loadMatches = async () => {
    setLoading(true);
    const matchedProfessionals = await api.getMatches();
    
    // Converte os profissionais em objetos do tipo Match para a interface
    const formattedMatches: Match[] = matchedProfessionals.map((pro, index) => ({
      id: `m-${pro.id}`,
      professional: pro,
      status: index % 3 === 0 ? "new" : index % 3 === 1 ? "ongoing" : "completed", // Simulação de status
      lastMessage: "Olá! Vi seu perfil e achei muito interessante...",
      timestamp: new Date().toISOString(),
      safePayment: true,
      projectName: pro.roles[0] || "Projeto ProMatch"
    }));

    setMatches(formattedMatches);
    setLoading(false);
  };

  const filteredMatches = matches.filter((match) => match.status === activeTab);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Match Hub</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>Suas conexões e projetos</Text>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.secondary }]}>
          <TouchableOpacity
            onPress={() => setActiveTab("new")}
            style={[
              styles.tabButton,
              activeTab === "new" && styles.tabButtonActive
            ]}
          >
            <Text style={[styles.tabText, activeTab === "new" ? styles.tabTextActive : { color: colors.icon }]}>
              Novos
            </Text>
            {matches.filter((m) => m.status === "new").length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{matches.filter((m) => m.status === "new").length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("ongoing")}
            style={[
              styles.tabButton,
              activeTab === "ongoing" && styles.tabButtonActive
            ]}
          >
            <Text style={[styles.tabText, activeTab === "ongoing" ? styles.tabTextActive : { color: colors.icon }]}>
              Ativos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("completed")}
            style={[
              styles.tabButton,
              activeTab === "completed" && styles.tabButtonActive
            ]}
          >
            <Text style={[styles.tabText, activeTab === "completed" ? styles.tabTextActive : { color: colors.icon }]}>
              Concluídos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Matches List */}
        {loading ? (
          <ActivityIndicator size="large" color="#06b6d4" style={{ marginTop: 40 }} />
        ) : filteredMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Ionicons name="chatbubbles-outline" size={32} color={colors.icon} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhum match em "{activeTab}"</Text>
            <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
              {activeTab === "new" && "Comece a explorar o Discovery para encontrar profissionais!"}
              {activeTab === "ongoing" && "Seus projetos ativos aparecerão aqui."}
              {activeTab === "completed" && "Projetos finalizados serão listados aqui."}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredMatches.map((match) => (
              <MatchItem key={match.id} match={match} />
            ))}
          </View>
        )}

        {/* Safe Payment Info */}
        {activeTab === "ongoing" && filteredMatches.length > 0 && (
          <View style={[styles.infoCard, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <Ionicons name="shield-checkmark" size={24} color="#10b981" />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Proteção de Pagamento Ativa</Text>
              <Text style={styles.infoSubtitle}>
                Seus pagamentos estão seguros até que as etapas do projeto sejam concluídas.
              </Text>
            </View>
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    position: 'relative',
  },
  tabButtonActive: {
    backgroundColor: '#06b6d4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: 'white',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  list: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  infoSubtitle: {
    color: '#717182',
    fontSize: 13,
    lineHeight: 18,
  },
});

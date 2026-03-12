import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DiscoveryCard } from '@/components/discovery-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Professional } from '@/data/mock-data';

export default function DiscoveryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = async () => {
    setLoading(true);
    const data = await api.getProfessionals();
    setProfessionals(data);
    setLoading(false);
  };

  const currentProfessional = professionals[currentIndex];

  const handleLike = async () => {
    if (!currentProfessional) return;
    await api.likeProfessional(currentProfessional.id);
    nextCard();
  };

  const handlePass = async () => {
    if (!currentProfessional) return;
    await api.passProfessional(currentProfessional.id);
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </SafeAreaView>
    );
  }

  if (!currentProfessional) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={64} color={colors.icon} style={{ marginBottom: 16 }} />
          <Text style={[styles.emptyText, { color: colors.text }]}>Tudo limpo por aqui!</Text>
          <Text style={[styles.emptySubtitle, { color: colors.icon }]}>Você já viu todos os profissionais disponíveis no momento.</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={loadProfessionals}>
            <Text style={styles.refreshButtonText}>Recarregar Feed</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.logo, { color: colors.text }]}>
          Pro<Text style={styles.logoHighlight}>Match</Text>
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>Encontre seu match profissional ideal</Text>
      </View>

      <View style={styles.cardStack}>
        {/* Background cards for depth */}
        {professionals.slice(currentIndex + 1, currentIndex + 3).map((pro, index) => (
          <View
            key={pro.id}
            style={[
              styles.backgroundCard,
              { 
                backgroundColor: colors.background, 
                borderColor: colors.border,
                zIndex: -index - 1,
                transform: [
                  { scale: 1 - (index + 1) * 0.05 },
                  { translateY: (index + 1) * -15 }
                ],
                opacity: 0.5 - index * 0.2
              }
            ]}
          />
        ))}

        <DiscoveryCard
          key={currentProfessional.id}
          professional={currentProfessional}
          onLike={handleLike}
          onPass={handlePass}
          isFirst={true}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.passButton, { borderColor: '#ef4444' }]}
          onPress={handlePass}
        >
          <Ionicons name="close" size={32} color="#ef4444" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleLike}
        >
          <Ionicons name="heart" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  logoHighlight: {
    color: '#06b6d4',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  cardStack: {
    flex: 1,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backgroundCard: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 32,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  passButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  likeButton: {
    backgroundColor: '#06b6d4',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

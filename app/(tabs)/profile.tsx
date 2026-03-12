import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { api } from '@/services/api';
import { useEffect } from 'react';

export default function UserProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const currentUser = await api.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.icon }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null; // O layout já redireciona

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header de Perfil */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.imageEditContainer}>
            <Image
              source={{ uri: user.mainPhoto }}
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={styles.editIconBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.userEmail, { color: colors.icon }]}>{user.email}</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.editButton, { borderColor: '#06b6d4' }]}
              onPress={() => router.push('/profile/edit')}
            >
              <Text style={{ color: '#06b6d4', fontWeight: 'bold' }}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Informações do Perfil */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {user.accountType === 'provider' ? 'Sobre Mim' : 'Sobre a Empresa/Contratante'}
              </Text>
              <TouchableOpacity onPress={() => router.push('/profile/edit')}><Ionicons name="pencil" size={16} color="#06b6d4" /></TouchableOpacity>
            </View>
            <Text style={[styles.bioText, { color: colors.icon }]}>
              {user.bio || "Nenhuma bio cadastrada ainda."}
            </Text>
          </View>

          {user.accountType === 'seeker' && user.projectDescription && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Projeto Principal</Text>
                <TouchableOpacity onPress={() => router.push('/profile/edit')}><Ionicons name="pencil" size={16} color="#06b6d4" /></TouchableOpacity>
              </View>
              <Text style={[styles.bioText, { color: colors.icon }]}>{user.projectDescription}</Text>
              {user.budget && (
                <Text style={[styles.budgetBadge, { color: '#10b981', marginTop: 8 }]}>Orçamento: {user.budget}</Text>
              )}
            </View>
          )}

          {/* Habilidades / Tecnologias */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {user.accountType === 'provider' ? 'Minhas Habilidades' : 'Tecnologias do Projeto'}
              </Text>
              <TouchableOpacity onPress={() => router.push('/profile/edit')}><Ionicons name="add" size={20} color="#06b6d4" /></TouchableOpacity>
            </View>
            <View style={styles.skillsContainer}>
              {user.skills.map((skill: string, index: number) => (
                <View key={index} style={[styles.skillBadge, { backgroundColor: colors.secondary }]}>
                  <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                </View>
              ))}
              {user.skills.length === 0 && (
                <Text style={{ color: colors.icon, fontSize: 14 }}>Nenhuma habilidade adicionada.</Text>
              )}
            </View>
          </View>

          {/* Menu de Configurações */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]}>
              <Ionicons name="settings-outline" size={24} color={colors.text} />
              <Text style={[styles.menuText, { color: colors.text }]}>Configurações</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
              <Text style={[styles.menuText, { color: '#ef4444' }]}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  imageEditContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#06b6d4',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#06b6d4',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
  },
  budgetBadge: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
});

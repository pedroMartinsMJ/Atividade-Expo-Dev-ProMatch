import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { api } from '@/services/api';
import * as Location from 'expo-location';

export default function RegisterScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: type === 'provider' ? '' : '', // Provider: Profissão, Seeker: O que busca
    location: '',
    hourlyRate: '',
    budget: '', // Novo: Orçamento para Seeker
    bio: '',
    skills: '', // Provider: Tech Skills, Seeker: Techs do Projeto
    projectDescription: '', // Novo: Descrição do projeto para Seeker
  });

  const requestLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão de localização negada.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, timeout: 5000 });
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const city = address.city || address.subregion;
        const state = address.region;
        const cityState = [city, state].filter(Boolean).join(', ');
        setFormData(prev => ({ ...prev, location: cityState }));
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao obter localização.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await api.registerUser({
        name: formData.name,
        email: formData.email,
        roles: [formData.role],
        location: formData.location,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        budget: formData.budget,
        bio: formData.bio,
        projectDescription: formData.projectDescription,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
        accountType: type as 'provider' | 'seeker',
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {type === 'provider' ? 'Perfil Profissional' : 'Perfil do Cliente'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Complete seu cadastro para começar.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Nome Completo *</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                placeholder="Ex: Sarah Chen"
                placeholderTextColor={colors.icon}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.icon }]}>E-mail *</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                  placeholder="seu@email.com"
                  placeholderTextColor={colors.icon}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({...formData, email: text})}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Senha *</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={colors.icon}
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.icon }]}>Localização</Text>
                <View style={styles.locationInputContainer}>
                  <TextInput 
                    style={[styles.input, { flex: 1, backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                    placeholder="Cidade, UF"
                    placeholderTextColor={colors.icon}
                    value={formData.location}
                    onChangeText={(text) => setFormData({...formData, location: text})}
                  />
                  <TouchableOpacity 
                    style={[styles.locationButton, { backgroundColor: colors.accent }]} 
                    onPress={requestLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? (
                      <ActivityIndicator size="small" color="#06b6d4" />
                    ) : (
                      <Ionicons name="location" size={20} color="#06b6d4" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {type === 'provider' ? (
                <View style={[styles.inputGroup, { width: 120 }]}>
                  <Text style={[styles.label, { color: colors.icon }]}>Valor/hora</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                    placeholder="R$"
                    placeholderTextColor={colors.icon}
                    keyboardType="numeric"
                    value={formData.hourlyRate}
                    onChangeText={(text) => setFormData({...formData, hourlyRate: text})}
                  />
                </View>
              ) : (
                <View style={[styles.inputGroup, { width: 140 }]}>
                  <Text style={[styles.label, { color: colors.icon }]}>Orçamento</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                    placeholder="Ex: R$ 2k"
                    placeholderTextColor={colors.icon}
                    value={formData.budget}
                    onChangeText={(text) => setFormData({...formData, budget: text})}
                  />
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>
                {type === 'provider' ? 'Sua Profissão Principal' : 'O que você busca contratar?'}
              </Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                placeholder={type === 'provider' ? 'Ex: Designer Gráfico' : 'Ex: Desenvolvedor Mobile'}
                placeholderTextColor={colors.icon}
                value={formData.role}
                onChangeText={(text) => setFormData({...formData, role: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>
                {type === 'provider' ? 'Habilidades (separadas por vírgula)' : 'Tecnologias do Projeto (separadas por vírgula)'}
              </Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                placeholder={type === 'provider' ? 'Ex: React, Figma, Branding' : 'Ex: React Native, Node.js, AWS'}
                placeholderTextColor={colors.icon}
                value={formData.skills}
                onChangeText={(text) => setFormData({...formData, skills: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>
                {type === 'provider' ? 'Bio Profissional' : 'Descrição do Projeto'}
              </Text>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                placeholder={type === 'provider' ? 'Conte um pouco sobre sua experiência...' : 'Descreva o que você precisa que seja feito...'}
                placeholderTextColor={colors.icon}
                multiline
                numberOfLines={4}
                value={type === 'provider' ? formData.bio : formData.projectDescription}
                onChangeText={(text) => setFormData(prev => ({ 
                  ...prev, 
                  [type === 'provider' ? 'bio' : 'projectDescription']: text 
                }))}
              />
            </View>

            {type === 'seeker' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.icon }]}>Sobre Você/Sua Empresa</Text>
                <TextInput 
                  style={[styles.input, styles.textArea, { backgroundColor: colors.secondary, borderColor: colors.border, color: colors.text }]}
                  placeholder="Conte um pouco sobre quem está contratando..."
                  placeholderTextColor={colors.icon}
                  multiline
                  numberOfLines={3}
                  value={formData.bio}
                  onChangeText={(text) => setFormData({...formData, bio: text})}
                />
              </View>
            )}

            <TouchableOpacity 
              style={[
                styles.button, 
                { backgroundColor: type === 'provider' ? '#10b981' : '#06b6d4' },
                loading && { opacity: 0.7 }
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Processando...' : 'Finalizar Cadastro'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

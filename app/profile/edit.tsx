import { Colors } from '@/constants/theme';
import { Professional, Service } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { api } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

export default function EditProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [formData, setFormData] = useState<Partial<Professional>>({
    name: '',
    location: '',
    bio: '',
    roles: [],
    skills: [],
    portfolio: [],
    services: [],
    mainPhoto: '',
    accountType: 'seeker',
    budget: '',
    projectDescription: '',
  });

  // Estados temporários para inputs de listas
  const [tempRole, setTempRole] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempPortfolio, setTempPortfolio] = useState('');
  
  // Estado para novo serviço
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await api.getCurrentUser();
    if (user) {
      setFormData(user);
    }
    setLoading(false);
  };

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Precisamos de acesso às suas fotos para mudar a imagem de perfil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, mainPhoto: result.assets[0].uri }));
      setShowPhotoOptions(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Precisamos de acesso à sua câmera para tirar uma nova foto de perfil.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, mainPhoto: result.assets[0].uri }));
      setShowPhotoOptions(false);
    }
  };

  const addPortfolioImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Precisamos de acesso às suas fotos para adicionar ao portfólio.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const newUris = result.assets.map(asset => asset.uri);
      setFormData(prev => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), ...newUris]
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateProfile(formData);
      router.back();
    } catch (error) {
      alert('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: 'roles' | 'skills' | 'portfolio', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));
    setter('');
  };

  const removeItem = (field: 'roles' | 'skills' | 'portfolio', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (!newService.name || !newService.price) return;
    const service: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      price: newService.price,
      description: newService.description || ''
    };
    setFormData(prev => ({
      ...prev,
      services: [...(prev.services || []), service]
    }));
    setNewService({ name: '', price: '', description: '' });
    setShowServiceForm(false);
  };

  const removeService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: (prev.services || []).filter(s => s.id !== id)
    }));
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Perfil</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#06b6d4" />
            ) : (
              <Text style={styles.saveText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Foto de Perfil */}
          <View style={styles.photoSection}>
            <TouchableOpacity 
              style={styles.photoContainer}
              onPress={() => setShowPhotoOptions(true)}
            >
              <Image 
                source={{ uri: formData.mainPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }} 
                style={styles.profileImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.photoHint, { color: colors.icon }]}>Toque para mudar a foto</Text>
          </View>

          {/* Modal de Opções de Foto */}
          {showPhotoOptions && (
            <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Mudar foto de perfil</Text>
                
                <TouchableOpacity style={styles.modalOption} onPress={pickImage}>
                  <Ionicons name="images" size={24} color="#06b6d4" />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>Escolher da galeria</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.modalOption} onPress={takePhoto}>
                  <Ionicons name="camera" size={24} color="#06b6d4" />
                  <Text style={[styles.modalOptionText, { color: colors.text }]}>Tirar nova foto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalOption, styles.modalCancel]} 
                  onPress={() => setShowPhotoOptions(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Informações Básicas */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Informações Básicas</Text>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Nome</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>Localização</Text>
              <View style={styles.locationInputContainer}>
                <TextInput 
                  style={[styles.input, { flex: 1, backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                  value={formData.location}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
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

            {formData.accountType === 'provider' ? (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.icon }]}>Valor por Hora (R$)</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                  value={formData.hourlyRate?.toString()}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(text) || 0 }))}
                  keyboardType="numeric"
                />
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.icon }]}>Orçamento do Projeto</Text>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                  value={formData.budget}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, budget: text }))}
                  placeholder="Ex: R$ 5.000"
                  placeholderTextColor={colors.icon}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.icon }]}>
                {formData.accountType === 'provider' ? 'Bio Profissional' : 'Sobre Você / Empresa'}
              </Text>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                value={formData.bio}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
                multiline
                numberOfLines={4}
              />
            </View>

            {formData.accountType === 'seeker' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.icon }]}>Descrição do Projeto Principal</Text>
                <TextInput 
                  style={[styles.input, styles.textArea, { backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                  value={formData.projectDescription}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, projectDescription: text }))}
                  multiline
                  numberOfLines={4}
                  placeholder="Descreva o que você precisa..."
                  placeholderTextColor={colors.icon}
                />
              </View>
            )}
          </View>

          {/* Cargos / Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {formData.accountType === 'provider' ? 'Cargos / Atuações' : 'O que você busca'}
            </Text>
            <View style={styles.tagInputRow}>
              <TextInput 
                style={[styles.input, { flex: 1, backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                placeholder={formData.accountType === 'provider' ? "Ex: Graphic Designer" : "Ex: Desenvolvedor React"}
                placeholderTextColor={colors.icon}
                value={tempRole}
                onChangeText={setTempRole}
              />
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('roles', tempRole, setTempRole)}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.roles?.map((role, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{role}</Text>
                  <TouchableOpacity onPress={() => removeItem('roles', index)}>
                    <Ionicons name="close-circle" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {formData.accountType === 'provider' ? 'Habilidades Técnicas' : 'Tecnologias Necessárias'}
            </Text>
            <View style={styles.tagInputRow}>
              <TextInput 
                style={[styles.input, { flex: 1, backgroundColor: colors.secondary, color: colors.text, borderColor: colors.border }]}
                placeholder={formData.accountType === 'provider' ? "Ex: React, Photoshop" : "Ex: Node.js, AWS"}
                placeholderTextColor={colors.icon}
                value={tempSkill}
                onChangeText={setTempSkill}
              />
              <TouchableOpacity style={[styles.addButton, { backgroundColor: '#10b981' }]} onPress={() => addItem('skills', tempSkill, setTempSkill)}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.tagContainer}>
              {formData.skills?.map((skill, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: '#10b981' }]}>
                  <Text style={styles.tagText}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeItem('skills', index)}>
                    <Ionicons name="close-circle" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Portfólio / Projetos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {formData.accountType === 'provider' ? 'Meu Portfólio' : 'Referências do Projeto'}
              </Text>
              <TouchableOpacity style={styles.addPortfolioBtn} onPress={addPortfolioImage}>
                <Ionicons name="add-circle" size={24} color="#06b6d4" />
                <Text style={styles.addPortfolioBtnText}>Adicionar Fotos</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.portfolioGrid}>
              {formData.portfolio?.map((url, index) => (
                <View key={index} style={styles.portfolioItem}>
                  <Image source={{ uri: url }} style={styles.portfolioThumb} />
                  <TouchableOpacity style={styles.removePhoto} onPress={() => removeItem('portfolio', index)}>
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {formData.portfolio?.length === 0 && (
                <TouchableOpacity style={styles.emptyPortfolio} onPress={addPortfolioImage}>
                  <Ionicons name="images-outline" size={32} color={colors.icon} />
                  <Text style={[styles.emptyPortfolioText, { color: colors.icon }]}>Nenhuma foto adicionada</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Menu de Serviços */}
          <View style={[styles.section, { marginBottom: 60 }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Menu de Serviços</Text>
              <TouchableOpacity onPress={() => setShowServiceForm(!showServiceForm)}>
                <Ionicons name={showServiceForm ? "remove-circle" : "add-circle"} size={28} color="#06b6d4" />
              </TouchableOpacity>
            </View>

            {showServiceForm && (
              <View style={[styles.serviceForm, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Nome do Serviço"
                  placeholderTextColor={colors.icon}
                  value={newService.name}
                  onChangeText={text => setNewService(prev => ({ ...prev, name: text }))}
                />
                <TextInput 
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Preço (Ex: R$ 500)"
                  placeholderTextColor={colors.icon}
                  value={newService.price}
                  onChangeText={text => setNewService(prev => ({ ...prev, price: text }))}
                />
                <TextInput 
                  style={[styles.input, styles.textAreaSmall, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  placeholder="Descrição rápida"
                  placeholderTextColor={colors.icon}
                  multiline
                  value={newService.description}
                  onChangeText={text => setNewService(prev => ({ ...prev, description: text }))}
                />
                <TouchableOpacity style={styles.addServiceBtn} onPress={addService}>
                  <Text style={styles.addServiceBtnText}>Adicionar Serviço</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.servicesList}>
              {formData.services?.map((service) => (
                <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <View style={styles.serviceInfo}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeService(service.id)}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  saveText: {
    color: '#06b6d4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#06b6d4',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#06b6d4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  photoHint: {
    marginTop: 10,
    fontSize: 14,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalCancel: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    paddingTop: 20,
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
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
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    height: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#06b6d4',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addPortfolioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addPortfolioBtnText: {
    color: '#06b6d4',
    fontWeight: 'bold',
    fontSize: 14,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  portfolioItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioThumb: {
    width: '100%',
    height: '100%',
  },
  emptyPortfolio: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emptyPortfolioText: {
    fontSize: 14,
  },
  removePhoto: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 2,
  },
  serviceForm: {
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    marginBottom: 20,
  },
  addServiceBtn: {
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addServiceBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  servicesList: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    color: '#06b6d4',
    fontWeight: 'bold',
  },
});

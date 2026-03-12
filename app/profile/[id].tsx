import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { professionals } from '@/data/mock-data';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const professional = professionals.find((p) => p.id === id);
  
  if (!professional) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.icon }}>Professional not found</Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <Image
            source={{ uri: professional.mainPhoto }}
            style={styles.headerImage}
            contentFit="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Verified Badge */}
          {professional.verified && (
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons name="check-decagram" size={16} color="white" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={[styles.name, { color: colors.text }]}>{professional.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={colors.icon} />
              <Text style={[styles.locationText, { color: colors.icon }]}>{professional.location}</Text>
            </View>
            <View style={styles.rolesContainer}>
              {professional.roles.map((role, index) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="chatbubble-outline" size={20} color="white" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
              <Ionicons name="heart-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {/* Personal Bio */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Bio</Text>
            </View>
            <Text style={[styles.bioText, { color: colors.icon }]}>{professional.bio}</Text>
          </View>
          
          {/* Professional Skills */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Professional Skills</Text>
            </View>
            <View style={styles.skillsContainer}>
              {professional.skills.map((skill, index) => (
                <View key={index} style={[styles.skillBadge, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Portfolio */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Portfolio</Text>
              <TouchableOpacity style={styles.viewAll}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="open-outline" size={14} color="#06b6d4" />
              </TouchableOpacity>
            </View>
            <View style={styles.portfolioGrid}>
              {professional.portfolio.map((image, index) => (
                <View key={index} style={styles.portfolioItem}>
                  <Image source={{ uri: image }} style={styles.portfolioImage} contentFit="cover" />
                </View>
              ))}
            </View>
          </View>
          
          {/* Service Menu */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Menu</Text>
            </View>
            <View style={styles.servicesList}>
              {professional.services.map((service) => (
                <View key={service.id} style={[styles.serviceCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <View style={styles.serviceHeader}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>{service.name}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                  <Text style={[styles.serviceDescription, { color: colors.icon }]}>{service.description}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Client Testimonials */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIndicator} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Client Testimonials</Text>
            </View>
            <View style={styles.testimonialsList}>
              {professional.testimonials.map((testimonial) => (
                <View key={testimonial.id} style={[styles.testimonialCard, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                  <View style={styles.testimonialHeader}>
                    <Text style={[styles.clientName, { color: colors.text }]}>{testimonial.client}</Text>
                    <View style={styles.rating}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons 
                          key={i} 
                          name={i < testimonial.rating ? "star" : "star-outline"} 
                          size={14} 
                          color="#facc15" 
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={[styles.testimonialText, { color: colors.text }]}>"{testimonial.text}"</Text>
                  <Text style={[styles.testimonialDate, { color: colors.icon }]}>
                    {new Date(testimonial.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Match Rate Card */}
          <View style={styles.matchRateCard}>
            <Text style={styles.matchRateValue}>{professional.matchRate}%</Text>
            <Text style={styles.matchRateLabel}>Match Rate with Your Needs</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 182, 212, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  verifiedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: 'transparent',
  },
  section: {
    marginBottom: 32,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
  },
  rolesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  roleText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#06b6d4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: '#06b6d4',
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 14,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: '600',
  },
  portfolioGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  portfolioItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servicePrice: {
    color: '#06b6d4',
    fontWeight: 'bold',
    fontSize: 16,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  testimonialsList: {
    gap: 12,
  },
  testimonialCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  testimonialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  testimonialDate: {
    fontSize: 12,
  },
  matchRateCard: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  matchRateValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#06b6d4',
    marginBottom: 4,
  },
  matchRateLabel: {
    fontSize: 14,
    color: '#717182',
  },
});

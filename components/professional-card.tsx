import { Colors } from '@/constants/theme';
import { Professional } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  professional: Professional;
}

export const ProfessionalCard = ({ professional }: Props) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => router.push(`/profile/${professional.id}`)}
    >
      <Image
        source={{ uri: professional.mainPhoto }}
        style={styles.avatar}
        contentFit="cover"
      />
      
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{professional.name}</Text>
        <Text style={[styles.roles, { color: colors.icon }]} numberOfLines={1}>
          {professional.roles.join(' • ')}
        </Text>
        
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={12} color={colors.icon} />
            <Text style={[styles.metaText, { color: colors.icon }]}>{professional.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={12} color={colors.icon} />
            <Text style={[styles.metaText, { color: colors.icon }]}>${professional.hourlyRate}/hr</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.icon} />
            <Text style={[styles.metaText, { color: colors.icon }]}>Available</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.stats}>
        <Text style={styles.matchRate}>{professional.matchRate}%</Text>
        <Ionicons name="chevron-forward" size={16} color="#06b6d4" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roles: {
    fontSize: 13,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  stats: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  matchRate: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10b981',
  },
});

import { Colors } from '@/constants/theme';
import { Match } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  match: Match;
}

export const MatchItem = ({ match }: Props) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getStatusIcon = (status: Match["status"]) => {
    switch (status) {
      case "new":
        return <MaterialCommunityIcons name="sparkles" size={12} color="#facc15" />;
      case "ongoing":
        return <View style={styles.statusDot} />;
      case "completed":
        return <Ionicons name="checkmark-circle" size={14} color="#10b981" />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={() => router.push(`/profile/${match.professional.id}`)}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: match.professional.mainPhoto }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={[styles.statusIconContainer, { backgroundColor: colors.background }]}>
            {getStatusIcon(match.status)}
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>{match.professional.name}</Text>
              {match.projectName && (
                <Text style={styles.projectName}>{match.projectName}</Text>
              )}
            </View>
            <View style={styles.meta}>
              {match.safePayment && (
                <Ionicons name="shield-checkmark" size={14} color="#10b981" />
              )}
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color={colors.icon} />
                <Text style={[styles.timeText, { color: colors.icon }]}>{formatTime(match.timestamp)}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.lastMessage, { color: colors.icon }]} numberOfLines={1}>
            {match.lastMessage}
          </Text>

          <View style={styles.roles}>
            {match.professional.roles.map((role, index) => (
              <View key={index} style={[styles.roleBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.roleText, { color: colors.icon }]}>{role}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {match.status === 'new' && (
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={styles.newMatchText}>New Match!</Text>
          <Text style={[styles.sayHello, { color: colors.icon }]}>Say hello 👋</Text>
        </View>
      )}

      {match.status === 'ongoing' && match.safePayment && (
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.safePayment}>
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text style={[styles.footerText, { color: colors.icon }]}>Safe Payment Active</Text>
          </View>
          <Text style={styles.protectedText}>Protected</Text>
        </View>
      )}

      {match.status === 'completed' && (
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.safePayment}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={[styles.footerText, { color: colors.icon }]}>Project Completed</Text>
          </View>
          <Text style={styles.reviewText}>Leave Review</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  statusIconContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectName: {
    fontSize: 11,
    color: '#717182',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  timeText: {
    fontSize: 11,
  },
  lastMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  roles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '500',
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newMatchText: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
  },
  sayHello: {
    fontSize: 12,
  },
  safePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
  },
  protectedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  reviewText: {
    color: '#06b6d4',
    fontSize: 12,
    fontWeight: '600',
  },
});

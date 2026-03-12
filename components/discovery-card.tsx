import { Colors } from '@/constants/theme';
import { Professional } from '@/data/mock-data';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

interface Props {
  professional: Professional;
  onLike: () => void;
  onPass: () => void;
  isFirst: boolean;
}

export const DiscoveryCard = ({ professional, onLike, onPass, isFirst }: Props) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isFirst) return;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (!isFirst) return;
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0) {
          translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(onLike)();
          });
        } else {
          translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(onPass)();
          });
        }
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-10, 0, 10],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, -SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4, SCREEN_WIDTH / 2],
      [0.8, 1, 1, 1, 0.8],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` }
      ],
      opacity,
    };
  });

  const likeOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SCREEN_WIDTH / 4], [0, 1], Extrapolation.CLAMP),
  }));

  const passOpacityStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SCREEN_WIDTH / 4, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }, isFirst && animatedStyle]}>
        {/* Main Photo */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: professional.mainPhoto }}
            style={styles.image}
            contentFit="cover"
          />
          
          {/* Badges */}
          <View style={styles.topBadges}>
            <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.9)' }]}>
              <Text style={styles.badgeText}>{professional.matchRate}% Match</Text>
            </View>
            
            {professional.verified && (
              <View style={[styles.badge, { backgroundColor: 'rgba(6, 182, 212, 0.9)' }]}>
                <MaterialCommunityIcons name="check-decagram" size={14} color="white" />
                <Text style={[styles.badgeText, { marginLeft: 4 }]}>Verified</Text>
              </View>
            )}
          </View>

          {/* Swipe Indicators */}
          <Animated.View style={[styles.indicator, styles.likeIndicator, likeOpacityStyle]}>
            <Text style={styles.indicatorText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.indicator, styles.passIndicator, passOpacityStyle]}>
            <Text style={styles.indicatorText}>PASS</Text>
          </Animated.View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.name, { color: colors.text }]}>{professional.name}</Text>
              <Text style={[styles.location, { color: colors.icon }]}>{professional.location}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MULTI-PRO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rolesContainer}>
              {professional.roles.map((role, index) => (
                <View key={index} style={styles.roleBadge}>
                  <Text style={styles.roleText}>{role}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUICK PORTFOLIO</Text>
              <TouchableOpacity 
                style={styles.viewProfile}
                onPress={() => router.push(`/profile/${professional.id}`)}
              >
                <Text style={styles.viewProfileText}>View Full Profile</Text>
                <Ionicons name="arrow-forward" size={12} color="#06b6d4" />
              </TouchableOpacity>
            </View>
            <View style={styles.portfolioGrid}>
              {professional.portfolio.map((img, index) => (
                <View key={index} style={styles.portfolioItem}>
                  <Image source={{ uri: img }} style={styles.portfolioImage} contentFit="cover" />
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.bio, { color: colors.text }]} numberOfLines={2}>
            {professional.bio}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    height: '45%',
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#717182',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  rolesContainer: {
    flexDirection: 'row',
  },
  roleBadge: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  roleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  viewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 10,
    color: '#06b6d4',
    marginRight: 4,
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
  bio: {
    fontSize: 13,
    lineHeight: 18,
  },
  indicator: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderRadius: 8,
    zIndex: 100,
  },
  likeIndicator: {
    left: 30,
    borderColor: '#10b981',
    transform: [{ rotate: '-15deg' }],
  },
  passIndicator: {
    right: 30,
    borderColor: '#ef4444',
    transform: [{ rotate: '15deg' }],
  },
  indicatorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AuthIndex() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleSelection = (type: 'provider' | 'seeker') => {
    router.push({
      pathname: '/auth/register',
      params: { type }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.text }]}>
            Pro<Text style={styles.logoHighlight}>Match</Text>
          </Text>
          <Text style={[styles.title, { color: colors.text }]}>Bem-vindo!</Text>
          <Text style={[styles.subtitle, { color: colors.icon }]}>
            Conectando talentos e oportunidades em um só lugar.
          </Text>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: '#06b6d4' }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: '#06b6d4' }]}
            onPress={() => handleSelection('seeker')}
          >
            <Text style={[styles.secondaryButtonText, { color: '#06b6d4' }]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.icon }]}>
            Ao continuar, você concorda com nossos Termos de Uso.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoHighlight: {
    color: '#06b6d4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  actionGrid: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

import { Professional, professionals as initialProfessionals } from '@/data/mock-data';

/**
 * SERVIÇO DE API MOCK EM MEMÓRIA (ESTILO CREATE-DROP)
 * Este serviço armazena os dados apenas na memória do dispositivo enquanto o app está rodando.
 * Ao reiniciar o app (Full Reload), os dados voltam ao estado inicial.
 * Ideal para testes de Front-End sem persistência permanente.
 */

class MockDatabase {
  private users: Professional[] = [];
  private currentUser: Professional | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;
    
    // Inicializa com dados fake do mock-data
    this.users = initialProfessionals.map(u => ({
      ...u,
      likedIds: u.likedIds || [],
      passedIds: u.passedIds || []
    }));
    this.isInitialized = true;
  }

  // Simula GET /professionals (Feed Discovery)
  async getProfessionals(): Promise<Professional[]> {
    const user = this.currentUser;
    if (!user) return this.users;

    const excludedIds = [
      user.id,
      ...(user.likedIds || []),
      ...(user.passedIds || [])
    ];

    // Seeker vê Provider, Provider vê Seeker
    const targetType = user.accountType === 'seeker' ? 'provider' : 'seeker';

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.users.filter(u => 
          !excludedIds.includes(u.id) && 
          u.accountType === targetType
        ));
      }, 300);
    });
  }

  // Simula POST /auth/login
  async login(email: string, password: string): Promise<Professional | null> {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }

  // Simula POST /auth/register
  async registerUser(userData: Partial<Professional>): Promise<Professional> {
    const newUser: Professional = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      mainPhoto: userData.mainPhoto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      verified: false,
      roles: userData.roles || [],
      portfolio: userData.portfolio || [],
      matchRate: Math.floor(Math.random() * 20) + 80,
      bio: userData.bio || '',
      skills: userData.skills || [],
      testimonials: [],
      services: userData.services || [],
      location: userData.location || 'Brasil',
      hourlyRate: userData.hourlyRate || 0,
      email: userData.email,
      accountType: userData.accountType || 'seeker',
      budget: userData.budget || '',
      projectDescription: userData.projectDescription || '',
      likedIds: [],
      passedIds: [],
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  }

  // Simula GET /auth/me
  async getCurrentUser(): Promise<Professional | null> {
    return this.currentUser;
  }

  // Simula POST /auth/logout
  async logout() {
    this.currentUser = null;
  }

  // Simula Like
  async likeProfessional(targetId: string) {
    if (!this.currentUser) return;

    this.currentUser.likedIds = [...(this.currentUser.likedIds || []), targetId];
    
    // Atualiza na lista global também
    this.users = this.users.map(u => u.id === this.currentUser?.id ? this.currentUser : u);
  }

  // Simula Pass
  async passProfessional(targetId: string) {
    if (!this.currentUser) return;

    this.currentUser.passedIds = [...(this.currentUser.passedIds || []), targetId];
    
    // Atualiza na lista global também
    this.users = this.users.map(u => u.id === this.currentUser?.id ? this.currentUser : u);
  }

  // Simula GET /matches (Match HUB)
  async getMatches(): Promise<Professional[]> {
    if (!this.currentUser || !this.currentUser.likedIds) return [];
    return this.users.filter(u => this.currentUser?.likedIds?.includes(u.id));
  }

  // Simula PUT /profile
  async updateProfile(userData: Partial<Professional>): Promise<Professional | null> {
    if (!this.currentUser) return null;

    const updated = { ...this.currentUser, ...userData };
    this.currentUser = updated;
    
    this.users = this.users.map(u => u.id === updated.id ? updated : u);
    return updated;
  }
}

export const api = new MockDatabase();

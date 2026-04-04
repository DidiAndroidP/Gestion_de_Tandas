import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UserEntity } from '../entities/UserEntity';
import { UserRepository } from '../../../domain/ports/UserRepository';
import { User } from '../../../domain/entities/User';

export class MySQLUserRepository implements UserRepository {
  private repository: Repository<UserEntity>;

  constructor() {
    this.repository = AppDataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<User> {
    const userEntity = this.repository.create({
      id: user.id !== 0 ? user.id : undefined,
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      phone: user.phone || undefined,  
      photo: user.photo || undefined,  
      role: user.role,
      active: user.active,
      failedAttempts: user.failedAttempts,
    });
    
    const savedEntity = await this.repository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.repository.findOne({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async update(user: User): Promise<void> {
    await this.repository.update(user.id, {
      name: user.name,
      phone: user.phone || undefined,  
      photo: user.photo || undefined,  
      active: user.active,
      failedAttempts: user.failedAttempts,
    });
  }

  async updateFcmToken(userId: number, token: string): Promise<void> {
    await this.repository.update(userId, { fcmToken: token });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.phone || null,  
      entity.photo || null,  
      entity.role,
      entity.active,
      entity.failedAttempts,
      entity.createdAt
    );
  }
}
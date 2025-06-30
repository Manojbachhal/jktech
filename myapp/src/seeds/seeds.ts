import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

import { faker } from '@faker-js/faker';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/enums/role.enum';

const roles: Role[] = [Role.ADMIN, Role.EDITOR, Role.VIEWER];
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  for (let i = 0; i < 1000; i++) {
    const user = {
      email: faker.internet.email(),
      password: '123456',
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(roles),
    };

    await authService.register(user);
  }

  console.log('Seeded 1000 users');
  await app.close();
}

bootstrap();

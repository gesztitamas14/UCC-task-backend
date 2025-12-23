import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './src/users/user.entity';
import { Event } from './src/events/event.entity'; 


async function main() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'admin',
    database: 'event_manager',
    entities: [User, Event],
    synchronize: true,
  });

  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const email = 'test@gmail.com';
  const password = 'testpw';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = userRepository.create({
    email,
    password_hash: hashedPassword,
    role: UserRole.USER,
  });

  await userRepository.save(user);
  console.log('User created:', email);

  await dataSource.destroy();
}

main().catch(err => console.error(err));

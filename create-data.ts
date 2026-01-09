/* docker compose exec backend node dist/create-data.js */

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './src/users/user.entity';

import { Event } from './src/events/event.entity';
import { KnowledgeBaseEntry } from 'src/knowledge-base/entities/knowledge-base.entity';

async function waitForDB(dataSource: DataSource, retries = 10, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await dataSource.initialize();
      console.log('DB connected!');
      return dataSource;
    } catch (err) {
      console.log(`DB not ready yet, retrying in ${delayMs / 1000}s...`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
  throw new Error('Could not connect to DB after several retries');
}

async function main() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'admin',
    database: process.env.DB_NAME || 'event_manager',
    entities: [User, KnowledgeBaseEntry, Event],
    synchronize: true,
  });

  const ds = await waitForDB(dataSource);

  const usersRepo = ds.getRepository(User);
  const users = [
  {
    email: process.env.USER1_EMAIL!,
    password: process.env.USER1_PASSWORD!,
    role: process.env.USER1_ROLE as UserRole,
  },
  {
    email: process.env.USER2_EMAIL!,
    password: process.env.USER2_PASSWORD!,
    role: process.env.USER2_ROLE as UserRole,
  },
];

  for (const u of users) {
    const exists = await usersRepo.findOneBy({ email: u.email });
    if (!exists) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      const user = usersRepo.create({
        email: u.email,
        password_hash: passwordHash,
        role: u.role,
        is_active: true,
        created_at: new Date(),
      });
      await usersRepo.save(user);
      console.log(`User created: ${u.email}`);
    }
  }

  const kbRepo = ds.getRepository(KnowledgeBaseEntry);
  const kbData = [
    {
      title: 'Forgot Password',
      keywords: ['forgot', 'password', 'reset', 'lost'],
      answer: "If you forgot your password, you can reset it by clicking the 'Forgot Password?' link on the login page.",
      active: true,
      created_at: new Date('2026-01-03 09:51:46'),
      updated_at: new Date('2026-01-03 09:51:46'),
    },
    {
      title: 'Create New Events',
      keywords: ['create', 'new', 'event', 'add', 'schedule'],
      answer: "To create a new event, click on the 'Add New Event' button. Fill in the details and save.",
      active: true,
      created_at: new Date('2026-01-03 09:51:46'),
      updated_at: new Date('2026-01-03 09:51:46'),
    },
    {
      title: 'Delete/Remove Events',
      keywords: ['delete', 'remove', 'event', 'cancel', 'erase'],
      answer: "To remove an event, click on the 'Delete' button or bin icon on the end of the line.",
      active: true,
      created_at: new Date('2026-01-03 09:51:46'),
      updated_at: new Date('2026-01-03 09:51:46'),
    },
    {
      title: 'Update Event Description',
      keywords: ['update', 'edit', 'change', 'event', 'description', 'rename'],
      answer: "To update an event's description, click on the 'Edit' button or pen icon, that will open a sidebar where you can edit the description field, and save your changes.",
      active: true,
      created_at: new Date('2026-01-03 09:51:46'),
      updated_at: new Date('2026-01-03 09:51:46'),
    },
    {
      title: 'List All Events',
      keywords: ['list', 'show', 'events', 'all', 'overview'],
      answer: "To see all your events, log in to the page. You can filter and search to find specific ones.",
      active: true,
      created_at: new Date('2026-01-03 09:51:46'),
      updated_at: new Date('2026-01-03 09:51:46'),
    },
  ];

  for (const kb of kbData) {
    const exists = await kbRepo.findOneBy({ title: kb.title });
    if (!exists) {
      await kbRepo.save(kbRepo.create(kb));
      console.log(`KB entry created: ${kb.title}`);
    }
  }

  await ds.destroy();
  console.log('Seeding complete!');
}

main().catch(err => console.error(err));

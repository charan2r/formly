/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import AppDataSource from '../../ormconfig';
import { Organization } from 'src/model/organization.entity';
import { User } from 'src/model/user.entity';

const seedDatabase = async () => {
    const dataSource: DataSource = await AppDataSource.initialize();
    console.log("Database connected!");
  
    const organizationRepo = dataSource.getRepository(Organization);
    const userRepo = dataSource.getRepository(User);

    try {
        const user1 = new User();
        user1.firstName = 'platform';
        user1.lastName = 'admin';
        user1.email = 'padminn@example.com';
        user1.passwordHash = 'Padmin';
        user1.userType = 'SuperSuperAdmin';
        user1.createdAt = new Date();
        user1.updatedAt = new Date();

        const user2 = new User();
        user2.firstName = 'super';
        user2.lastName = 'admin';
        user2.email = 'sadmin@example.com';
        user2.passwordHash = 'sadmin'; 
        user2.userType = 'SuperAdmin'; 
        user2.createdAt = new Date();
        user2.updatedAt = new Date();

        const user3 = new User();
        user3.firstName = 'sub';
        user3.lastName = 'user';
        user3.email = 'suser@example.com';
        user3.passwordHash = 'suser'; 
        user3.userType = 'SubUser'; 
        user3.createdAt = new Date();
        user3.updatedAt = new Date();

        await userRepo.save([user1, user2,user3]);
        console.log("Users have been seeded!");

        // Create organization
        const organization = new Organization();
        organization.orgId = user2.id; 
        organization.name = 'My Organization';
        organization.superSuperAdminId = user1.id;
        organization.createdAt = new Date();
        organization.updatedAt = new Date();

        await organizationRepo.save(organization);
        console.log("Organization has been seeded!");

    } catch (error) {
        console.error("Error during data seeding:", error);
    } finally {
        await dataSource.destroy();
        console.log("Database connection closed.");
    }
};

seedDatabase();
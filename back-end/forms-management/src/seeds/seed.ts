// seed.ts
import { User } from "src/model/user.entity";
import { Organization } from "src/model/organization.entity";
import AppDataSource from "ormconfig";

async function seed() {
    await AppDataSource.initialize();

    // Create some users
    const user1 = new User();
    user1.firstName = "John";
    user1.lastName = "Doe";
    user1.email = "john.doe@example.com";
    user1.passwordHash = "hashedpassword1";
    user1.userType = "SuperSuperAdmin";
    user1.superUserId = null;

    const user2 = new User();
    user2.firstName = "Jane";
    user2.lastName = "Smith";
    user2.email = "jane.smith@example.com";
    user2.passwordHash = "hashedpassword2";
    user2.userType = "SuperAdmin";
    user2.superUserId = user1.id;

    await AppDataSource.manager.save([user1, user2]);

    // Create an organization
    const org1 = new Organization();
    org1.name = "Tech Solutions";
    org1.superSuperAdminId = user1.id;
    org1.category = "IT Services";
    org1.lastActive = new Date();
    org1.createdAt = new Date(Date.now() - 25 * 24 * 60 * 60 * 1000); // Set createdAt to one week ago
    org1.users = [user1, user2];

    await AppDataSource.manager.save(org1);

    console.log("Seeding completed.");
    await AppDataSource.destroy();
}

seed().catch((error) => console.log(error));

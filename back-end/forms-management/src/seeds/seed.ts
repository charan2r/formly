import { User } from "src/model/user.entity";
import { Organization } from "src/model/organization.entity";
import AppDataSource from "ormconfig";

async function seed() {
    await AppDataSource.initialize();

    // Step 1: Create a Super Super Admin User
    const user1 = new User();
    user1.firstName = "John";
    user1.lastName = "Doe";
    user1.email = "john.doe@example.com";
    user1.passwordHash = "hashedpassword1"; // Normally, use a proper hashing function
    user1.userType = "PlatformAdmin"; // Updated role
    user1.organizationId = null; // This user doesn't belong to a specific organization

    await AppDataSource.manager.save(user1);

    // Step 2: Create an Organization
    const org1 = new Organization();
    org1.name = "Tech Solutions";
    org1.superAdminId = user1.id;
    org1.category = "IT Services";
    org1.lastActive = new Date();
    org1.createdAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Set createdAt to one week ago

    await AppDataSource.manager.save(org1);

    // Step 3: Create a Super Admin User associated with the organization
    const user2 = new User();
    user2.firstName = "Jane";
    user2.lastName = "Smith";
    user2.email = "jane.smith@example.com";
    user2.passwordHash = "hashedpassword2"; // Use hashed password
    user2.userType = "SuperAdmin";
    user2.organizationId = org1.orgId; // Assign org1's ID to user2 after saving org1

    await AppDataSource.manager.save(user2);

    // Step 4: Update org1's user relationship with both users
    org1.users = [user1, user2];
    await AppDataSource.manager.save(org1);

    console.log("Seeding completed.");
    await AppDataSource.destroy();
}

seed().catch((error) => console.log(error));


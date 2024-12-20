import AppDataSource from "ormconfig";
import { User } from "src/model/user.entity";

async function seedSuperAdmin() {
    await AppDataSource.initialize();

    const superAdmin = new User();
    superAdmin.firstName = "Super";
    superAdmin.lastName = "Admin";
    superAdmin.email = "super@admin.com";
    superAdmin.passwordHash = "hashedpassword";
    superAdmin.userType = "SuperAdmin";
    superAdmin.organizationId = null;

    try {
        const savedAdmin = await AppDataSource.manager.save(superAdmin);
        console.log("Seeding the superAdmin completed:", savedAdmin);
    } catch (error) {
        console.error("Error saving superAdmin:", error);
    }
}

seedSuperAdmin().catch((error) => console.log("Error during seeding:",error));

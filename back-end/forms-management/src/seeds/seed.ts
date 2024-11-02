/* eslint-disable prettier/prettier */
import { User } from 'src/model/user.entity';
import { Organization } from 'src/model/organization.entity';
import bcrypt from 'bcrypt';
import AppDataSource from 'ormconfig';

async function seed() {
    // Initialize the data source
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);
    const organizationRepository = AppDataSource.getRepository(Organization);

    // Creating users
    const hashedPassword = await bcrypt.hash('defaultpassword', 10);
    
    const superSuperAdmin = userRepository.create({
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@admin.com',
        passwordHash: hashedPassword,
        userType: 'SuperSuperAdmin',
        superUserId: null,
    });
    
    const superAdmin = userRepository.create({
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@superadmin.com',
        passwordHash: hashedPassword,
        userType: 'SuperAdmin',
        superUserId: superSuperAdmin.id,
    });

    const subUser = userRepository.create({
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@user.com',
        passwordHash: hashedPassword,
        userType: 'SubUser',
        superUserId: superAdmin.id,
    });

    // Save users to the database
    await userRepository.save([superSuperAdmin, superAdmin, subUser]);

    // Creating organizations
    const organization1 = organizationRepository.create({
        name: 'Org One',
        superSuperAdminId: superSuperAdmin.id,
    });

    const organization2 = organizationRepository.create({
        name: 'Org Two',
        superSuperAdminId: superSuperAdmin.id,
    });

    // Save organizations to the database first
    const savedOrganizations = await organizationRepository.save([organization1, organization2]);

    // Establish relationships after saving organizations
    savedOrganizations[0].users = [superSuperAdmin, superAdmin]; // Org One users
    savedOrganizations[1].users = [superSuperAdmin, subUser]; // Org Two users

    // Save organizations again to update the relationships
    await organizationRepository.save(savedOrganizations);

    console.log('Seeding completed.');
    await AppDataSource.destroy();
}

seed().catch((error) => {
    console.error('Error seeding data:', error);
    AppDataSource.destroy();
});

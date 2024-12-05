import { Permission } from "src/model/permission.entity";
import AppDataSource from "ormconfig";

async function seedPermissions() {
    await AppDataSource.initialize();

    // Define the new permissions
    const newPermissions = [
        // Permissions for form fields
        { name: 'create feilds' },
        { name: 'view Fields' },
        { name: 'view Field' },
        { name: 'delete Field' },
        { name: 'Delete Fields' },
        { name: 'Edit Fields' },

        // Permissions for form field options
        { name: 'add feild option' },
        { name: 'view feild options' },
        { name: 'view feild option' },
        { name: 'edit feild options' },
        { name: 'delete feild option' },
        { name: 'delete feild options' },

        // Permissions for form templates
        { name: 'Create Template' },
        { name: 'view Templates' },
        { name: 'view Template' },
        { name: 'Edit Template' },
        { name: 'Delete Template' },
        { name: 'Delete Templates' },

        // Permissions for users
        { name: 'view Users' },
        { name: 'view user' },
        { name: 'Create Users' },
        { name: 'Delete User' },
        { name: 'Delete Users' },

        // Permissions for categories
        { name: 'view all categories' },
        { name: 'view Category' },
        { name: 'edit Categories' },
        { name: 'delete Category' },
        { name: 'delete Categories' },
    ];

    // Step 1: Loop through each permission and save if not already existing
    for (const permission of newPermissions) {
        const existingPermission = await AppDataSource.manager.findOne(Permission, {
            where: { name: permission.name },
        });

        // Only save if permission does not already exist
        if (!existingPermission) {
            const newPermission = new Permission();
            newPermission.name = permission.name;
            newPermission.status = 'active'; 
            newPermission.createdAt = new Date();

            await AppDataSource.manager.save(newPermission);
            console.log(`Permission '${permission.name}' has been added.`);
        } else {
            console.log(`Permission '${permission.name}' already exists.`);
        }
    }

    console.log("Seeding permissions completed.");
    await AppDataSource.destroy();
}

seedPermissions().catch((error) => console.log(error));

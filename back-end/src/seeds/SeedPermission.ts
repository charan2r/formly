import { Permission } from "src/model/permission.entity";
import AppDataSource from "ormconfig";

async function seedPermissions() {
    await AppDataSource.initialize();

    // Define the new permissions
    const newPermissions = [
        // Permissions for form fields
        // { name: 'create feilds' },  -- since a template needs to retain and show information 
        // { name: 'view Fields' },    -- about fields and options no need to maintain permissions for this section
        // { name: 'view Field' },
        // { name: 'delete Field' },
        // { name: 'Delete Fields' },
        // { name: 'Edit Fields' },

        // // Permissions for form field options
        // { name: 'add feild option' },
        // { name: 'view feild options' },
        // { name: 'view feild option' },
        // { name: 'edit feild options' },
        // { name: 'delete feild option' },
        // { name: 'delete feild options' },

        // Permissions for form templates
        { name: 'Create Template' },
        { name: 'View Template' },
        { name: 'Edit Template' },
        { name: 'Delete Template' },

        // Permissions for users
        { name: 'View User' },
        { name: 'Create User' },
        { name: 'Delete User' },
        { name: 'Edit User'},

        // Permissions for categories
        { name: 'View Category' },
        { name: 'Edit Category' },
        { name: 'Delete Category' },
        {name: 'Create Category'},

        // Permissions for roles
        { name: 'View Role' },
        { name: 'Edit Role' },
        { name: 'Delete Role' },
        { name: 'Create Role' },

        // Permissions for forms
        { name: 'View Form' },
        { name: 'Create Form' },
        { name: 'Edit Form' },
        { name: 'Delete Form' },


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

import { SetMetadata } from '@nestjs/common';

export const Roles = (...userType: string[]) => {
    //console.log('Setting roles for the route:', userType);
    return SetMetadata('roles', userType);
};
import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730451033839 implements MigrationInterface {
    name = ' $npmConfigName1730451033839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum" RENAME TO "user_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('PlatformAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum" USING "userType"::"text"::"public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum_old" AS ENUM('SuperSuperAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum_old" USING "userType"::"text"::"public"."user_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum_old" RENAME TO "user_usertype_enum"`);
    }

}

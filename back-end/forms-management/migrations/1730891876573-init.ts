import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730891876573 implements MigrationInterface {
    name = 'Init1730891876573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_66032956fe224da9fa3be7e7da9"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "superSuperAdminId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "superUserId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationOrgId"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "category" text`);
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum" RENAME TO "user_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('PlatformAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum" USING "userType"::"text"::"public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum_old"`);
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
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum_old" AS ENUM('SuperSuperAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum_old" USING "userType"::"text"::"public"."user_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum_old" RENAME TO "user_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "category" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationOrgId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "superUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "superSuperAdminId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_66032956fe224da9fa3be7e7da9" FOREIGN KEY ("organizationOrgId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

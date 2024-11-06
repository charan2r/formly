import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730890446897 implements MigrationInterface {
    name = 'Init1730890446897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "logo" text, "phone" text, "street" text, "city" text, "state" text, "zip" text, "website" text, "superAdminId" uuid, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_997ddda7c55b54ee3768a8cb407" PRIMARY KEY ("orgId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "phoneNumber" text, "userType" "public"."user_usertype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "logo"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "zip"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "superAdminId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "logo" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "street" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "city" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "state" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "zip" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "website" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "superAdminId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "superSuperAdminId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "category" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "superUserId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationOrgId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum" RENAME TO "user_usertype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('SuperSuperAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum" USING "userType"::"text"::"public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_66032956fe224da9fa3be7e7da9" FOREIGN KEY ("organizationOrgId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_66032956fe224da9fa3be7e7da9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum_old" AS ENUM('PlatformAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "userType" TYPE "public"."user_usertype_enum_old" USING "userType"::"text"::"public"."user_usertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_usertype_enum_old" RENAME TO "user_usertype_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationOrgId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "superUserId"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "superSuperAdminId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "superAdminId"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "zip"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "street"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "logo"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "superAdminId" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "website" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "zip" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "state" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "city" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "street" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "logo" text`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}

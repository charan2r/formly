import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730878541101 implements MigrationInterface {
    name = ' $npmConfigName1730878541101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('SuperSuperAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL, "superUserId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationOrgId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "superSuperAdminId" uuid NOT NULL, "category" text, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_997ddda7c55b54ee3768a8cb407" PRIMARY KEY ("orgId"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_66032956fe224da9fa3be7e7da9" FOREIGN KEY ("organizationOrgId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_66032956fe224da9fa3be7e7da9"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
    }

}

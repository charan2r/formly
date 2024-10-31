import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigrate1730380359256 implements MigrationInterface {
    name = 'InitMigrate1730380359256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "superSuperAdminId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_997ddda7c55b54ee3768a8cb407" PRIMARY KEY ("orgId"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('SuperSuperAdmin', 'SuperAdmin', 'SubUser')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL, "superUserId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}

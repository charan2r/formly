import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1730552582772 implements MigrationInterface {
    name = 'Init1730552582772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "organizationOrgId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_66032956fe224da9fa3be7e7da9" FOREIGN KEY ("organizationOrgId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_66032956fe224da9fa3be7e7da9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "organizationOrgId"`);
    }

}

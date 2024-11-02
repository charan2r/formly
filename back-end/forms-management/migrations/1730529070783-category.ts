import { MigrationInterface, QueryRunner } from "typeorm";

export class Category1730529070783 implements MigrationInterface {
    name = 'Category1730529070783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "category" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "lastActive" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_b0d30285f6775593196167e2016"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "lastActive"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_b0d30285f6775593196167e2016" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

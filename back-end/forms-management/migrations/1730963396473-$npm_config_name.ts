import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1730963396473 implements MigrationInterface {
    name = ' $npmConfigName1730963396473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "status" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "status" SET DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "status" DROP NOT NULL`);
    }

}

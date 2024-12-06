import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733463829008 implements MigrationInterface {
    name = 'Migrations1733463829008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_template" ADD "borderWidth" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "borderRadius" integer DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."form_template_borderstyle_enum" AS ENUM('solid', 'dashed', 'dotted', 'double')`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "borderStyle" "public"."form_template_borderstyle_enum" DEFAULT 'solid'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "borderColor" character varying(7) DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowX" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowY" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowBlur" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowSpread" integer DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowColor" character varying(7) DEFAULT '#000000'`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD "boxShadowOpacity" double precision DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowOpacity"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowColor"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowSpread"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowBlur"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowY"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "boxShadowX"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "borderColor"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "borderStyle"`);
        await queryRunner.query(`DROP TYPE "public"."form_template_borderstyle_enum"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "borderRadius"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP COLUMN "borderWidth"`);
    }

}

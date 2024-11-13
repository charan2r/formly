import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1731463462081 implements MigrationInterface {
    name = ' $npmConfigName1731463462081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "logo" text, "phone" text, "street" text, "city" text, "state" text, "zip" text, "category" text, "website" text, "superAdminId" uuid, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" text DEFAULT 'active', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_997ddda7c55b54ee3768a8cb407" PRIMARY KEY ("orgId"))`);
        await queryRunner.query(`CREATE TABLE "form_fields_option" ("formFieldsOptionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "option" character varying(255) NOT NULL, "field_id" uuid NOT NULL, CONSTRAINT "PK_65756bcc56f7aeb09e5bf24cb04" PRIMARY KEY ("formFieldsOptionId"))`);
        await queryRunner.query(`CREATE TABLE "form_fields" ("fieldId" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" character varying(255), "question" character varying(255) NOT NULL, "type" character varying(50) NOT NULL, "section_id" uuid NOT NULL, CONSTRAINT "PK_881ec1ba12f49d02621b1d9a933" PRIMARY KEY ("fieldId"))`);
        await queryRunner.query(`CREATE TABLE "section" ("sectionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "form_template_id" uuid NOT NULL, CONSTRAINT "PK_9f58a6ea1d0ada90936198cac7c" PRIMARY KEY ("sectionId"))`);
        await queryRunner.query(`CREATE TABLE "form" ("formId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "form_template_id" uuid NOT NULL, CONSTRAINT "PK_33c609c116b70de2102ccf364f4" PRIMARY KEY ("formId"))`);
        await queryRunner.query(`CREATE TABLE "form_template" ("formTemplateId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "version" integer NOT NULL DEFAULT '1', "status" character varying(255), "headerText" character varying(255), "headerImageUrl" text, "questionFontStyle" character varying(255), "questionTextColor" character varying(255), "backgroundColor" character varying(255), "headerImage" text, "logoImage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, CONSTRAINT "PK_700206835ec31e8ac7823ff9d78" PRIMARY KEY ("formTemplateId"))`);
        await queryRunner.query(`CREATE TABLE "category" ("categoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "user_id" uuid NOT NULL, CONSTRAINT "PK_8a300c5ce0f70ed7945e877a537" PRIMARY KEY ("categoryId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "phoneNumber" text, "userType" "public"."user_usertype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form_fields_option" ADD CONSTRAINT "FK_9f9061bc2852674f23d77916e19" FOREIGN KEY ("field_id") REFERENCES "form_fields"("fieldId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_fields" ADD CONSTRAINT "FK_aba59d4fd998e34b736da0f59b3" FOREIGN KEY ("section_id") REFERENCES "section"("sectionId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "section" ADD CONSTRAINT "FK_0d579e2c8d8f9a0b38fb48a6699" FOREIGN KEY ("form_template_id") REFERENCES "form_template"("formTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_c0b2d02ea98cc1984ee61842332" FOREIGN KEY ("form_template_id") REFERENCES "form_template"("formTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD CONSTRAINT "FK_0ca5481e0a49fe268661a372155" FOREIGN KEY ("category_id") REFERENCES "category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6562e564389d0600e6e243d9604" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6562e564389d0600e6e243d9604"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP CONSTRAINT "FK_0ca5481e0a49fe268661a372155"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_c0b2d02ea98cc1984ee61842332"`);
        await queryRunner.query(`ALTER TABLE "section" DROP CONSTRAINT "FK_0d579e2c8d8f9a0b38fb48a6699"`);
        await queryRunner.query(`ALTER TABLE "form_fields" DROP CONSTRAINT "FK_aba59d4fd998e34b736da0f59b3"`);
        await queryRunner.query(`ALTER TABLE "form_fields_option" DROP CONSTRAINT "FK_9f9061bc2852674f23d77916e19"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "form_template"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TABLE "section"`);
        await queryRunner.query(`DROP TABLE "form_fields"`);
        await queryRunner.query(`DROP TABLE "form_fields_option"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}

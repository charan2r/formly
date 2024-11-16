import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1731741276924 implements MigrationInterface {
    name = 'Migrations1731741276924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "form_fields_option" ("formFieldsOptionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "option" text NOT NULL, "formFieldFieldId" uuid, CONSTRAINT "PK_65756bcc56f7aeb09e5bf24cb04" PRIMARY KEY ("formFieldsOptionId"))`);
        await queryRunner.query(`CREATE TABLE "form_fields" ("fieldId" uuid NOT NULL DEFAULT uuid_generate_v4(), "image" text, "question" text NOT NULL, "type" character varying NOT NULL, "sectionSectionId" uuid, CONSTRAINT "PK_881ec1ba12f49d02621b1d9a933" PRIMARY KEY ("fieldId"))`);
        await queryRunner.query(`CREATE TABLE "section" ("sectionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "formTemplateFormTemplateId" uuid, CONSTRAINT "PK_9f58a6ea1d0ada90936198cac7c" PRIMARY KEY ("sectionId"))`);
        await queryRunner.query(`CREATE TABLE "form" ("formId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "formTemplateFormTemplateId" uuid, CONSTRAINT "PK_33c609c116b70de2102ccf364f4" PRIMARY KEY ("formId"))`);
        await queryRunner.query(`CREATE TABLE "form_template" ("formTemplateId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text NOT NULL, "version" integer NOT NULL, "status" character varying(50) NOT NULL, "headerText" character varying(255), "headerImageUrl" character varying(255), "questionFontStyle" character varying(100), "questionTextColor" character varying(7), "backgroundColor" character varying(7), "headerImage" character varying(255), "logoImage" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "categoryCategoryId" uuid, CONSTRAINT "PK_700206835ec31e8ac7823ff9d78" PRIMARY KEY ("formTemplateId"))`);
        await queryRunner.query(`CREATE TABLE "category" ("categoryId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationOrgId" uuid, CONSTRAINT "PK_8a300c5ce0f70ed7945e877a537" PRIMARY KEY ("categoryId"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("orgId" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "logo" text, "phone" text, "street" text, "city" text, "state" text, "zip" text, "category" text, "website" text, "superAdminId" uuid, "lastActive" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" text DEFAULT 'active', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_997ddda7c55b54ee3768a8cb407" PRIMARY KEY ("orgId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "passwordHash" text NOT NULL, "phoneNumber" text, "userType" "public"."user_usertype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lastLogin" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "form_fields_option" ADD CONSTRAINT "FK_830704a557bf93ada5fe37c10ed" FOREIGN KEY ("formFieldFieldId") REFERENCES "form_fields"("fieldId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_fields" ADD CONSTRAINT "FK_37c0a9721e32005494327d57aa5" FOREIGN KEY ("sectionSectionId") REFERENCES "section"("sectionId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "section" ADD CONSTRAINT "FK_fb1a95e74705a03be7093959f9e" FOREIGN KEY ("formTemplateFormTemplateId") REFERENCES "form_template"("formTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form" ADD CONSTRAINT "FK_e19aa98b5d8d7e9a9fa52d2c074" FOREIGN KEY ("formTemplateFormTemplateId") REFERENCES "form_template"("formTemplateId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "form_template" ADD CONSTRAINT "FK_628100750ebfd373e81a9504810" FOREIGN KEY ("categoryCategoryId") REFERENCES "category"("categoryId") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_9e9f9a2de06cb9abcf700e8841a" FOREIGN KEY ("organizationOrgId") REFERENCES "organization"("orgId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("orgId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_9e9f9a2de06cb9abcf700e8841a"`);
        await queryRunner.query(`ALTER TABLE "form_template" DROP CONSTRAINT "FK_628100750ebfd373e81a9504810"`);
        await queryRunner.query(`ALTER TABLE "form" DROP CONSTRAINT "FK_e19aa98b5d8d7e9a9fa52d2c074"`);
        await queryRunner.query(`ALTER TABLE "section" DROP CONSTRAINT "FK_fb1a95e74705a03be7093959f9e"`);
        await queryRunner.query(`ALTER TABLE "form_fields" DROP CONSTRAINT "FK_37c0a9721e32005494327d57aa5"`);
        await queryRunner.query(`ALTER TABLE "form_fields_option" DROP CONSTRAINT "FK_830704a557bf93ada5fe37c10ed"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "form_template"`);
        await queryRunner.query(`DROP TABLE "form"`);
        await queryRunner.query(`DROP TABLE "section"`);
        await queryRunner.query(`DROP TABLE "form_fields"`);
        await queryRunner.query(`DROP TABLE "form_fields_option"`);
    }

}

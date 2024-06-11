import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717364362835 implements MigrationInterface {
    name = 'Default1717364362835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blood_pressures" ("id" SERIAL NOT NULL, "date" date NOT NULL, "systolic" integer NOT NULL, "diastolic" integer NOT NULL, "level" text NOT NULL, "userId" integer, CONSTRAINT "PK_11d11f9465246b103bf4950db8c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blood_pressures" ADD CONSTRAINT "FK_2181f6f286c4f5ccc69df9c2cbe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_pressures" DROP CONSTRAINT "FK_2181f6f286c4f5ccc69df9c2cbe"`);
        await queryRunner.query(`DROP TABLE "blood_pressures"`);
    }

}

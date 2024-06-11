import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717366479896 implements MigrationInterface {
    name = 'Default1717366479896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "imc" ("id" SERIAL NOT NULL, "weight" numeric(5,2) NOT NULL, "height" numeric(5,2) NOT NULL, "imc" numeric(5,1) NOT NULL, "level" text NOT NULL, "userId" integer, CONSTRAINT "PK_b2f38b824da5846f543dcee14cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "imc" ADD CONSTRAINT "FK_6fee97a8f3df28f4608e35ee3c9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imc" DROP CONSTRAINT "FK_6fee97a8f3df28f4608e35ee3c9"`);
        await queryRunner.query(`DROP TABLE "imc"`);
    }

}

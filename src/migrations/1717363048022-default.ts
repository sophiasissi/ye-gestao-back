import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717363048022 implements MigrationInterface {
    name = 'Default1717363048022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glucoses" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "glucoses" ADD CONSTRAINT "FK_c5389771be648282697de7c4cfd" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "glucoses" DROP CONSTRAINT "FK_c5389771be648282697de7c4cfd"`);
        await queryRunner.query(`ALTER TABLE "glucoses" DROP COLUMN "userId"`);
    }

}

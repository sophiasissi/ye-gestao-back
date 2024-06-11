import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1717893612546 implements MigrationInterface {
    name = 'Default1717893612546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medications" ADD "name" text NOT NULL DEFAULT 'semNome'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medications" DROP COLUMN "name"`);
    }

}

import { AppDataSource } from "../data-source";
import { Imc } from "../entities/Imc";

export const imcRepository = AppDataSource.getRepository(Imc)
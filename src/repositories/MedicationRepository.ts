import { AppDataSource } from "../data-source";
import { Medication } from "../entities/Medication";

export const medicationRepository = AppDataSource.getRepository(Medication)
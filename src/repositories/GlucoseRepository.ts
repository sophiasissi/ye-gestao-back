import { AppDataSource } from "../data-source";
import { Glucose } from "../entities/Glucose";

export const glucoseRepository = AppDataSource.getRepository(Glucose)
import { AppDataSource } from "../data-source";
import { Consultation } from "../entities/Consultation";

export const consultationRepository = AppDataSource.getRepository(Consultation)
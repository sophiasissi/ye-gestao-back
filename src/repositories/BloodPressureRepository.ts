import { AppDataSource } from "../data-source";
import { BloodPressure } from "../entities/BloodPressure";

export const bloodPressureRepository = AppDataSource.getRepository(BloodPressure)
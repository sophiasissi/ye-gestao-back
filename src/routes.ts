import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { GlucoseController } from "./controllers/GlucoseController";
import { BloodPressureController } from "./controllers/BloodPressureController";
import { ImcController } from "./controllers/ImcController";
import { ConsultationController } from "./controllers/ConsultationController";
import { MedicationController } from "./controllers/MedicationController";
import { Request, Response } from "express";

const routes = Router();

// LOGIN ROUTES
routes.get('/', (req: Request, res: Response) => {
    return res.json({ message: 'Hello World' });
});
routes.post('/user', new UserController().create)
routes.post('/login', new UserController().login)

routes.use(authMiddleware)
// USER ROUTES PROTECTED
routes.get('/verifyToken', new UserController().validateToken)
routes.get('/user', new UserController().getUser)
routes.put('/user', new UserController().updateUser)
routes.delete('/user', new UserController().deleteUser)
// GLUCOSE ROUTES PROTECTED
routes.get('/glucose', new GlucoseController().getAllGlucose)
routes.get('/glucose/:id', new GlucoseController().getGlucoseById)
routes.post('/glucose', new GlucoseController().create)
routes.delete('/glucose/:id', new GlucoseController().deleteGlucose)
// BLOOD PRESSURE ROUTES PROTECTED
routes.get('/blood-pressure', new BloodPressureController().getAllBloodPressure)
routes.get('/blood-pressure/:id', new BloodPressureController().getBloodPressureById)
routes.post('/blood-pressure', new BloodPressureController().create)
routes.delete('/blood-pressure/:id', new BloodPressureController().deleteBloodPressure)
// IMC ROUTES PROTECTED
routes.get('/imc', new ImcController().getAllImc)
routes.get('/imc/:id', new ImcController().getImcById)
routes.post('/imc', new ImcController().create)
routes.delete('/imc/:id', new ImcController().deleteImc)
// CONSULTATION ROUTES PROTECTED
routes.get('/consultation', new ConsultationController().getAllConsultations)
routes.get('/consultation/:id', new ConsultationController().getConsultationById)
routes.post('/consultation', new ConsultationController().create)
routes.delete('/consultation/:id', new ConsultationController().deleteConsultation)
// MEDICATION ROUTES PROTECTED
routes.get('/medication', new MedicationController().getAllMedication)
routes.get('/medication/:id', new MedicationController().getMedicationById)
routes.post('/medication', new MedicationController().create)
routes.delete('/medication/:id', new MedicationController().deleteMedication)

export default routes;
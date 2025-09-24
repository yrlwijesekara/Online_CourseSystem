import express from 'express';
import {generateCertificate, downloadCertificate, getUserCertificates, verifyCertificate, revokeCertificate} from "../controllers/certificateController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {roleCheck} from "../middleware/roleCheck.js";

const certificateRouter = express.Router();

certificateRouter.use(authMiddleware)

certificateRouter.post('/generate',roleCheck("INSTRUCTOR") , generateCertificate);
certificateRouter.get('/download/:id', downloadCertificate);
certificateRouter.get('/:userId', getUserCertificates);
certificateRouter.post('/verify/:certificateId', verifyCertificate);
certificateRouter.post('/revoke/:certificateId', revokeCertificate);

export default certificateRouter;
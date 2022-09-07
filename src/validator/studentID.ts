import { Request, Response, Router } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  let validate = false;
  if (req.body.value.origin === undefined) return res.status(200).json({ status: 'ERROR' });

  try {
    if (req.body.value.origin.toString().length !== 8) throw new Error('LENGTH IS NOT 8 DIGITS');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    Number(req.body.value.origin.toString());
    validate = true;
  } catch (err) {
    validate = false;
  }
  res.status(200).json({ status: `${validate ? 'SUCCESS' : 'FAIL'}` });
});
export default router;

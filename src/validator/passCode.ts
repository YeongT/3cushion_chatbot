import { Request, Response, Router } from 'express';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  let validate = false;
  if (req.body.value.origin === undefined) return res.status(200).json({ status: 'ERROR' });

  try {
    if (req.body.value.origin.toString().length !== 4) throw new Error('LENGTH IS NOT 4 DIGITS');
    if (isNaN(Number(req.body.value.origin.toString()))) throw new Error('NOT NUMBER INPUT');
    validate = true;
  } catch (err) {
    validate = false;
  }
  res.status(200).json({ status: `${validate ? 'SUCCESS' : 'FAIL'}` });
});
export default router;

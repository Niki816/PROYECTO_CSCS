import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { signToken, verifyPassword } from '../lib/auth';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const ok = await verifyPassword(password, usuario.password);
  if (!ok) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = signToken({ id: usuario.id, email: usuario.email });
  res.json({
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
  });
});

export default router;
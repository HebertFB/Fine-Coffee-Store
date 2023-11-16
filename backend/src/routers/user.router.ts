import { Router } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from '../constants/http_status';
import bcrypt from 'bcryptjs';
const router = Router();


router.get("/", asyncHandler(
  async (req, res) => {
    const users = await UserModel.find().sort({ name: 1 });
    res.send(users);
  }
))

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  res.send(user);
}));

router.post("/login", asyncHandler(
  async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenReponse(user));
    }
    else {
      res.status(HTTP_BAD_REQUEST).send("Nome de usuário ou senha inválidos!");
    }
  }
));

router.post('/register', asyncHandler(
  async (req, res) => {
    const { name, email, password, address, phone, numberHouse,
      cep, city, stateUF, district, complement } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send('O usuário já existe, por favor faça o login!');
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      phone,
      address,
      numberHouse,
      cep,
      city,
      stateUF,
      district,
      complement,
      isAdmin: false,
      isOwner: false,
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  }
));

router.put('/update/:id', asyncHandler(
  async (req, res) => {
    const userId = req.params.id;
    const { name, address, phone, numberHouse,
      cep, city, stateUF, district, complement } = req.body;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(HTTP_NOT_FOUND).send('Usuário não encontrado!');
        return;
      }

      user.name = name;
      user.phone = phone;
      user.address = address;
      user.numberHouse = numberHouse;
      user.cep = cep;
      user.city = city;
      user.stateUF = stateUF;
      user.district = district;
      user.complement = complement;

      await user.save();
      res.send(generateTokenReponse(user));
    } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send();
    }
  }
));

router.put('/newAdmin/:id', asyncHandler(
  async (req, res) => {
    const userId = req.params.id;
    const { isAdmin } = req.body;

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(HTTP_NOT_FOUND).send('Usuário não encontrado');
        return;
      }

      user.isAdmin = isAdmin;

      await user.save();
      res.send(user);
    } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send();
    }
  }
));

router.delete('/delete/:id', asyncHandler(
  async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(HTTP_NOT_FOUND).send('Usuário não encontrado');
        return;
      }

      await UserModel.deleteOne({ _id: userId });
      res.send(generateTokenReponse(user));
    } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send();
    }
  }
));


const generateTokenReponse = (user: User) => {
  const token = jwt.sign({
    id: user.id, email: user.email, isAdmin: user.isAdmin, isOwner: user.isOwner
  }, process.env.JWT_SECRET!, {
    expiresIn: "30d"
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    token: token,
    phone: user.phone,
    address: user.address,
    numberHouse: user.numberHouse,
    cep: user.cep,
    city: user.city,
    stateUF: user.stateUF,
    district: user.district,
    complement: user.complement,
    isAdmin: user.isAdmin,
    isOwner: user.isOwner,
  };
}


export default router;
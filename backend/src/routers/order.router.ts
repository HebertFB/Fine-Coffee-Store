import asyncHandler from 'express-async-handler';
import auth from '../middlewares/auth.mid';
import { Router } from 'express';
import { HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR, HTTP_NOT_FOUND } from '../constants/http_status';
import { Order, OrderModel } from '../models/order.model';
import jwt from 'jsonwebtoken';
const router = Router();

router.use(auth);


router.get("/allstatus", asyncHandler(
  async (req, res) => {
    const orders = await OrderModel.find();
    res.send(orders);
  }
))

router.get('/userOrders', asyncHandler(
  async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      if (userId) {
        if (req.user.isAdmin) {
          const allOrders = await OrderModel.find().sort({ createdAt: -1 });
          res.send(allOrders);
        } else {
          const userOrders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });
          res.send(userOrders);
        }
      } else {
        res.status(HTTP_BAD_REQUEST).send('Acesso não autorizado. ID do usuário não encontrado.');
      }
    } catch (error) {
      res.status(HTTP_BAD_REQUEST).send('Erro ao buscar pedidos do usuário atual.');
    }
  }
));

router.delete('/deleteUndefinedPaymentOrders', asyncHandler(
  async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const isAdmin = req.user.isAdmin;
      if (isAdmin) {
        await OrderModel.deleteMany({ typePayment: 'undefined' });
      }
      if (!isAdmin) {
        await OrderModel.deleteMany({ user: userId, typePayment: 'undefined' });
      }
      return res.json({ message: 'Pedidos excluídos com sucesso.' });
    } catch (error) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao excluir os pedidos com typePayment === \'undefined\'.' });
    }
  })
);

router.delete('/deleteUserOrders', asyncHandler(
  async (req: any, res: any) => {
    try {
      const userId = req.user.id;

      if (userId) {
        const deletedOrders = await OrderModel.deleteMany({ user: userId });
        return res.json({ message: `${deletedOrders.deletedCount} pedidos do user excluídos com sucesso.` });
      }
    } catch (error) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: 'Erro ao excluir os pedidos do user.' });
    }
  })
);

router.post('/create', asyncHandler(
  async (req: any, res: any) => {
    const requestOrder = req.body;

    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send('Carrinho vazio!');
      return;
    }

    const existingOrder = await OrderModel.findOne({ _id: requestOrder._id });

    if (existingOrder) {
      await OrderModel.deleteOne({ _id: existingOrder._id });
    }

    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);

router.get('/newOrderForCurrentUser', asyncHandler(
  async (req: any, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
  }
));

router.post('/pay', asyncHandler(
  async (req: any, res) => {
    const { paymentId, typePayment } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).send('Pedido não encontrado!');
      return;
    }

    order.paymentId = paymentId;
    order.statusOrder = "NOVO";
    order.statusPayment = "PAGO";
    order.typePayment = typePayment;

    await order.save();
    res.send(order._id);
  }
));

router.post('/payWithCash', asyncHandler(
  async (req: any, res) => {
    const { paymentId, typePayment } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).send('Pedido não encontrado!');
      return;
    }

    order.paymentId = paymentId;
    order.statusPayment = "AGUARDANDO PAGAMENTO";
    order.typePayment = typePayment;

    await order.save();
    res.send(order._id);
  }
));

router.put('/update/:id', asyncHandler(
  async (req, res) => {
    const orderId = req.params.id;
    const { statusOrder, statusPayment, paymentId } = req.body;

    try {
      const order = await OrderModel.findById(orderId);
      if (!order) {
        res.status(HTTP_NOT_FOUND).send('Pedido não encontrado!');
        return;
      }

      order.statusOrder = statusOrder;
      order.paymentId = paymentId;
      order.statusPayment = statusPayment;

      await order.save();
      res.send(generateTokenReponse(order));
    } catch (error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).send();
    }
  }
));

router.get('/:id', asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  res.send(order);
}));

router.get('/payment/:id', asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  res.send(order);
}));

router.get('/track/:id', asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  res.send(order);
}));


async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({ user: req.user.id, statusOrder: "NOVO" })
    .sort({ createdAt: -1 }).exec();
};

const generateTokenReponse = (order: Order) => {
  const token = jwt.sign({
    id: order.id, statusOrder: order.statusOrder,
    paymentId: order.paymentId, statusPayment: order.statusPayment,
  }, process.env.JWT_SECRET!, {
    expiresIn: "30d"
  });

  return {
    statusOrder: order.statusOrder,
    paymentId: order.paymentId,
    statusPayment: order.statusPayment,
  };
};


export default router;
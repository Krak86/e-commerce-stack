INSERT INTO payment_methods (code, is_active)
VALUES
  -- 🇺🇦 Україна
  ('card', true),         -- Банківський переказ на картку (Visa / Mastercard)
  ('cash', true),         -- Готівка при отриманні (нова пошта, укрпошта, кур'єр)
  ('liqpay', true),       -- LiqPay від ПриватБанку
  ('mono', true),         -- Monobank QR / токен
  ('applepay', true),     -- Apple Pay
  ('googlepay', true),    -- Google Pay
  ('easypay', true),      -- EasyPay (термінали, інтернет-банкінг)
  ('portmone', true),     -- Portmone (термінали, інтернет-банкінг)
  ('cashondelivery', true), -- Накладений платіж
  ('other', true),       -- Інший спосіб оплати (поповнення мобільного, подарунковий сертифікат, тощо)
  -- 🌍 Світові
  ('paypal', true),       -- PayPal
  ('stripe', true),       -- Stripe (API для карток, Apple/Google Pay)
  ('crypto', false);      -- Криптовалюта (BTC, ETH, USDT)


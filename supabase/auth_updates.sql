-- 1. Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies using existing profile_id and customer_id
-- (Note: profiles.id references auth.users.id, so auth.uid() directly matches profile_id/customer_id)

-- Addresses (uses profile_id)
CREATE POLICY "Users can view own addresses" ON addresses FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own addresses" ON addresses FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own addresses" ON addresses FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own addresses" ON addresses FOR DELETE USING (auth.uid() = profile_id);

-- Wishlists (uses profile_id)
CREATE POLICY "Users can view own wishlists" ON wishlists FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own wishlists" ON wishlists FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own wishlists" ON wishlists FOR DELETE USING (auth.uid() = profile_id);

-- Carts (uses profile_id)
CREATE POLICY "Users can view own carts" ON carts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own carts" ON carts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own carts" ON carts FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own carts" ON carts FOR DELETE USING (auth.uid() = profile_id);

-- Cart Items (Join to cart to check access via profile_id)
CREATE POLICY "Users can view own cart items" ON cart_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.profile_id = auth.uid())
);
CREATE POLICY "Users can insert own cart items" ON cart_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.profile_id = auth.uid())
);
CREATE POLICY "Users can update own cart items" ON cart_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.profile_id = auth.uid())
);
CREATE POLICY "Users can delete own cart items" ON cart_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.profile_id = auth.uid())
);

-- Orders (uses customer_id)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);

-- Order Items (Join to orders to check access via customer_id)
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);

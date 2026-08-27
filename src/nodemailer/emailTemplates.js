// ============================================================
// Shared styles — نفس هوية الموقع (أسود/رمادي متدرج، خلفية بيضاء)
// ============================================================
const base = {
  body: `margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;`,
  wrapper: `width:100%;background:#f4f4f5;padding:40px 0;`,
  container: `width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;`,
  header: `background:linear-gradient(135deg,#1f2937,#374151,#000000);padding:36px 30px;text-align:center;`,
  brand: `margin:0;color:#ffffff;font-size:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;`,
  headerTitle: `margin:14px 0 0;color:#ffffff;font-size:28px;font-weight:800;line-height:1.3;`,
  body_td: `padding:36px 40px;`,
  greeting: `margin:0 0 16px;color:#111827;font-size:20px;font-weight:800;`,
  text: `color:#6b7280;line-height:1.7;font-size:14px;margin:0 0 14px;`,
  card: `background:#f9fafb;border-radius:16px;padding:20px;margin:20px 0;`,
  divider: `border:none;border-top:1px solid #e5e7eb;margin:20px 0;`,
  button: `display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1f2937,#000000);color:#ffffff;text-decoration:none;border-radius:50px;font-weight:bold;font-size:14px;letter-spacing:0.5px;`,
  footer_td: `padding:28px 30px;text-align:center;background:#f9fafb;border-top:1px solid #f1f1f1;`,
  footerBrand: `margin:0 0 8px;color:#111827;font-size:15px;font-weight:800;letter-spacing:1px;`,
  footerText: `margin:0;color:#9ca3af;font-size:12px;`,
};

const wrap = (title, bodyContent) => `
<!DOCTYPE html>
<html dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
</head>
<body style="${base.body}">
  <div style="${base.wrapper}">
    <table width="600" cellpadding="0" cellspacing="0" style="${base.container}" align="center">
      ${bodyContent}
      <tr>
        <td style="${base.footer_td}">
          <p style="${base.footerBrand}">E-COMMERCE</p>
          <p style="${base.footerText}">© 2026 E-Commerce. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;

const advantagesGrid = () => `
<div style="margin:24px 0;">
  <p style="text-align:center;color:#111827;font-size:15px;font-weight:800;margin:0 0 16px;">
    WHY SHOP WITH US
  </p>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td width="50%" style="padding:6px;">
        <div style="background:#f9fafb;border-radius:14px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:bold;color:#111827;">🚚 Fast Delivery</p>
        </div>
      </td>
      <td width="50%" style="padding:6px;">
        <div style="background:#f9fafb;border-radius:14px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:bold;color:#111827;">↩️ Easy Returns</p>
        </div>
      </td>
    </tr>
    <tr>
      <td width="50%" style="padding:6px;">
        <div style="background:#f9fafb;border-radius:14px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:bold;color:#111827;">📦 Secure Packaging</p>
        </div>
      </td>
      <td width="50%" style="padding:6px;">
        <div style="background:#f9fafb;border-radius:14px;padding:16px;text-align:center;">
          <p style="margin:0;font-size:13px;font-weight:bold;color:#111827;">🕐 24/7 Support</p>
        </div>
      </td>
    </tr>
  </table>
</div>
`;

// ============================================================
// 1. Verify Email
// ============================================================
export const verifyEmailTemplate = (name = "User", code = "000000") => {
  return wrap("Verify Your Email - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Verify Your Email</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <h2 style="${base.greeting}">Hey ${name} 👋</h2>
        <p style="${base.text}">Thanks for signing up! Use the code below to verify your email address.</p>

        <div style="text-align:center;font-size:34px;font-weight:800;letter-spacing:10px;margin:24px 0;padding:20px;background:#111827;border-radius:16px;color:#ffffff;">
          ${code}
        </div>

        <p style="${base.text}">This code will expire in <strong style="color:#111827;">15 minutes</strong>.</p>
        <hr style="${base.divider}" />
        <p style="color:#9ca3af;font-size:12px;margin:0;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </td>
    </tr>
  `);
};

// ============================================================
// 2. Welcome Email
// ============================================================
export const welcomeEmailTemplate = (name = "User") => {
  return wrap("Welcome - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Welcome Aboard 🎉</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <h2 style="${base.greeting}">Hey ${name},</h2>
        <p style="${base.text}">Your email has been verified successfully. You now have full access to your account.</p>

        <div style="${base.card}border-left:4px solid #111827;">
          <p style="margin:0;color:#111827;font-size:14px;font-weight:bold;">✅ Account Ready</p>
          <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">Start exploring bold, everyday fashion.</p>
        </div>

        ${advantagesGrid()}
      </td>
    </tr>
  `);
};

// ============================================================
// 3. Reset Password
// ============================================================
export const resetPasswordTemplate = (name = "User", resetLink = "#") => {
  return wrap("Reset Password - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Reset Your Password</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <h2 style="${base.greeting}">Hey ${name} 👋</h2>
        <p style="${base.text}">We received a request to reset your password. Click below to set a new one.</p>

        <div style="text-align:center;margin:28px 0;">
          <a href="${resetLink}" style="${base.button}">Reset My Password →</a>
        </div>

        <p style="${base.text}">This link will expire in <strong style="color:#111827;">15 minutes</strong>.</p>

        <div style="${base.card}border-left:4px solid #f59e0b;">
          <p style="margin:0;color:#92400e;font-size:13px;">
            ⚠️ If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </td>
    </tr>
  `);
};

// ============================================================
// 4. Password Changed
// ============================================================
export const passwordChangedTemplate = (name = "User") => {
  return wrap("Password Changed - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Password Updated</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <h2 style="${base.greeting}">Hey ${name} 👋</h2>
        <p style="${base.text}">Your password has been changed successfully.</p>

        <div style="${base.card}border-left:4px solid #111827;">
          <p style="margin:0;color:#111827;font-size:14px;font-weight:bold;">✅ Password Updated Successfully</p>
        </div>

        <div style="${base.card}border-left:4px solid #ef4444;">
          <p style="margin:0;color:#991b1b;font-size:13px;font-weight:bold;">🚨 Wasn't you?</p>
          <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">
            Reset your password immediately and contact support.
          </p>
        </div>
      </td>
    </tr>
  `);
};

// ============================================================
// 5. Order Confirmation — زي "Order Summary" في الصورة
// ============================================================
export const orderConfirmationTemplate = (name = "User", order = {}) => {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f1f1f1;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50" valign="top">
                <img src="${item.image || ""}" width="46" height="46" style="border-radius:10px;object-fit:cover;" />
              </td>
              <td valign="top" style="padding-left:12px;">
                <p style="margin:0;color:#111827;font-size:13px;font-weight:bold;">${item.name}</p>
                <p style="margin:2px 0 0;color:#9ca3af;font-size:12px;">Size: ${item.size} · Qty: ${item.quantity}</p>
              </td>
              <td valign="top" align="right">
                <p style="margin:0;color:#111827;font-size:13px;font-weight:bold;">$${(item.price * item.quantity).toFixed(2)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `
    )
    .join("");

  return wrap("Your Order Confirmation - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Your Order Is Confirmed</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <h2 style="${base.greeting}">Hi ${name} 👋</h2>
        <p style="${base.text}">
          Thanks for your order! We're preparing it now and will keep you posted on its status.
        </p>

        <div style="${base.card}">
          <p style="margin:0 0 12px;color:#111827;font-size:14px;font-weight:800;">ORDER SUMMARY</p>
          <table width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
            <tr>
              <td style="color:#6b7280;font-size:13px;padding:3px 0;">Subtotal</td>
              <td align="right" style="color:#111827;font-size:13px;padding:3px 0;">$${(order.itemsPrice || 0).toFixed(2)}</td>
            </tr>
            ${
              order.coupon
                ? `<tr>
                    <td style="color:#059669;font-size:13px;padding:3px 0;">Discount (${order.coupon.code})</td>
                    <td align="right" style="color:#059669;font-size:13px;padding:3px 0;">-$${order.coupon.discount.toFixed(2)}</td>
                  </tr>`
                : ""
            }
            <tr>
              <td style="color:#111827;font-size:15px;font-weight:800;padding-top:8px;">Total</td>
              <td align="right" style="color:#111827;font-size:15px;font-weight:800;padding-top:8px;">$${(order.totalPrice || 0).toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="${base.card}">
          <p style="margin:0 0 6px;color:#111827;font-size:13px;font-weight:bold;">Shipping To</p>
          <p style="margin:0;color:#6b7280;font-size:13px;">
            ${order.shippingInfo?.fullName} · ${order.shippingInfo?.phone}<br/>
            ${order.shippingInfo?.address}, ${order.shippingInfo?.city}
          </p>
        </div>

        <p style="text-align:center;color:#9ca3af;font-size:12px;margin:20px 0 0;">
          Order ID: <strong style="color:#111827;">${order._id}</strong>
        </p>

        ${advantagesGrid()}
      </td>
    </tr>
  `);
};

// ============================================================
// 6. Admin: New Coupon Created
// ============================================================
export const adminNewCouponTemplate = (coupon = {}) => {
  return wrap("New Coupon Created - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce Admin</p>
        <h1 style="${base.headerTitle}">New Coupon Created</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <p style="${base.text}">A new coupon has been added to the store:</p>

        <div style="${base.card}">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Code</td><td align="right" style="color:#111827;font-size:13px;font-weight:bold;">${coupon.code}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Discount</td><td align="right" style="color:#111827;font-size:13px;font-weight:bold;">${coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Usage Limit</td><td align="right" style="color:#111827;font-size:13px;font-weight:bold;">${coupon.usageLimit}</td></tr>
            <tr><td style="color:#6b7280;font-size:13px;padding:4px 0;">Expires</td><td align="right" style="color:#111827;font-size:13px;font-weight:bold;">${new Date(coupon.expiresAt).toLocaleDateString()}</td></tr>
          </table>
        </div>
      </td>
    </tr>
  `);
};

// ============================================================
// 7. Admin: New Product Added
// ============================================================
export const adminNewProductTemplate = (product = {}) => {
  return wrap("New Product Added - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce Admin</p>
        <h1 style="${base.headerTitle}">New Product Added</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <p style="${base.text}">A new product has been added to the store:</p>

        <div style="${base.card}">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="60" valign="top">
                <img src="${product.images?.[0]?.url || ""}" width="52" height="52" style="border-radius:10px;object-fit:cover;" />
              </td>
              <td valign="top" style="padding-left:12px;">
                <p style="margin:0;color:#111827;font-size:14px;font-weight:bold;">${product.name}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">$${product.price} · Stock: ${product.stock}</p>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  `);
};

// ============================================================
// 8. Admin: Product Updated
// ============================================================
export const adminProductUpdatedTemplate = (product = {}) => {
  return wrap("Product Updated - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce Admin</p>
        <h1 style="${base.headerTitle}">Product Updated</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <p style="${base.text}">A product has been updated in the store:</p>

        <div style="${base.card}">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="60" valign="top">
                <img src="${product.images?.[0]?.url || ""}" width="52" height="52" style="border-radius:10px;object-fit:cover;" />
              </td>
              <td valign="top" style="padding-left:12px;">
                <p style="margin:0;color:#111827;font-size:14px;font-weight:bold;">${product.name}</p>
                <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">$${product.price} · Stock: ${product.stock}</p>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
  `);
};




// ============================================================
// 9. Track Orders (Magic Link)
// ============================================================
export const trackOrdersTemplate = (trackLink = "#") => {
  return wrap("Track Your Orders - E-Commerce", `
    <tr>
      <td style="${base.header}">
        <p style="${base.brand}">🛍️ E-Commerce</p>
        <h1 style="${base.headerTitle}">Track Your Orders</h1>
      </td>
    </tr>
    <tr>
      <td style="${base.body_td}">
        <p style="${base.text}">We received a request to view your order history. Click below to see all your orders.</p>

        <div style="text-align:center;margin:28px 0;">
          <a href="${trackLink}" style="${base.button}">View My Orders →</a>
        </div>

        <p style="${base.text}">This link will expire in <strong style="color:#111827;">15 minutes</strong>.</p>

        <div style="${base.card}border-left:4px solid #f59e0b;">
          <p style="margin:0;color:#92400e;font-size:13px;">
            ⚠️ If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </td>
    </tr>
  `);
};
# Bubble Deployment

## Live Application

```
https://bubble-raneem1.vercel.app/
```

---

## Demo Video

- Video Link: [https://video-link.com ](https://drive.google.com/drive/folders/11f4ixz3JyuhzGclcRaKmFGZU3OG1amWV?usp=sharing) 

---

## Team Members

| Name | ID | Contributions |
|---|---|---|
| Fatimah Alshehab | 202278660 | Back End - Design |
| Raneem Alshahrani | 202277080 | Front End - Documentation |
| Wajd Alghamdi | 202262140 | Back End - Documentation |
| Yasmeen Alshehri | 202271660 | Front End - Design |

---

## Description

This is the deployed version of the **Bubble Soap Store** application.  
The system includes a fully integrated front-end and back-end with MongoDB Atlas.

Users can:
- Browse products
- Add items to cart and wishlist
- Customize soaps
- Apply discount codes
- Checkout and place orders

Admin can:
- Manage products
- Manage inventory
- Manage orders
- Manage promotions
- Manage reviews
- View dashboard analytics

Customer Service can:
- Manage tickets
- Manage FAQ templates

---

## Deployment Setup

### Frontend Deployment (Vercel)

1. Push project to GitHub
2. Go to https://vercel.com
3. Import project
4. Set root directory:
```txt
/
````

5. Build settings:

```txt
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

6. Add environment variable:

```env
VITE_API_URL=https://your-backend-link.onrender.com
```

---

### Database (MongoDB Atlas)

* Database hosted on MongoDB Atlas
* Connected via `MONGO_URL`
* Collections used:

| Collection |
| ---------- |
| users      |
| products   |
| orders     |
| carts      |
| wishlists  |
| promotions |
| reviews    |
| tickets    |
| faqs       |

---

## API Configuration

Frontend communicates with backend using:

```js
const API = import.meta.env.VITE_API_URL;
```

Example:

```js
fetch(`${API}/api/products`)
```

---

## Security

| Feature               | Status              |
| --------------------- | ------------------- |
| JWT Authentication    | Implemented         |
| Role-based access     | Implemented         |
| Environment variables | Secured             |
| MongoDB Atlas         | Secured             |
| HTTPS                 | Enabled via hosting |

---

## Testing

The deployed application has been tested for:

| Feature               | Status |
| --------------------- | ------ |
| Product browsing      | ✅      |
| Cart functionality    | ✅      |
| Wishlist              | ✅      |
| Checkout              | ✅      |
| Orders                | ✅      |
| Admin dashboard       | ✅      |
| Promotions            | ✅      |
| Reviews               | ✅      |
| Tickets & FAQ         | ✅      |
| Mobile responsiveness | ✅      |

---

## Demo Accounts

| Role             | Email                                           | Password   |
| ---------------- | ----------------------------------------------- | ---------- |
| Admin            | [admin@bubble.com](mailto:admin@bubble.com)     | admin123   |
| User             | [user@bubble.com](mailto:user@bubble.com)       | user123    |
| Customer Service | [support@bubble.com](mailto:support@bubble.com) | support123 |

---

## Known Issues

| Issue               | Description                    | Solution                    |
| ------------------- | ------------------------------ | --------------------------- |
| Cart sync delay     | Cart may require refresh       | Add real-time state sync    |
| Order status update | Occasionally fails on wrong ID | Use valid MongoDB `_id`     |
| Auth header errors  | Missing token in API requests  | Ensure Bearer token is sent |

---

## Responsiveness

* Fully responsive for:

  * Desktop
  * Tablet
  * Mobile

---

## Notes

* Backend and frontend are deployed separately
* MongoDB Atlas used for persistent data
* Images handled via Cloudinary
* `.env` variables are not exposed in repository

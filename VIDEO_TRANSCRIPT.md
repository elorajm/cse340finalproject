# Video Transcript – CSE 340 Final Project

> **Estimated runtime:** ~9–10 minutes  
> **Structure:** Part 1 – Project Demonstration (≈3.5 min) · Part 2 – Technical Explanation (≈4 min) · Part 3 – Course Reflection (≈2 min)

---

## Part 1: Project Demonstration (~3.5 minutes)

---

**[Camera on face, browser open to https://cse340finalproject.onrender.com/]**

Hey everyone! My name is Elora, and this is my CSE 340 final project – a full-stack, role-based Classic Car Dealership Management System. I built it with Node.js, Express, PostgreSQL, and EJS, and it's fully deployed on Render. Let me walk you through what it does.

**[Scroll the home page]**

The idea behind this project is to simulate a real dealership's web presence. Any visitor can browse the inventory, read customer reviews, and fill out a contact form – no account needed. But once you log in, you unlock a whole set of features depending on who you are.

**[Click Inventory in the nav]**

Here's the inventory page. You can filter vehicles by category – things like Muscle Cars, Imports, or Classic Trucks – and sort by price or year. Each card shows the vehicle's photo, year, make, model, price, and mileage. Let me click into one.

**[Click a vehicle card]**

On the vehicle detail page, you can see the full description and, at the bottom, customer reviews specific to that car. If I'm logged in, I can also add it to my wishlist – let me show that in a second.

**[Log in as a standard user: eloramathias@gmail.com / 1234Test]**

Now I'm logged in as a standard customer. Notice the nav updated to show my dashboard. Let me add this vehicle to my wishlist.

**[Click the Wishlist button on the vehicle page]**

It toggled – the vehicle is now saved. I can also leave a review.

**[Navigate to Reviews page]**

Reviews can be left for the site in general or tied to a specific vehicle. Users can edit or delete their own reviews too.

**[Navigate to Service → Submit a Request]**

One of the big features is the service request system. I can describe my car, pick a service type – or enter a custom one if I choose "Other" – and submit. Let me fill this out quickly.

**[Fill and submit the form]**

Now let me head to my dashboard.

**[Navigate to /admin/dashboard]**

My personal dashboard shows all my open service requests, my reviews, my wishlist, and any promotions the owner has sent me. Everything is organized in one place.

**[Log out, then log in as employee: elorajacobson@gmail.com / 1234Test]**

Now let me switch to the employee account. Employees have a different dashboard.

**[Navigate to /admin/employee]**

Here employees can see system-wide stats – pending service requests, contact messages, total reviews. Let me open the service admin panel.

**[Navigate to /service/admin]**

Employees can update status on any request – marking it "In Progress," "Completed," or "Cancelled," and add internal notes. That keeps customers informed.

**[Log out, then log in as owner: eloraathias@gmail.com / 1234Test]**

Finally, the owner account has the highest level of access.

**[Navigate to /admin/owner]**

The owner dashboard shows full analytics: total vehicles, total users, pending services, contact messages, all reviews, and customer wishlist activity. From here I can also manage the entire inventory.

**[Navigate to /admin/vehicles]**

I can add, edit, or delete vehicles. Let me show the add form.

**[Navigate to /admin/vehicles/new]**

All the fields are here – year, make, model, price, mileage, category, description, and an optional image filename. The owner can also manage categories, users, and send promotional messages targeted at specific customers.

**One technical challenge I solved** was building the service request status workflow correctly. I had to make sure employees could only set statuses to valid values – "Submitted," "In Progress," "Completed," or "Cancelled" – and that the change was reflected instantly on the user's dashboard. I solved this with a server-side whitelist check before any database update runs, so bad input is caught before it ever touches the database.

---

## Part 2: Technical Explanation (~4 minutes)

---

**[Switch to VS Code or code editor, share screen]**

Now let me walk through the code.

### Database Schema

**[Open the `database/` folder, show migration SQL files]**

The database has ten tables. The core ones are `users`, `vehicles`, `categories`, `reviews`, `service_requests`, `contact_messages`, `wishlists`, `promotions`, and `user_promotions`. There's also a `session` table managed by connect-pg-simple for persisting login sessions.

The relationships are straightforward: `vehicles` belong to a `category`. `reviews`, `service_requests`, and `wishlists` are all tied to a `user_id` via foreign key. `reviews` optionally point at a `vehicle_id` – null means it's a general site review. The `user_promotions` junction table links promotions to the specific users who received them and tracks whether each one has been read.

If I were drawing the ERD, you'd see a standard one-to-many from `users` to `reviews`, from `categories` to `vehicles`, and many-to-many between `users` and `promotions` through that junction table.

### Request Flow

**[Open `src/routes/service.routes.js`]**

Let me trace a POST request to submit a service request. The route file registers `POST /service/new` and chains two middlewares before hitting the controller: `requireLogin`, which checks the session, and the validation rules from `auth.validation`.

**[Open `src/middleware/auth.js`]**

Here's `requireLogin`. It reads `req.session.user` – if there's no session, it flashes an error and redirects to `/auth/login`. Otherwise it calls `next()`.

**[Open `src/controllers/service.controller.js`, show `submitServiceRequest`]**

Inside the controller, I check for validation errors, build the `finalServiceType` (handling the "Other" custom input case), then call the model.

**[Open `src/models/service.model.js`, show `createServiceRequest`]**

The model runs a parameterized SQL `INSERT` using the `pg` pool and returns the new row. Back in the controller, on success I flash a confirmation message and redirect the user to their requests list. That's the full cycle: route → middleware → controller → model → redirect to view.

### Authentication Middleware

**[Stay in `src/middleware/auth.js`, scroll to `requireRole`]**

`requireRole` is a factory function – you pass it one or more allowed roles and it returns a middleware. It first checks if the user is logged in, then checks if their role is in the allowed list. If not, it returns a 403 Forbidden response. This is how I lock down owner-only routes like `/admin/vehicles` without repeating logic everywhere.

**[Show a route file using `requireRole("owner")`]**

You can see it used here – `requireRole("owner")` is passed directly in the route chain before the controller function. Clean and reusable.

### Code I'm Proud Of

**[Open `src/middleware/validate-id.js`]**

The piece of code I'm most proud of is this ID validation middleware. URL parameters come in as strings, and JavaScript's `parseInt` will happily coerce something like `"5abc"` to `5`. I wrote a factory function `validateId` that not only parses the integer but also checks that the string-converted result exactly equals the original input – so `"5abc"` would fail, `"05"` would fail, anything negative fails. This closes off a subtle type coercion attack vector and I was really happy with how concise and reusable it turned out to be. I apply it on every route that takes an ID parameter.

---

## Part 3: Course Reflection (~2 minutes)

---

**[Camera back on face, screen sharing off]**

Looking back on this semester, the thing I'm most proud of learning is how the whole server-side request-response cycle actually works. Before this class, "the backend" was kind of a black box to me. Now I can trace a form submission all the way from the HTML, through the route, through middleware, into the controller, down to a SQL query, and back up into a rendered view. That mental model has been the biggest shift for me.

What stood out most from building this final project was how much careful thought goes into authorization. It's not just "is the user logged in" – it's "which user, with which role, accessing which resource, and should they be allowed to modify it?" Building the `requireRole` middleware and then seeing it hold up correctly across all those different routes was really satisfying.

In terms of how my understanding of backend development has grown – I started the semester thinking of Node.js as just a way to run JavaScript outside the browser. I'm finishing it understanding session management, password security, parameterized queries, middleware pipelines, and MVC architecture. I feel genuinely comfortable building a full application from scratch now, and that's exactly what I set out to do when I enrolled in this class.

Thanks for watching!
